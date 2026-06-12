import type { Subsidiary } from "@/lib/crm/types";

export interface GatedResource {
  slug: string;
  title: string;
  description: string;
  subsidiary: Subsidiary;
  /** Where the asset lives (Sanity file URL or /public path). */
  downloadPath: string;
}

export const RESOURCES: GatedResource[] = [
  {
    slug: "smb-security-onboarding-checklist",
    title: "SMB Security Onboarding Checklist",
    description:
      "The 30-day identity baseline we run for every client: SSO, MFA, shared-credential retirement, and the evidence your cyber-insurance renewal asks for.",
    subsidiary: "security",
    downloadPath: "/resources/smb-security-onboarding-checklist.pdf",
  },
  {
    slug: "automation-audit-worksheet",
    title: "Automation Audit Worksheet",
    description:
      "Map every repetitive workflow in your business and score it by hours saved vs. effort — the same worksheet we use in paid audits.",
    subsidiary: "myflowmind",
    downloadPath: "/resources/automation-audit-worksheet.pdf",
  },
  {
    slug: "notary-document-prep-guide",
    title: "Notarization Prep Guide",
    description:
      "What to have ready before a mobile or remote notarization so your appointment takes minutes, not an hour.",
    subsidiary: "notary",
    downloadPath: "/resources/notary-document-prep-guide.pdf",
  },
];

export function getResource(slug: string): GatedResource | undefined {
  return RESOURCES.find((r) => r.slug === slug);
}
