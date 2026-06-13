/**
 * One-time HubSpot setup: creates the custom contact properties and the four
 * subsidiary deal pipelines this platform writes to.
 *
 * Usage:
 *   HUBSPOT_ACCESS_TOKEN=pat-... npm run setup:hubspot
 *
 * Requires a private app token with scopes:
 *   crm.objects.contacts.write, crm.schemas.contacts.write,
 *   crm.objects.deals.write, crm.pipelines.orders.write (deals pipelines)
 *
 * Safe to re-run: existing properties/pipelines are skipped.
 */

import { PIPELINES } from "../lib/crm/pipelines";

const HUBSPOT_BASE = "https://api.hubapi.com";
const token = process.env.HUBSPOT_ACCESS_TOKEN;

if (!token) {
  console.error("Set HUBSPOT_ACCESS_TOKEN before running this script.");
  process.exit(1);
}

async function api<T>(
  path: string,
  method: "GET" | "POST" = "GET",
  body?: unknown
): Promise<{ status: number; data: T }> {
  const res = await fetch(`${HUBSPOT_BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = (await res.json().catch(() => ({}))) as T;
  return { status: res.status, data };
}

const CONTACT_PROPERTIES = [
  {
    name: "kalevant_subsidiary",
    label: "Kalevant Subsidiary",
    type: "enumeration",
    fieldType: "select",
    options: [
      { label: "MyFlowMind", value: "myflowmind" },
      { label: "Realty", value: "realty" },
      { label: "Notary", value: "notary" },
      { label: "Security", value: "security" },
      { label: "General", value: "general" },
    ],
  },
  { name: "lead_source_page", label: "Lead Source Page", type: "string", fieldType: "text" },
  { name: "lead_intent", label: "Lead Intent", type: "string", fieldType: "text" },
  { name: "lead_score", label: "Kalevant Lead Score", type: "number", fieldType: "number" },
  {
    name: "marketing_consent",
    label: "Marketing Consent",
    type: "enumeration",
    fieldType: "booleancheckbox",
    options: [
      { label: "True", value: "true" },
      { label: "False", value: "false" },
    ],
  },
  { name: "utm_source", label: "UTM Source", type: "string", fieldType: "text" },
  { name: "utm_medium", label: "UTM Medium", type: "string", fieldType: "text" },
  { name: "utm_campaign", label: "UTM Campaign", type: "string", fieldType: "text" },
  { name: "utm_term", label: "UTM Term", type: "string", fieldType: "text" },
  { name: "utm_content", label: "UTM Content", type: "string", fieldType: "text" },
  {
    name: "nurture_sequences_sent",
    label: "Nurture Sequences Sent",
    type: "string",
    fieldType: "text",
  },
];

async function createProperties(): Promise<void> {
  console.log("Creating contact properties…");
  for (const prop of CONTACT_PROPERTIES) {
    const { status } = await api("/crm/v3/properties/contacts", "POST", {
      ...prop,
      groupName: "contactinformation",
    });
    if (status === 201) console.log(`  ✓ ${prop.name}`);
    else if (status === 409) console.log(`  – ${prop.name} (already exists)`);
    else console.warn(`  ✗ ${prop.name} (HTTP ${status})`);
  }
}

async function createPipelines(): Promise<void> {
  console.log("Creating deal pipelines…");
  const existing = await api<{ results: Array<{ id: string }> }>(
    "/crm/v3/pipelines/deals"
  );
  const existingIds = new Set(existing.data.results?.map((p) => p.id) ?? []);

  for (const pipeline of PIPELINES) {
    if (existingIds.has(pipeline.key)) {
      console.log(`  – ${pipeline.label} (already exists)`);
      continue;
    }
    const { status } = await api("/crm/v3/pipelines/deals", "POST", {
      id: pipeline.key,
      label: pipeline.label,
      displayOrder: PIPELINES.indexOf(pipeline),
      stages: pipeline.stages.map((stage, i) => ({
        id: stage.id,
        label: stage.label,
        displayOrder: i,
        metadata: {
          // last two stages of each pipeline are terminal
          probability:
            i >= pipeline.stages.length - 2
              ? stage.label.toLowerCase().includes("lost")
                ? "0.0"
                : "1.0"
              : String((i + 1) / pipeline.stages.length),
        },
      })),
    });
    if (status === 201) console.log(`  ✓ ${pipeline.label}`);
    else console.warn(`  ✗ ${pipeline.label} (HTTP ${status})`);
  }
}

async function main(): Promise<void> {
  await createProperties();
  await createPipelines();
  console.log("Done. Verify in HubSpot → Settings → Properties / Pipelines.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
