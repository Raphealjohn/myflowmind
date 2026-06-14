import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/sections/reveal";
import { ResourceVault } from "@/components/sections/resource-vault";
import { NewsletterForm } from "@/components/sections/newsletter-form";
import { getArticles } from "@/lib/insights";
import { RESOURCES } from "@/lib/resources";
import { COMPANIES, getCompany } from "@/lib/content";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Field notes from operating four companies: automation, real estate, notarization, and security for small businesses.",
  alternates: { canonical: "/insights" },
};

interface Props {
  searchParams: { company?: string };
}

export default async function InsightsPage({ searchParams }: Props) {
  const articles = await getArticles();
  const filter = searchParams.company;
  const filtered = filter ? articles.filter((a) => a.subsidiary === filter) : articles;

  return (
    <Container className="py-20 sm:py-28">
      <Reveal>
        <p className="eyebrow">Insights</p>
        <h1 className="mt-4 max-w-3xl font-serif text-display-lg font-medium">
          Field notes from the operating floor.
        </h1>
      </Reveal>

      {/* per-company filter */}
      <nav aria-label="Filter articles by company" className="mt-10 flex flex-wrap gap-2">
        <Link
          href="/insights"
          className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
            !filter ? "border-ink bg-ink text-paper dark:border-paper dark:bg-paper dark:text-ink" : "border-line text-muted hover:border-ink"
          }`}
        >
          All
        </Link>
        {COMPANIES.map((c) => (
          <Link
            key={c.slug}
            href={`/insights?company=${c.slug}`}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              filter === c.slug
                ? "border-ink bg-ink text-paper dark:border-paper dark:bg-paper dark:text-ink"
                : "border-line text-muted hover:border-ink"
            }`}
          >
            {c.name}
          </Link>
        ))}
      </nav>

      {/* article list */}
      <div className="mt-12 divide-y divide-line border-y border-line">
        {filtered.map((article) => {
          const company = getCompany(article.subsidiary as never);
          return (
            <article key={article.slug} className="group py-8">
              <Link href={`/insights/${article.slug}`} className="grid gap-2 sm:grid-cols-[10rem_1fr]">
                <div className="text-sm text-muted">
                  <time dateTime={article.publishedAt}>
                    {new Date(article.publishedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </time>
                  {company ? <p className="mt-1">{company.name}</p> : null}
                </div>
                <div>
                  <h2 className="font-serif text-2xl font-medium transition-colors group-hover:text-gold">
                    {article.title}
                  </h2>
                  <p className="mt-2 max-w-2xl text-muted">{article.excerpt}</p>
                </div>
              </Link>
            </article>
          );
        })}
        {filtered.length === 0 ? (
          <p className="py-12 text-center text-muted">No articles yet for this company.</p>
        ) : null}
      </div>

      {/* The Kalevant Brief */}
      <Reveal>
        <section
          aria-labelledby="brief-heading"
          className="mt-20 rounded-3xl border border-line bg-surface p-8 sm:p-12"
        >
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <h2 id="brief-heading" className="font-serif text-display-md font-medium">
                The Kalevant Brief
              </h2>
              <p className="mt-3 max-w-md text-muted">
                One email a month: what we automated, bought, fixed, or learned across
                the portfolio. Written by the founder, not a content team.
              </p>
            </div>
            <NewsletterForm />
          </div>
        </section>
      </Reveal>

      {/* Resource vault */}
      <section aria-labelledby="vault-heading" className="mt-20">
        <Reveal>
          <h2 id="vault-heading" className="font-serif text-display-md font-medium">
            The Resource Vault
          </h2>
          <p className="mt-3 max-w-xl text-muted">
            The working documents we use with paying clients — free, in exchange for an
            email address.
          </p>
        </Reveal>
        <div className="mt-10">
          <ResourceVault resources={RESOURCES} />
        </div>
      </section>
    </Container>
  );
}
