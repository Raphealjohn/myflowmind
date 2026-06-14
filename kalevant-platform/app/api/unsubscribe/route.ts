import { NextResponse } from "next/server";
import { z } from "zod";
import { getCrm } from "@/lib/crm";

const emailSchema = z.string().email();

/** One-click unsubscribe target linked from every nurture email. */
export async function GET(request: Request) {
  const email = new URL(request.url).searchParams.get("email");
  const parsed = emailSchema.safeParse(email);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: "Invalid email" }, { status: 400 });
  }

  try {
    await getCrm().updateConsent(parsed.data, false);
  } catch (error) {
    console.error("[api/unsubscribe]", error);
  }

  return new NextResponse(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Unsubscribed</title></head>
<body style="font-family:Georgia,serif;background:#FAF8F4;color:#0E0E12;display:grid;place-items:center;min-height:100vh;margin:0">
<main style="text-align:center;padding:2rem"><h1>You're unsubscribed.</h1>
<p>No more nurture emails will be sent to ${parsed.data.replace(/</g, "&lt;")}.</p></main>
</body></html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}
