import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getCrm, BOOKING_STAGE, scoreLead } from "@/lib/crm";
import type { PipelineKey } from "@/lib/crm/types";
import { FOUNDER_EMAIL, sendEmail } from "@/lib/email";
import HotLeadAlert from "@/emails/hot-lead-alert";

/**
 * Cal.com webhook → CRM deal.
 * Map each Cal.com event type slug to a pipeline by prefixing it:
 *   myflowmind-discovery, notary-mobile, realty-walkthrough, security-scoping…
 */
const payloadSchema = z.object({
  triggerEvent: z.string(),
  payload: z.object({
    type: z.string(), // event type slug
    title: z.string().optional(),
    attendees: z
      .array(z.object({ email: z.string().email(), name: z.string().optional() }))
      .min(1),
  }),
});

function pipelineFromEventSlug(slug: string): PipelineKey {
  if (slug.startsWith("myflowmind") || slug.includes("automation")) return "myflowmind";
  if (slug.startsWith("realty") || slug.includes("property")) return "realty";
  if (slug.startsWith("notary") || slug.includes("notar")) return "notary";
  if (slug.startsWith("security") || slug.includes("scoping")) return "security";
  return "myflowmind";
}

function verifySignature(rawBody: string, signature: string | null): boolean {
  const secret = process.env.CALCOM_WEBHOOK_SECRET;
  if (!secret) return true; // verification opt-in until the secret is configured
  if (!signature) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  if (!verifySignature(rawBody, request.headers.get("x-cal-signature-256"))) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let parsed;
  try {
    parsed = payloadSchema.parse(JSON.parse(rawBody));
  } catch {
    return NextResponse.json({ ok: false, message: "Bad payload" }, { status: 400 });
  }

  if (parsed.triggerEvent !== "BOOKING_CREATED") {
    return NextResponse.json({ ok: true, skipped: parsed.triggerEvent });
  }

  const attendee = parsed.payload.attendees[0];
  const pipeline = pipelineFromEventSlug(parsed.payload.type);
  const [firstName, ...rest] = (attendee.name ?? "").split(" ");

  try {
    const scored = scoreLead({
      email: attendee.email,
      firstName: firstName || undefined,
      lastName: rest.join(" ") || undefined,
      subsidiary: pipeline,
      intent: "other",
      sourcePage: `cal.com:${parsed.payload.type}`,
      utm: {},
      consent: true, // booking implies contact consent; marketing consent stays separate
      signals: { bookedCall: true },
    });

    const crm = getCrm();
    await crm.upsertContact(scored);
    await crm.createDeal({
      contactEmail: attendee.email,
      pipeline,
      stageId: BOOKING_STAGE[pipeline],
      name: `${parsed.payload.title ?? parsed.payload.type} — ${attendee.name ?? attendee.email}`,
    });

    if (scored.hot) {
      await sendEmail({
        to: FOUNDER_EMAIL,
        subject: `🔥 Hot lead booked a call: ${attendee.email} (${pipeline})`,
        react: HotLeadAlert({ lead: scored }),
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/webhooks/calcom]", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
