import { NextResponse } from "next/server";
import { captureLead } from "@/lib/leads";
import { getCrm, INQUIRY_STAGE } from "@/lib/crm";
import { contactSchema, INTENT_ROUTING } from "@/lib/validation";

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const values = parsed.data;
  const route = INTENT_ROUTING[values.intent];

  try {
    await captureLead({
      email: values.email,
      firstName: values.firstName,
      lastName: values.lastName || undefined,
      phone: values.phone || undefined,
      company: values.company || undefined,
      message: values.message,
      subsidiary: route.subsidiary,
      intent: values.intent === "real_estate" ? "real_estate" : values.intent,
      sourcePage: values.sourcePage,
      consent: values.consent,
    });

    // Route into the matching pipeline (general inquiries stay contact-only).
    if (route.subsidiary !== "general") {
      await getCrm().createDeal({
        contactEmail: values.email,
        pipeline: route.subsidiary,
        stageId: INQUIRY_STAGE[route.subsidiary],
        name: `${route.label} inquiry — ${values.firstName} ${values.lastName ?? ""}`.trim(),
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/leads]", error);
    return NextResponse.json(
      { ok: false, message: "Something went wrong. Please email us directly." },
      { status: 500 }
    );
  }
}
