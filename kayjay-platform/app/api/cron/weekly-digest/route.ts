import { NextResponse } from "next/server";
import { getCrm } from "@/lib/crm";
import { FOUNDER_EMAIL, sendEmail } from "@/lib/email";
import WeeklyDigest from "@/emails/weekly-digest";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Monday-morning operations digest. Replaces the manual ritual of checking
 * four pipelines by hand — one email with leads, pipeline value, and the
 * hot-lead queue across every Kayjay company.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const crm = getCrm();
  const now = Date.now();
  const weekMs = 7 * 24 * 60 * 60 * 1000;

  try {
    const [thisWeek, twoWeeks, pipelines, hotLeads] = await Promise.all([
      crm.getRecentContacts({ since: new Date(now - weekMs) }),
      crm.getRecentContacts({ since: new Date(now - 2 * weekMs) }),
      crm.getPipelineSummaries(),
      crm.getHotLeads(),
    ]);

    await sendEmail({
      to: FOUNDER_EMAIL,
      subject: `📊 Kayjay weekly: ${thisWeek.length} leads, ${pipelines.reduce((s, p) => s + p.dealCount, 0)} open deals`,
      react: WeeklyDigest({
        leadsThisWeek: thisWeek.length,
        leadsLastWeek: twoWeeks.length - thisWeek.length,
        pipelines,
        hotLeads,
      }),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[cron/weekly-digest]", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
