import "server-only";

import { cookies } from "next/headers";
import { getCrm, scoreLead } from "@/lib/crm";
import type { LeadCapture, ScoredLead } from "@/lib/crm/types";
import { parseUtmCookie, RETURN_VISIT_COOKIE, UTM_COOKIE } from "@/lib/utm";
import { FOUNDER_EMAIL, sendEmail } from "@/lib/email";
import HotLeadAlert from "@/emails/hot-lead-alert";

export interface CaptureInput
  extends Omit<LeadCapture, "utm" | "signals" | "sourcePage"> {
  sourcePage: string;
  signals?: LeadCapture["signals"];
}

/**
 * Single entry point for every capture on the site: attaches first-party
 * attribution from cookies, scores, writes to the CRM, and fires the
 * hot-lead alert when the threshold is crossed.
 */
export async function captureLead(input: CaptureInput): Promise<ScoredLead> {
  const jar = cookies();
  const utm = parseUtmCookie(jar.get(UTM_COOKIE)?.value);
  const returnVisit = jar.get(RETURN_VISIT_COOKIE)?.value === "returning";

  const scored = scoreLead({
    ...input,
    utm,
    signals: { ...input.signals, returnVisit },
  });

  await getCrm().upsertContact(scored);

  if (scored.hot) {
    await sendEmail({
      to: FOUNDER_EMAIL,
      subject: `🔥 Hot lead: ${scored.email} (${scored.subsidiary}, score ${scored.score})`,
      react: HotLeadAlert({ lead: scored }),
    });
  }

  return scored;
}
