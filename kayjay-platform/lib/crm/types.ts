import type { SubsidiarySlug } from "@/lib/content";

export type Subsidiary = SubsidiarySlug | "general";

export type LeadIntent =
  | "automation"
  | "real_estate"
  | "notarization"
  | "security"
  | "partnership"
  | "newsletter"
  | "resource_download"
  | "other";

export interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

/** A capture event from any form on the site, before scoring. */
export interface LeadCapture {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  company?: string;
  message?: string;
  subsidiary: Subsidiary;
  intent: LeadIntent;
  sourcePage: string;
  utm: UtmParams;
  consent: boolean;
  /** Scoring signals observed at capture time. */
  signals: ScoringSignals;
}

export interface ScoringSignals {
  bookedCall?: boolean;
  downloadedResource?: boolean;
  newsletterSignup?: boolean;
  returnVisit?: boolean;
}

export interface ScoredLead extends LeadCapture {
  score: number;
  hot: boolean;
}

export type PipelineKey = SubsidiarySlug;

export interface PipelineStage {
  id: string;
  label: string;
}

export interface PipelineDefinition {
  key: PipelineKey;
  label: string;
  stages: PipelineStage[];
}

export interface DealInput {
  contactEmail: string;
  pipeline: PipelineKey;
  stageId: string;
  name: string;
  amount?: number;
}

export interface PipelineSummary {
  pipeline: PipelineKey;
  dealCount: number;
  totalValue: number;
}

export interface CrmContactSummary {
  email: string;
  firstName?: string;
  score: number;
  subsidiary: Subsidiary;
  createdAt: string;
}

export type NurtureSequence =
  | "inquiry_followup_3d"
  | "notary_review_24h"
  | "resource_followup_7d";

export interface NurtureCandidate {
  email: string;
  firstName?: string;
}

/** Criteria the provider translates into a contact query. */
export interface NurtureQuery {
  sequence: NurtureSequence;
  subsidiary: Subsidiary;
  intent?: LeadIntent;
  /** Contact must have been created at least this many hours ago… */
  minAgeHours: number;
  /** …and no more than this many hours ago (caps backfill). */
  maxAgeHours: number;
}

/**
 * Provider-agnostic CRM contract. UI and route handlers depend on this
 * interface only — swapping HubSpot for Twenty/Attio means writing one new
 * implementation, not touching forms or pages.
 */
export interface CrmProvider {
  upsertContact(lead: ScoredLead): Promise<{ contactId: string }>;
  createDeal(deal: DealInput): Promise<{ dealId: string }>;
  getPipelineSummaries(): Promise<PipelineSummary[]>;
  getRecentContacts(opts: { since: Date }): Promise<CrmContactSummary[]>;
  getHotLeads(): Promise<CrmContactSummary[]>;
  /** Consented contacts matching the query that haven't received the sequence yet. */
  getNurtureCandidates(query: NurtureQuery): Promise<NurtureCandidate[]>;
  markNurtureSent(email: string, sequence: NurtureSequence): Promise<void>;
  updateConsent(email: string, consent: boolean): Promise<void>;
}
