import { sanityFetch, sanityConfigured } from "@/lib/sanity";

export type SubsidiarySlug = "myflowmind" | "realty" | "notary" | "security";

export interface Service {
  title: string;
  description: string;
  detail: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface TickerMetric {
  label: string;
  value: string;
}

export interface Company {
  slug: SubsidiarySlug;
  name: string;
  tagline: string;
  summary: string;
  /** Long-form positioning paragraph for the microsite hero. */
  positioning: string;
  /** Hex accent, mirrored by [data-subsidiary] CSS custom properties. */
  accentHex: string;
  ctaLabel: string;
  /** CRM pipeline this company's leads flow into. */
  pipeline: string;
  services: Service[];
  testimonials: Testimonial[];
  faq: FaqItem[];
  externalUrl?: string;
}

export const COMPANIES: Company[] = [
  {
    slug: "myflowmind",
    name: "MyFlowMind",
    tagline: "AI-powered workflow automation for small businesses",
    summary:
      "Automation audits, custom workflows, and AI integrations that give small teams back their week.",
    positioning:
      "Most small businesses lose 15+ hours a week to repetitive work. MyFlowMind maps those workflows, automates them with tools you already own, and trains your team to run the system — no engineering hires required.",
    accentHex: "#00F5A0",
    ctaLabel: "Book an automation audit",
    pipeline: "myflowmind",
    externalUrl: "https://myflowmind.com",
    services: [
      {
        title: "Automation Audit",
        description: "A full map of where your hours go and what to automate first.",
        detail:
          "We document every repetitive workflow in your business, score each by hours saved and implementation effort, and hand you a prioritized 90-day automation roadmap.",
      },
      {
        title: "Workflow Builds",
        description: "Done-for-you automations in Zapier, Make, or n8n.",
        detail:
          "From lead routing to invoice chasing, we build, test, and document automations on the platform that fits your stack and budget — then transfer ownership to you.",
      },
      {
        title: "AI Integration",
        description: "Practical AI inside your existing tools, not a new app to learn.",
        detail:
          "Email triage, proposal drafting, meeting summaries — we wire AI into the tools your team already uses and set guardrails so output stays on-brand.",
      },
    ],
    testimonials: [
      {
        quote:
          "The audit alone paid for itself. We cut nine hours of weekly admin in the first month.",
        author: "Operations lead",
        role: "12-person services firm",
      },
    ],
    faq: [
      {
        question: "What does an automation audit cost?",
        answer:
          "Audits start at a flat fee with the full amount credited toward any build engagement that follows. You leave with the roadmap either way.",
      },
      {
        question: "Which tools do you build on?",
        answer:
          "Zapier, Make, and n8n primarily, plus direct API integrations where those platforms fall short. We recommend based on your stack, not a reseller agreement.",
      },
      {
        question: "Do you offer ongoing support?",
        answer:
          "Yes — the Monthly Automation Club covers monitoring, fixes, and one new automation each month.",
      },
    ],
  },
  {
    slug: "realty",
    name: "Kayjay Realty",
    tagline: "Real estate development and property services",
    summary:
      "Acquisition, development, and property services across the Des Moines metro.",
    positioning:
      "Kayjay Realty acquires, improves, and manages residential property in central Iowa — and offers the same diligence-grade walkthroughs and market analysis to clients buying or selling on their own.",
    accentHex: "#2D6A4F",
    ctaLabel: "Request a consultation",
    pipeline: "realty",
    services: [
      {
        title: "Property Acquisition",
        description: "Sourcing and underwriting residential investment property.",
        detail:
          "Off-market sourcing, comparable analysis, and renovation budgeting for the Des Moines metro, delivered as an underwriting packet you can take to a lender.",
      },
      {
        title: "Development & Renovation",
        description: "Managed renovation projects from scope to certificate of occupancy.",
        detail:
          "We scope, bid, and supervise renovation work with licensed local contractors, with weekly photo reporting and a single point of accountability.",
      },
      {
        title: "Property Services",
        description: "Walkthroughs, market analysis, and listing preparation.",
        detail:
          "Pre-offer walkthroughs, rental market analysis, and listing prep for owners who want professional eyes without a full-service commission.",
      },
    ],
    testimonials: [
      {
        quote: "Their walkthrough caught a foundation issue two inspections missed.",
        author: "First-time investor",
        role: "Des Moines, IA",
      },
    ],
    faq: [
      {
        question: "What areas do you cover?",
        answer:
          "The Des Moines metro: West Des Moines, Urbandale, Clive, Waukee, Ankeny, and surrounding communities.",
      },
      {
        question: "Do you work with out-of-state investors?",
        answer:
          "Yes. Remote investors are a core client base — every engagement includes photo and video documentation by default.",
      },
    ],
  },
  {
    slug: "notary",
    name: "Kayjay Notary Services",
    tagline: "Mobile and remote online notarization",
    summary:
      "Same-week mobile notary visits and remote online notarization, evenings and weekends included.",
    positioning:
      "Loan signings, estate documents, power of attorney — notarized where you are. Kayjay Notary serves the Des Moines metro in person and all of Iowa via remote online notarization.",
    accentHex: "#1B3A6B",
    ctaLabel: "Book a notarization",
    pipeline: "notary",
    services: [
      {
        title: "Mobile Notary",
        description: "We come to your home, office, hospital, or closing table.",
        detail:
          "Standard documents, real estate packages, and healthcare directives, with evening and weekend availability across the Des Moines metro.",
      },
      {
        title: "Remote Online Notarization",
        description: "Fully legal online notarization for Iowa documents.",
        detail:
          "Identity-verified video notarization from anywhere, with tamper-evident digital certificates delivered the same session.",
      },
      {
        title: "Loan Signing Agent",
        description: "NNA-certified loan signing for lenders and title companies.",
        detail:
          "Error-free, on-time loan package execution with same-day scan-backs and direct status updates to your closer.",
      },
    ],
    testimonials: [
      {
        quote: "Booked at 9am, documents notarized at my kitchen table by 4pm.",
        author: "Estate planning client",
        role: "West Des Moines, IA",
      },
    ],
    faq: [
      {
        question: "How fast can you schedule?",
        answer:
          "Most mobile appointments are available within 48 hours; remote online notarization is often same-day.",
      },
      {
        question: "Is remote online notarization legally valid?",
        answer:
          "Yes. Iowa authorizes remote online notarization, and RON-notarized documents are recognized in all 50 states under interstate recognition rules.",
      },
      {
        question: "What do I need for an appointment?",
        answer:
          "A valid government-issued photo ID, the unsigned documents, and any required witnesses. We confirm specifics when you book.",
      },
    ],
  },
  {
    slug: "security",
    name: "Kayjay Security Consulting",
    tagline: "IAM, identity governance, and SMB security onboarding",
    summary:
      "Identity and access management for small businesses that have outgrown shared passwords.",
    positioning:
      "Most breaches start with identity. Kayjay Security designs and implements IAM and identity governance for small and mid-size businesses — least-privilege access, clean joiner/mover/leaver processes, and an audit trail you can actually show an insurer.",
    accentHex: "#5E6E82",
    ctaLabel: "Schedule a scoping call",
    pipeline: "security",
    services: [
      {
        title: "Security Onboarding",
        description: "A 30-day baseline: SSO, MFA, and password hygiene for your whole team.",
        detail:
          "We stand up single sign-on, enforce MFA, retire shared credentials, and document the result — the baseline cyber-insurance underwriters ask about.",
      },
      {
        title: "IAM Architecture",
        description: "Identity and access design for Okta, Entra ID, and Google Workspace.",
        detail:
          "Role-based access models, lifecycle automation for joiners/movers/leavers, and integration patterns that keep access reviews under an hour a quarter.",
      },
      {
        title: "Identity Governance",
        description: "Access reviews, certification, and least-privilege cleanup.",
        detail:
          "Quarterly access certification, privileged account inventory, and remediation of over-provisioned access with evidence packs for auditors.",
      },
    ],
    testimonials: [
      {
        quote:
          "Our cyber-insurance renewal questionnaire went from a week of panic to an afternoon.",
        author: "Managing partner",
        role: "Regional accounting firm",
      },
    ],
    faq: [
      {
        question: "We're a 15-person company. Is this overkill?",
        answer:
          "No — the onboarding package is scoped specifically for teams of 5 to 50. Smaller companies are now the primary target for identity-based attacks.",
      },
      {
        question: "Which platforms do you work with?",
        answer:
          "Okta, Microsoft Entra ID, and Google Workspace, plus the SaaS apps connected to them.",
      },
    ],
  },
];

export const DEFAULT_TICKER: TickerMetric[] = [
  { label: "automation workflows deployed this month", value: "12" },
  { label: "documents notarized this quarter", value: "47" },
  { label: "identities brought under governance", value: "230" },
  { label: "properties under management", value: "6" },
];

export function getCompany(slug: string): Company | undefined {
  return COMPANIES.find((c) => c.slug === slug);
}

/**
 * Ticker metrics come from Sanity when configured (so they can be refreshed
 * monthly without a deploy) and fall back to the seed values otherwise.
 */
export async function getTickerMetrics(): Promise<TickerMetric[]> {
  if (!sanityConfigured()) return DEFAULT_TICKER;
  try {
    const metrics = await sanityFetch<TickerMetric[]>(
      `*[_type == "tickerMetric"] | order(orderRank asc) { label, value }`
    );
    return metrics && metrics.length > 0 ? metrics : DEFAULT_TICKER;
  } catch {
    return DEFAULT_TICKER;
  }
}
