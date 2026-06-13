import Link from "next/link";
import { COMPANIES } from "@/lib/content";
import { Reveal } from "@/components/sections/reveal";

/**
 * Bento portfolio overview with varied tile prominence: the first company
 * spans two columns, the rest fill in around it.
 */
export function BentoGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {COMPANIES.map((company, i) => (
        <Reveal key={company.slug} delay={i * 0.08} className={i === 0 ? "sm:col-span-2" : ""}>
          <Link
            href={`/companies/${company.slug}`}
            data-subsidiary={company.slug}
            className="group flex h-full min-h-[14rem] flex-col justify-between rounded-2xl border border-line bg-surface p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-accent sm:p-8"
          >
            <div>
              <span
                aria-hidden="true"
                className="inline-block h-2.5 w-2.5 rounded-full bg-accent"
              />
              <h3 className="mt-4 font-serif text-2xl font-medium">{company.name}</h3>
              <p className="mt-2 max-w-md text-sm text-muted">{company.summary}</p>
            </div>
            <p className="mt-6 text-sm font-medium text-accent">
              {company.tagline}
              <span
                aria-hidden="true"
                className="ml-1 inline-block transition-transform duration-300 ease-out group-hover:translate-x-1"
              >
                →
              </span>
            </p>
          </Link>
        </Reveal>
      ))}

      {/* future-company placeholder tile — the grid scales to N */}
      <Reveal delay={COMPANIES.length * 0.08}>
        <div className="flex h-full min-h-[14rem] flex-col justify-center rounded-2xl border border-dashed border-line p-6 text-center sm:p-8">
          <p className="font-serif text-xl text-muted">What&apos;s next</p>
          <p className="mt-2 text-sm text-muted">
            The next Kalevant company is already in diligence.
          </p>
        </div>
      </Reveal>
    </div>
  );
}
