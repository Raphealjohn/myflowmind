import type { PipelineDefinition, PipelineKey } from "./types";

/**
 * Canonical pipeline definitions. The HubSpot setup script creates these and
 * the webhook/booking handlers reference stages by id, so stage ids here are
 * the single source of truth.
 */
export const PIPELINES: PipelineDefinition[] = [
  {
    key: "myflowmind",
    label: "MyFlowMind",
    stages: [
      { id: "mfm_inquiry", label: "Inquiry" },
      { id: "mfm_discovery", label: "Discovery Call" },
      { id: "mfm_audit", label: "Automation Audit" },
      { id: "mfm_proposal", label: "Proposal" },
      { id: "mfm_won", label: "Won" },
      { id: "mfm_lost", label: "Lost" },
    ],
  },
  {
    key: "realty",
    label: "Kayjay Realty",
    stages: [
      { id: "re_inquiry", label: "Inquiry" },
      { id: "re_qualification", label: "Qualification" },
      { id: "re_showing", label: "Showing / Walkthrough" },
      { id: "re_offer", label: "Offer" },
      { id: "re_closed", label: "Closed" },
    ],
  },
  {
    key: "notary",
    label: "Kayjay Notary",
    stages: [
      { id: "no_request", label: "Request" },
      { id: "no_scheduled", label: "Scheduled" },
      { id: "no_completed", label: "Completed" },
      { id: "no_review", label: "Review Requested" },
    ],
  },
  {
    key: "security",
    label: "Kayjay Security",
    stages: [
      { id: "sec_inquiry", label: "Inquiry" },
      { id: "sec_scoping", label: "Scoping Call" },
      { id: "sec_assessment", label: "Assessment" },
      { id: "sec_sow", label: "SOW" },
      { id: "sec_engaged", label: "Engaged" },
    ],
  },
];

export function getPipeline(key: PipelineKey): PipelineDefinition {
  const pipeline = PIPELINES.find((p) => p.key === key);
  if (!pipeline) throw new Error(`Unknown pipeline: ${key}`);
  return pipeline;
}

/** Stage a fresh booking lands in, per pipeline. */
export const BOOKING_STAGE: Record<PipelineKey, string> = {
  myflowmind: "mfm_discovery",
  realty: "re_qualification",
  notary: "no_scheduled",
  security: "sec_scoping",
};

/** Stage a fresh inquiry lands in, per pipeline. */
export const INQUIRY_STAGE: Record<PipelineKey, string> = {
  myflowmind: "mfm_inquiry",
  realty: "re_inquiry",
  notary: "no_request",
  security: "sec_inquiry",
};
