import { EmailShell, P } from "./components";
import type { CrmContactSummary, PipelineSummary } from "@/lib/crm/types";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

/** Monday-morning operations digest for the founder. */
export default function WeeklyDigest({
  leadsThisWeek,
  leadsLastWeek,
  pipelines,
  hotLeads,
}: {
  leadsThisWeek: number;
  leadsLastWeek: number;
  pipelines: PipelineSummary[];
  hotLeads: CrmContactSummary[];
}) {
  const totalValue = pipelines.reduce((sum, p) => sum + p.totalValue, 0);
  const totalDeals = pipelines.reduce((sum, p) => sum + p.dealCount, 0);
  const trend = leadsThisWeek >= leadsLastWeek ? "up" : "down";

  return (
    <EmailShell preview={`Week in review: ${leadsThisWeek} leads, ${usd.format(totalValue)} in pipeline`}>
      <P>
        <strong>Kayjay week in review</strong>
      </P>
      <P>
        Leads: <strong>{leadsThisWeek}</strong> this week vs. {leadsLastWeek} last week
        ({trend}). Pipeline: <strong>{totalDeals} open deals</strong> worth{" "}
        <strong>{usd.format(totalValue)}</strong> across all companies.
      </P>
      {pipelines.length > 0 ? (
        <P>
          By company:{" "}
          {pipelines
            .map((p) => `${p.pipeline} ${p.dealCount} deals / ${usd.format(p.totalValue)}`)
            .join(" · ")}
        </P>
      ) : null}
      {hotLeads.length > 0 ? (
        <P>
          🔥 Hot leads needing attention:{" "}
          {hotLeads
            .slice(0, 5)
            .map((l) => `${l.email} (${l.subsidiary}, score ${l.score})`)
            .join(" · ")}
        </P>
      ) : (
        <P>No hot leads outstanding — inbox zero on follow-ups.</P>
      )}
      <P>Full detail on the dashboard: /admin</P>
    </EmailShell>
  );
}
