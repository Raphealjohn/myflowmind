import "server-only";

import type {
  CrmContactSummary,
  CrmProvider,
  DealInput,
  NurtureCandidate,
  NurtureQuery,
  NurtureSequence,
  PipelineSummary,
  ScoredLead,
} from "./types";
import { PIPELINES } from "./pipelines";

const HUBSPOT_BASE = "https://api.hubapi.com";

/**
 * Custom contact properties written by the platform. Created by
 * `npm run setup:hubspot` — see scripts/setup-hubspot.ts.
 */
export const CUSTOM_CONTACT_PROPERTIES = [
  "kalevant_subsidiary",
  "lead_source_page",
  "lead_intent",
  "lead_score",
  "marketing_consent",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "nurture_sequences_sent",
] as const;

async function hubspotRequest<T>(
  path: string,
  init: RequestInit & { method: "GET" | "POST" | "PATCH" } = { method: "GET" }
): Promise<T> {
  const token = process.env.HUBSPOT_ACCESS_TOKEN;
  if (!token) throw new Error("HUBSPOT_ACCESS_TOKEN is not configured");

  const res = await fetch(`${HUBSPOT_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`HubSpot ${init.method} ${path} failed (${res.status}): ${body}`);
  }
  return res.json() as Promise<T>;
}

function leadToProperties(lead: ScoredLead): Record<string, string> {
  const props: Record<string, string> = {
    email: lead.email,
    kalevant_subsidiary: lead.subsidiary,
    lead_source_page: lead.sourcePage,
    lead_intent: lead.intent,
    lead_score: String(lead.score),
    marketing_consent: String(lead.consent),
  };
  if (lead.firstName) props.firstname = lead.firstName;
  if (lead.lastName) props.lastname = lead.lastName;
  if (lead.phone) props.phone = lead.phone;
  if (lead.company) props.company = lead.company;
  if (lead.hot) props.hs_lead_status = "NEW";
  for (const [key, value] of Object.entries(lead.utm)) {
    if (value) props[key] = value;
  }
  return props;
}

interface HubspotSearchResponse<P> {
  total: number;
  results: Array<{ id: string; properties: P; createdAt?: string }>;
}

async function findContactByEmail(email: string): Promise<string | null> {
  const data = await hubspotRequest<HubspotSearchResponse<{ email: string }>>(
    "/crm/v3/objects/contacts/search",
    {
      method: "POST",
      body: JSON.stringify({
        filterGroups: [
          {
            filters: [{ propertyName: "email", operator: "EQ", value: email }],
          },
        ],
        properties: ["email"],
        limit: 1,
      }),
    }
  );
  return data.results[0]?.id ?? null;
}

export class HubspotCrm implements CrmProvider {
  async upsertContact(lead: ScoredLead): Promise<{ contactId: string }> {
    const properties = leadToProperties(lead);
    const existingId = await findContactByEmail(lead.email);

    if (existingId) {
      await hubspotRequest(`/crm/v3/objects/contacts/${existingId}`, {
        method: "PATCH",
        body: JSON.stringify({ properties }),
      });
      return { contactId: existingId };
    }

    const created = await hubspotRequest<{ id: string }>("/crm/v3/objects/contacts", {
      method: "POST",
      body: JSON.stringify({ properties }),
    });
    return { contactId: created.id };
  }

  async createDeal(deal: DealInput): Promise<{ dealId: string }> {
    const contactId = await findContactByEmail(deal.contactEmail);
    const created = await hubspotRequest<{ id: string }>("/crm/v3/objects/deals", {
      method: "POST",
      body: JSON.stringify({
        properties: {
          dealname: deal.name,
          pipeline: deal.pipeline,
          dealstage: deal.stageId,
          ...(deal.amount !== undefined ? { amount: String(deal.amount) } : {}),
        },
        ...(contactId
          ? {
              associations: [
                {
                  to: { id: contactId },
                  types: [
                    {
                      associationCategory: "HUBSPOT_DEFINED",
                      associationTypeId: 3, // deal -> contact
                    },
                  ],
                },
              ],
            }
          : {}),
      }),
    });
    return { dealId: created.id };
  }

  async getPipelineSummaries(): Promise<PipelineSummary[]> {
    const summaries: PipelineSummary[] = [];
    for (const pipeline of PIPELINES) {
      const data = await hubspotRequest<HubspotSearchResponse<{ amount?: string }>>(
        "/crm/v3/objects/deals/search",
        {
          method: "POST",
          body: JSON.stringify({
            filterGroups: [
              {
                filters: [
                  { propertyName: "pipeline", operator: "EQ", value: pipeline.key },
                ],
              },
            ],
            properties: ["amount"],
            limit: 100,
          }),
        }
      );
      summaries.push({
        pipeline: pipeline.key,
        dealCount: data.total,
        totalValue: data.results.reduce(
          (sum, deal) => sum + (Number(deal.properties.amount) || 0),
          0
        ),
      });
    }
    return summaries;
  }

  async getRecentContacts(opts: { since: Date }): Promise<CrmContactSummary[]> {
    const data = await hubspotRequest<
      HubspotSearchResponse<{
        email: string;
        firstname?: string;
        lead_score?: string;
        kalevant_subsidiary?: string;
        createdate?: string;
      }>
    >("/crm/v3/objects/contacts/search", {
      method: "POST",
      body: JSON.stringify({
        filterGroups: [
          {
            filters: [
              {
                propertyName: "createdate",
                operator: "GTE",
                value: String(opts.since.getTime()),
              },
            ],
          },
        ],
        properties: ["email", "firstname", "lead_score", "kalevant_subsidiary", "createdate"],
        sorts: [{ propertyName: "createdate", direction: "DESCENDING" }],
        limit: 100,
      }),
    });
    return data.results.map((r) => ({
      email: r.properties.email,
      firstName: r.properties.firstname,
      score: Number(r.properties.lead_score) || 0,
      subsidiary: (r.properties.kalevant_subsidiary as CrmContactSummary["subsidiary"]) ?? "general",
      createdAt: r.properties.createdate ?? r.createdAt ?? "",
    }));
  }

  async getHotLeads(): Promise<CrmContactSummary[]> {
    const recent = await this.getRecentContacts({
      since: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    });
    return recent.filter((c) => c.score >= 15);
  }

  async getNurtureCandidates(query: NurtureQuery): Promise<NurtureCandidate[]> {
    const now = Date.now();
    const baseFilters = [
      { propertyName: "kalevant_subsidiary", operator: "EQ", value: query.subsidiary },
      ...(query.intent
        ? [{ propertyName: "lead_intent", operator: "EQ", value: query.intent }]
        : []),
      { propertyName: "marketing_consent", operator: "EQ", value: "true" },
      {
        propertyName: "createdate",
        operator: "LTE",
        value: String(now - query.minAgeHours * 3600_000),
      },
      {
        propertyName: "createdate",
        operator: "GTE",
        value: String(now - query.maxAgeHours * 3600_000),
      },
    ];

    // Two OR-ed groups: sequence property never set, or set without this token.
    const data = await hubspotRequest<
      HubspotSearchResponse<{ email: string; firstname?: string }>
    >("/crm/v3/objects/contacts/search", {
      method: "POST",
      body: JSON.stringify({
        filterGroups: [
          {
            filters: [
              ...baseFilters,
              { propertyName: "nurture_sequences_sent", operator: "NOT_HAS_PROPERTY" },
            ],
          },
          {
            filters: [
              ...baseFilters,
              {
                propertyName: "nurture_sequences_sent",
                operator: "NOT_CONTAINS_TOKEN",
                value: query.sequence,
              },
            ],
          },
        ],
        properties: ["email", "firstname"],
        limit: 100,
      }),
    });

    return data.results.map((r) => ({
      email: r.properties.email,
      firstName: r.properties.firstname,
    }));
  }

  async markNurtureSent(email: string, sequence: NurtureSequence): Promise<void> {
    const contactId = await findContactByEmail(email);
    if (!contactId) return;
    const contact = await hubspotRequest<{
      properties: { nurture_sequences_sent?: string };
    }>(`/crm/v3/objects/contacts/${contactId}?properties=nurture_sequences_sent`);
    const existing = contact.properties.nurture_sequences_sent ?? "";
    const tokens = new Set(existing.split(" ").filter(Boolean));
    tokens.add(sequence);
    await hubspotRequest(`/crm/v3/objects/contacts/${contactId}`, {
      method: "PATCH",
      body: JSON.stringify({
        properties: { nurture_sequences_sent: Array.from(tokens).join(" ") },
      }),
    });
  }

  async updateConsent(email: string, consent: boolean): Promise<void> {
    const contactId = await findContactByEmail(email);
    if (!contactId) return;
    await hubspotRequest(`/crm/v3/objects/contacts/${contactId}`, {
      method: "PATCH",
      body: JSON.stringify({ properties: { marketing_consent: String(consent) } }),
    });
  }
}
