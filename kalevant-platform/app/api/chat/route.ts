import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { buildSystemPrompt } from "@/lib/chat";
import { getCrm, INQUIRY_STAGE, scoreLead } from "@/lib/crm";
import type { ScoredLead, Subsidiary } from "@/lib/crm/types";
import { FOUNDER_EMAIL, sendEmail } from "@/lib/email";
import HotLeadAlert from "@/emails/hot-lead-alert";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const CHAT_MODEL = process.env.CHAT_MODEL ?? "claude-opus-4-8";
const MAX_TURNS = 24;
const MAX_TOOL_ROUNDS = 3;

const requestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(4000),
      })
    )
    .min(1)
    .max(MAX_TURNS),
});

const captureLeadInputSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  subsidiary: z.enum(["myflowmind", "realty", "notary", "security", "general"]),
  summary: z.string().min(10).max(2000),
  consent: z.boolean(),
});

const CAPTURE_LEAD_TOOL: Anthropic.Tool = {
  name: "capture_lead",
  description:
    "Write a qualified lead into the Kalevant CRM. Call this ONLY after the visitor has explicitly shared their email address in this conversation AND agreed to be contacted. The summary should capture what they need, in one or two sentences, so the founder can reply usefully.",
  input_schema: {
    type: "object",
    properties: {
      email: { type: "string", description: "Email address the visitor provided verbatim" },
      name: { type: "string", description: "Visitor's name, if they shared it" },
      subsidiary: {
        type: "string",
        enum: ["myflowmind", "realty", "notary", "security", "general"],
        description: "Which Kalevant company the need belongs to",
      },
      summary: {
        type: "string",
        description: "One-to-two sentence summary of what the visitor needs and any timeline/context they shared",
      },
      consent: {
        type: "boolean",
        description: "True only if the visitor explicitly agreed to be contacted",
      },
    },
    required: ["email", "subsidiary", "summary", "consent"],
  },
};

async function executeCaptureLead(rawInput: unknown, sourcePage: string): Promise<string> {
  const parsed = captureLeadInputSchema.safeParse(rawInput);
  if (!parsed.success) {
    return "Error: invalid lead details. Ask the visitor to confirm their email address.";
  }
  const input = parsed.data;
  if (!input.consent) {
    return "Error: the visitor has not agreed to be contacted. Ask for their permission first.";
  }

  const [firstName, ...rest] = (input.name ?? "").trim().split(/\s+/);
  const scored: ScoredLead = scoreLead({
    email: input.email,
    firstName: firstName || undefined,
    lastName: rest.join(" ") || undefined,
    message: input.summary,
    subsidiary: input.subsidiary as Subsidiary,
    intent: "other",
    sourcePage,
    utm: {},
    consent: true,
    signals: {},
  });

  try {
    const crm = getCrm();
    await crm.upsertContact(scored);
    if (input.subsidiary !== "general") {
      await crm.createDeal({
        contactEmail: input.email,
        pipeline: input.subsidiary,
        stageId: INQUIRY_STAGE[input.subsidiary],
        name: `Ask Kalevant lead — ${input.name ?? input.email}`,
      });
    }
    // Chat leads always alert the founder — a visitor who talked to the bot
    // and left an email is warm regardless of score.
    await sendEmail({
      to: FOUNDER_EMAIL,
      subject: `💬 Ask Kalevant lead: ${input.email} (${input.subsidiary})`,
      react: HotLeadAlert({ lead: { ...scored, message: input.summary } }),
    });
    return `Lead captured successfully for ${input.email}. Tell the visitor Rapheal will reply within one business day.`;
  } catch (error) {
    console.error("[api/chat] capture_lead failed", error);
    return "Error: the CRM is unreachable right now. Apologize and direct the visitor to the contact form at /contact.";
  }
}

const FALLBACK_REPLY =
  "Our assistant is offline at the moment — but a human isn't. Use the contact form at /contact and you'll hear back within one business day.";

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ ok: false, message: "Bad request" }, { status: 400 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(FALLBACK_REPLY, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const client = new Anthropic();
  const sourcePage = request.headers.get("referer") ?? "/chat-widget";
  let messages: Anthropic.MessageParam[] = parsed.data.messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        // Agentic loop: stream text to the client; when the model calls
        // capture_lead, execute it server-side and continue streaming.
        for (let round = 0; round <= MAX_TOOL_ROUNDS; round++) {
          const messageStream = client.messages.stream({
            model: CHAT_MODEL,
            max_tokens: 1024,
            system: [
              {
                type: "text",
                text: buildSystemPrompt(),
                cache_control: { type: "ephemeral" },
              },
            ],
            tools: [CAPTURE_LEAD_TOOL],
            messages,
          });

          messageStream.on("text", (delta) => {
            controller.enqueue(encoder.encode(delta));
          });

          const finalMessage = await messageStream.finalMessage();

          const toolUseBlocks = finalMessage.content.filter(
            (b): b is Anthropic.ToolUseBlock => b.type === "tool_use"
          );
          if (finalMessage.stop_reason !== "tool_use" || toolUseBlocks.length === 0) {
            break;
          }

          const toolResults: Anthropic.ToolResultBlockParam[] = [];
          for (const block of toolUseBlocks) {
            const result =
              block.name === "capture_lead"
                ? await executeCaptureLead(block.input, sourcePage)
                : `Unknown tool: ${block.name}`;
            toolResults.push({
              type: "tool_result",
              tool_use_id: block.id,
              content: result,
            });
          }

          messages = [
            ...messages,
            { role: "assistant", content: finalMessage.content },
            { role: "user", content: toolResults },
          ];
        }
      } catch (error) {
        console.error("[api/chat]", error);
        controller.enqueue(encoder.encode(`\n\n${FALLBACK_REPLY}`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
