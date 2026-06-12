import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/sections/reveal";
import { MeridianLine } from "@/components/sections/meridian-line";
import { FaqSection } from "@/components/sections/faq-section";
import { ServicesGrid } from "@/components/subsidiary/services-grid";
import { ButtonLink } from "@/components/ui/button";
import { COMPANIES, getCompany, type SubsidiarySlug } from "@/lib/content";
import { siteUrl } from "@/lib/site";

/** Contact-router intent each subsidiary CTA pre-selects. */
const CTA_INTENT: Record<SubsidiarySlug, string> = {
  myflowmind: "automation",
  realty: "real_estate",
  notary: "notarization",
  security: "security",
};

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return COMPANIES.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const company = getCompany(params.slug);
  if (!company) return {};
  return {
    title: `${company.name} — ${company.tagline}`,
    description: company.summary,
    alternates: { canonical: `/companies/${company.slug}` },
    openGraph: { title: company.name, description: company.summary },
  };
}

export default function CompanyPage({ params }: Props) {
  const company = getCompany(params.slug);
  if (!company) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: company.name,
    description: company.summary,
    url: `${siteUrl()}/companies/${company.slug}`,
    parentOrganization: { "@type": "Organization", name: "Kayjay Holding" },
    address: {
      "@type": "PostalAddress",
      addressLocality: "West Des Moines",
      addressRegion: "IA",
      addressCountry: "US",
    },
  };

  return (
    <div data-subsidiary={company.slug}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* hero */}
      <section className="pb-10 pt-20 sm:pt-28">
        <Container>
          <Reveal>
            <p className="eyebrow flex items-center gap-2">
              <span aria-hidden="true" className="inline-block h-2 w-2 rounded-full bg-accent" />
              A Kayjay Holding company
            </p>
            <h1 className="mt-6 max-w-4xl font-serif text-display-lg font-medium">
              {company.name}
            </h1>
            <p className="mt-4 text-xl text-accent">{company.tagline}</p>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
              {company.positioning}
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href="#cta" variant="accent">
                {company.ctaLabel}
              </ButtonLink>
              {company.externalUrl ? (
                <a
                  href={company.externalUrl}
                  className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-medium hover:border-ink dark:hover:border-paper"
                >
                  Visit {new URL(company.externalUrl).hostname} ↗
                </a>
              ) : null}
            </div>
          </Reveal>
        </Container>
      </section>

      <MeridianLine />

      {/* services */}
      <section className="py-16 sm:py-24" aria-labelledby="services-heading">
        <Container>
          <Reveal>
            <h2 id="services-heading" className="mb-10 font-serif text-display-md font-medium">
              What we do
            </h2>
          </Reveal>
          <ServicesGrid services={company.services} />
        </Container>
      </section>

      {/* testimonial */}
      {company.testimonials.length > 0 ? (
        <section className="border-y border-line py-16 sm:py-20" aria-label="Client testimonial">
          <Container className="max-w-3xl">
            <Reveal>
              {company.testimonials.map((t) => (
                <blockquote key={t.quote}>
                  <p className="font-serif text-display-md font-medium leading-snug">
                    “{t.quote}”
                  </p>
                  <footer className="mt-6 text-sm text-muted">
                    {t.author} · {t.role}
                  </footer>
                </blockquote>
              ))}
            </Reveal>
          </Container>
        </section>
      ) : null}

      {/* FAQ */}
      <section className="py-16 sm:py-24">
        <Container className="max-w-3xl">
          <Reveal>
            <FaqSection items={company.faq} />
          </Reveal>
        </Container>
      </section>

      {/* CTA → routes into this company's CRM pipeline via the contact router */}
      <section id="cta" className="pb-24">
        <Container>
          <Reveal>
            <div className="rounded-3xl bg-ink px-6 py-14 text-center text-paper sm:px-14 dark:bg-surface">
              <h2 className="font-serif text-display-md font-medium">
                Ready when you are.
              </h2>
              <p className="mx-auto mt-4 max-w-md text-paper/70 dark:text-muted">
                Tell us what you need — your inquiry goes straight into the{" "}
                {company.name} pipeline, and a human replies within one business day.
              </p>
              <div className="mt-8">
                <Link
                  href={`/contact?intent=${CTA_INTENT[company.slug]}`}
                  className="inline-flex rounded-full bg-accent px-7 py-3 text-sm font-medium text-ink transition-opacity hover:opacity-85"
                >
                  {company.ctaLabel}
                </Link>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </div>
  );
}
