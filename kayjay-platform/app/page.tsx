import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Hero } from "@/components/sections/hero";
import { MeridianLine } from "@/components/sections/meridian-line";
import { Ticker } from "@/components/sections/ticker";
import { Constellation } from "@/components/sections/constellation";
import { BentoGrid } from "@/components/sections/bento-grid";
import { Reveal } from "@/components/sections/reveal";
import { ButtonLink } from "@/components/ui/button";
import { SITE_DESCRIPTION, SITE_NAME, siteUrl } from "@/lib/site";
import { COMPANIES } from "@/lib/content";

export const metadata: Metadata = {
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
};

const ORGANIZATION_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: siteUrl(),
  founder: { "@type": "Person", name: "Rapheal John" },
  address: {
    "@type": "PostalAddress",
    addressLocality: "West Des Moines",
    addressRegion: "IA",
    addressCountry: "US",
  },
  subOrganization: COMPANIES.map((c) => ({
    "@type": "Organization",
    name: c.name,
    description: c.tagline,
    url: `${siteUrl()}/companies/${c.slug}`,
  })),
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSONLD) }}
      />

      <Hero />
      <MeridianLine />
      <Ticker />

      {/* 3-second-legible structure: the constellation */}
      <section className="py-20 sm:py-28" aria-labelledby="structure-heading">
        <Container>
          <Reveal>
            <p className="eyebrow">The structure</p>
            <h2 id="structure-heading" className="mt-4 max-w-2xl font-serif text-display-lg font-medium">
              One holding company. Four ways we can help you.
            </h2>
          </Reveal>
          <div className="mt-12">
            <Constellation />
          </div>
        </Container>
      </section>

      <MeridianLine flip />

      {/* bento portfolio */}
      <section className="py-20 sm:py-28" aria-labelledby="portfolio-heading">
        <Container>
          <Reveal>
            <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="eyebrow">The portfolio</p>
                <h2 id="portfolio-heading" className="mt-4 font-serif text-display-lg font-medium">
                  Operating companies
                </h2>
              </div>
              <Link href="/companies" className="text-sm font-medium underline decoration-gold decoration-2 underline-offset-8 hover:text-gold">
                See all companies
              </Link>
            </div>
          </Reveal>
          <BentoGrid />
        </Container>
      </section>

      <MeridianLine />

      {/* founder note — Berkshire restraint, Enduring warmth */}
      <section className="py-20 sm:py-28" aria-labelledby="founder-heading">
        <Container className="max-w-3xl">
          <Reveal>
            <p className="eyebrow">From the founder</p>
            <h2 id="founder-heading" className="mt-4 font-serif text-display-md font-medium">
              “I build companies I&apos;d want to be a customer of.”
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted">
              Kalevant Group exists because small businesses deserve operators who
              answer their own phone. Every company in this portfolio is run with the
              same rule: do the work as if the client can see everything — because
              here, they can.
            </p>
            <p className="mt-6 font-medium">— Rapheal John, Founder &amp; CEO</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href="/about">Read the full story</ButtonLink>
              <ButtonLink href="/contact" variant="outline">
                Start a conversation
              </ButtonLink>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
