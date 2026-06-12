import { NextResponse } from "next/server";
import { captureLead } from "@/lib/leads";
import { newsletterSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    await captureLead({
      email: parsed.data.email,
      subsidiary: "general",
      intent: "newsletter",
      sourcePage: parsed.data.sourcePage,
      consent: parsed.data.consent,
      signals: { newsletterSignup: true },
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/newsletter]", error);
    return NextResponse.json(
      { ok: false, message: "Subscription failed. Please try again." },
      { status: 500 }
    );
  }
}
