import { z } from "zod";

export const INTENTS = [
  "automation",
  "real_estate",
  "notarization",
  "security",
  "partnership",
  "other",
] as const;

export type ContactIntent = (typeof INTENTS)[number];

/** Maps a contact-router intent to the subsidiary / pipeline it routes to. */
export const INTENT_ROUTING: Record<
  ContactIntent,
  { subsidiary: "myflowmind" | "realty" | "notary" | "security" | "general"; label: string }
> = {
  automation: { subsidiary: "myflowmind", label: "Workflow automation" },
  real_estate: { subsidiary: "realty", label: "Real estate" },
  notarization: { subsidiary: "notary", label: "Notarization" },
  security: { subsidiary: "security", label: "Security consulting" },
  partnership: { subsidiary: "general", label: "Partnership / investment" },
  other: { subsidiary: "general", label: "Something else" },
};

export const contactSchema = z.object({
  intent: z.enum(INTENTS),
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().max(100).optional().or(z.literal("")),
  email: z.string().email("Enter a valid email"),
  phone: z.string().max(40).optional().or(z.literal("")),
  company: z.string().max(200).optional().or(z.literal("")),
  message: z.string().min(10, "Tell us a little more (10+ characters)").max(4000),
  sourcePage: z.string().max(500).default("/contact"),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Consent is required so we can reply to you" }),
  }),
});

export type ContactFormValues = z.infer<typeof contactSchema>;

export const newsletterSchema = z.object({
  email: z.string().email("Enter a valid email"),
  sourcePage: z.string().max(500).default("/insights"),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Consent is required to subscribe" }),
  }),
});

export const resourceSchema = z.object({
  email: z.string().email("Enter a valid email"),
  firstName: z.string().max(100).optional().or(z.literal("")),
  resourceSlug: z.string().min(1).max(200),
  sourcePage: z.string().max(500).default("/"),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Consent is required to receive the download" }),
  }),
});
