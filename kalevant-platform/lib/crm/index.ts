import "server-only";

import { HubspotCrm } from "./hubspot";
import type {
  CrmContactSummary,
  CrmProvider,
  DealInput,
  PipelineSummary,
  ScoredLead,
} from "./types";

export { scoreLead, HOT_LEAD_THRESHOLD } from "./scoring";
export { PIPELINES, getPipeline, BOOKING_STAGE, INQUIRY_STAGE } from "./pipelines";
export type * from "./types";

/**
 * No-op provider used when HUBSPOT_ACCESS_TOKEN is absent (local dev,
 * preview deploys). Captures are logged so forms stay testable end-to-end.
 */
class ConsoleCrm implements CrmProvider {
  async upsertContact(lead: ScoredLead): Promise<{ contactId: string }> {
    console.info("[crm:console] upsertContact", lead.email, lead.subsidiary, lead.score);
    return { contactId: "console-contact" };
  }
  async createDeal(deal: DealInput): Promise<{ dealId: string }> {
    console.info("[crm:console] createDeal", deal.pipeline, deal.stageId, deal.contactEmail);
    return { dealId: "console-deal" };
  }
  async getPipelineSummaries(): Promise<PipelineSummary[]> {
    return [];
  }
  async getRecentContacts(): Promise<CrmContactSummary[]> {
    return [];
  }
  async getHotLeads(): Promise<CrmContactSummary[]> {
    return [];
  }
  async getNurtureCandidates(): Promise<never[]> {
    return [];
  }
  async markNurtureSent(email: string, sequence: string): Promise<void> {
    console.info("[crm:console] markNurtureSent", email, sequence);
  }
  async updateConsent(email: string, consent: boolean): Promise<void> {
    console.info("[crm:console] updateConsent", email, consent);
  }
}

let provider: CrmProvider | null = null;

/** Resolve the active CRM provider. Swap implementations here only. */
export function getCrm(): CrmProvider {
  if (!provider) {
    provider = process.env.HUBSPOT_ACCESS_TOKEN ? new HubspotCrm() : new ConsoleCrm();
  }
  return provider;
}
