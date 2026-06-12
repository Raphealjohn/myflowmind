import { NextResponse } from "next/server";
import { getCrm } from "@/lib/crm";
import type { NurtureQuery, NurtureSequence } from "@/lib/crm/types";
import { sendEmail } from "@/lib/email";
import { siteUrl } from "@/lib/site";
import InquiryFollowup from "@/emails/inquiry-followup";
import ReviewRequest from "@/emails/review-request";
import ResourceFollowup from "@/emails/resource-followup";
import type { ReactElement } from "react";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

interface SequenceConfig {
  query: NurtureQuery;
  subject: string;
  render: (candidate: { email: string; firstName?: string }) => ReactElement;
}

function unsubscribeUrl(email: string): string {
  return `${siteUrl()}/api/unsubscribe?email=${encodeURIComponent(email)}`;
}

const SEQUENCES: SequenceConfig[] = [
  {
    // MyFlowMind inquiry, no call in 3 days → case-study email
    query: {
      sequence: "inquiry_followup_3d",
      subsidiary: "myflowmind",
      intent: "automation",
      minAgeHours: 72,
      maxAgeHours: 24 * 30,
    },
    subject: "How a 12-person firm cut nine hours of weekly admin",
    render: (c) =>
      InquiryFollowup({ firstName: c.firstName, unsubscribeUrl: unsubscribeUrl(c.email) }),
  },
  {
    // Notary completed → review request after 24h
    query: {
      sequence: "notary_review_24h",
      subsidiary: "notary",
      minAgeHours: 24,
      maxAgeHours: 24 * 14,
    },
    subject: "Thanks for choosing Kayjay Notary — one quick favor",
    render: (c) =>
      ReviewRequest({
        firstName: c.firstName,
        reviewUrl: process.env.GOOGLE_REVIEW_URL ?? `${siteUrl()}/companies/notary`,
        unsubscribeUrl: unsubscribeUrl(c.email),
      }),
  },
  {
    // Resource download, no reply in 7 days → implementation offer
    query: {
      sequence: "resource_followup_7d",
      subsidiary: "security",
      intent: "resource_download",
      minAgeHours: 24 * 7,
      maxAgeHours: 24 * 60,
    },
    subject: "Want help implementing that checklist?",
    render: (c) =>
      ResourceFollowup({
        firstName: c.firstName,
        resourceTitle: "the checklist you downloaded",
        unsubscribeUrl: unsubscribeUrl(c.email),
      }),
  },
];

export async function GET(request: Request) {
  // Vercel Cron sends this header; reject anything else in production.
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const crm = getCrm();
  const report: Record<NurtureSequence, number> = {
    inquiry_followup_3d: 0,
    notary_review_24h: 0,
    resource_followup_7d: 0,
  };

  for (const sequence of SEQUENCES) {
    try {
      const candidates = await crm.getNurtureCandidates(sequence.query);
      for (const candidate of candidates) {
        await sendEmail({
          to: candidate.email,
          subject: sequence.subject,
          react: sequence.render(candidate),
        });
        await crm.markNurtureSent(candidate.email, sequence.query.sequence);
        report[sequence.query.sequence] += 1;
      }
    } catch (error) {
      console.error(`[cron/nurture] ${sequence.query.sequence}`, error);
    }
  }

  return NextResponse.json({ ok: true, sent: report });
}
