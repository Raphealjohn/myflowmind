import type { LeadCapture, ScoredLead } from "./types";

const FREE_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "aol.com",
  "icloud.com",
  "proton.me",
  "protonmail.com",
  "live.com",
  "msn.com",
]);

export const HOT_LEAD_THRESHOLD = 15;

/**
 * Scores a capture before it is written to the CRM:
 *   +10 booked a call, +5 gated resource download, +3 newsletter signup,
 *   +2 return visit, +5 company (non-free) email domain.
 * Score >= 15 marks the lead hot, which tags it in the CRM and triggers an
 * immediate founder notification.
 */
export function scoreLead(lead: LeadCapture): ScoredLead {
  let score = 0;
  if (lead.signals.bookedCall) score += 10;
  if (lead.signals.downloadedResource) score += 5;
  if (lead.signals.newsletterSignup) score += 3;
  if (lead.signals.returnVisit) score += 2;

  const domain = lead.email.split("@")[1]?.toLowerCase() ?? "";
  if (domain && !FREE_EMAIL_DOMAINS.has(domain)) score += 5;

  return { ...lead, score, hot: score >= HOT_LEAD_THRESHOLD };
}
