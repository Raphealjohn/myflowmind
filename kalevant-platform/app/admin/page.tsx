import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getCrm, getPipeline } from "@/lib/crm";
import { computePace, getRevenueEntries } from "@/lib/revenue";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Founder dashboard",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const crm = getCrm();
  const now = new Date();
  const weekMs = 7 * 24 * 60 * 60 * 1000;

  const [pipelines, hotLeads, thisWeek, twoWeeks, revenue] = await Promise.all([
    crm.getPipelineSummaries().catch(() => []),
    crm.getHotLeads().catch(() => []),
    crm.getRecentContacts({ since: new Date(now.getTime() - weekMs) }).catch(() => []),
    crm.getRecentContacts({ since: new Date(now.getTime() - 2 * weekMs) }).catch(() => []),
    getRevenueEntries(now.getFullYear()),
  ]);

  const lastWeekCount = twoWeeks.length - thisWeek.length;
  const pace = computePace(revenue, now);
  const progress = Math.min(100, (pace.yearToDate / pace.goal) * 100);

  return (
    <Container className="py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Founder dashboard</p>
          <h1 className="mt-2 font-serif text-display-md font-medium">
            Morning, Rapheal.
          </h1>
        </div>
        <p className="text-sm text-muted">
          {now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* $1M pace tracker */}
      <section aria-labelledby="pace-heading" className="mt-10 rounded-2xl border border-line bg-surface p-6 sm:p-8">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 id="pace-heading" className="font-serif text-xl font-medium">
            Revenue vs. $1M goal
          </h2>
          <p className={`text-sm font-medium ${pace.onPace ? "text-gold" : "text-red-600 dark:text-red-400"}`}>
            {pace.onPace
              ? "On pace"
              : `Behind — need ${usd.format(pace.requiredMonthly)}/mo to close the gap`}
          </p>
        </div>
        <p className="mt-4 font-serif text-display-md font-medium">
          {usd.format(pace.yearToDate)}
          <span className="text-lg text-muted"> / {usd.format(pace.goal)}</span>
        </p>
        <div
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Progress toward annual revenue goal"
          className="mt-4 h-2 overflow-hidden rounded-full bg-line"
        >
          <div className="h-full rounded-full bg-gold" style={{ width: `${progress}%` }} />
        </div>
        {revenue.length === 0 ? (
          <p className="mt-3 text-xs text-muted">
            No revenue entries yet — add monthly entries in Sanity (type: revenueEntry).
          </p>
        ) : null}
      </section>

      {/* leads + pipelines */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <section aria-labelledby="leads-heading" className="rounded-2xl border border-line bg-surface p-6">
          <h2 id="leads-heading" className="font-serif text-xl font-medium">
            Leads
          </h2>
          <p className="mt-4 font-serif text-display-md font-medium">{thisWeek.length}</p>
          <p className="text-sm text-muted">
            this week · {lastWeekCount} last week{" "}
            {thisWeek.length >= lastWeekCount ? "↑" : "↓"}
          </p>
          <ul className="mt-4 space-y-1 text-sm text-muted">
            {Object.entries(
              thisWeek.reduce<Record<string, number>>((acc, c) => {
                acc[c.subsidiary] = (acc[c.subsidiary] ?? 0) + 1;
                return acc;
              }, {})
            ).map(([source, count]) => (
              <li key={source}>
                {source}: {count}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="pipeline-heading" className="rounded-2xl border border-line bg-surface p-6 lg:col-span-2">
          <h2 id="pipeline-heading" className="font-serif text-xl font-medium">
            Pipelines
          </h2>
          {pipelines.length === 0 ? (
            <p className="mt-4 text-sm text-muted">
              Connect HUBSPOT_ACCESS_TOKEN to see live pipeline value.
            </p>
          ) : (
            <table className="mt-4 w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left text-muted">
                  <th scope="col" className="pb-2 font-normal">Pipeline</th>
                  <th scope="col" className="pb-2 font-normal">Deals</th>
                  <th scope="col" className="pb-2 text-right font-normal">Value</th>
                </tr>
              </thead>
              <tbody>
                {pipelines.map((p) => (
                  <tr key={p.pipeline} className="border-b border-line/50">
                    <td className="py-2.5 font-medium">{getPipeline(p.pipeline).label}</td>
                    <td className="py-2.5">{p.dealCount}</td>
                    <td className="py-2.5 text-right">{usd.format(p.totalValue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>

      {/* hot leads */}
      <section aria-labelledby="hot-heading" className="mt-6 rounded-2xl border border-line bg-surface p-6">
        <h2 id="hot-heading" className="font-serif text-xl font-medium">
          🔥 Hot leads (last 30 days)
        </h2>
        {hotLeads.length === 0 ? (
          <p className="mt-4 text-sm text-muted">No hot leads right now.</p>
        ) : (
          <ul className="mt-4 divide-y divide-line/50">
            {hotLeads.map((lead) => (
              <li key={lead.email} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div>
                  <p className="font-medium">
                    {lead.firstName ? `${lead.firstName} · ` : ""}
                    {lead.email}
                  </p>
                  <p className="text-sm text-muted">
                    {lead.subsidiary} · score {lead.score}
                  </p>
                </div>
                <a
                  href={`mailto:${lead.email}`}
                  className="rounded-full bg-ink px-4 py-1.5 text-sm font-medium text-paper hover:opacity-85 dark:bg-paper dark:text-ink"
                >
                  Email
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>
    </Container>
  );
}
