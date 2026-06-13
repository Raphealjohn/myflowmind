import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/sections/reveal";
import { MeridianLine } from "@/components/sections/meridian-line";
import { Constellation } from "@/components/sections/constellation";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About",
  description:
    "The story of Kalevant Group — founded by Rapheal John in West Des Moines, Iowa. The name fuses his middle name, Kalejaiye, with 'levant' — rising. Built on a simple rule: operate every company like the client can see everything.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <Container className="max-w-3xl py-20 sm:py-28">
        <Reveal>
          <p className="eyebrow">About Kalevant Group</p>
          <h1 className="mt-4 font-serif text-display-lg font-medium">
            Built by one operator. Run like it shows.
          </h1>
        </Reveal>

        {/* founder story — first person, per the Enduring Ventures pattern */}
        <Reveal>
          <div className="mt-12 space-y-6 text-lg leading-relaxed">
            <p>
              I&apos;m Rapheal John, and Kalevant Group is the company I wished existed
              when I was helping small businesses untangle their operations: one
              accountable owner across automation, real estate, notarization, and
              security — instead of four vendors pointing at each other.
            </p>
            <p>
              Each business started the same way. I did the work myself, by hand, for
              real clients — automating workflows for a twelve-person firm, walking
              properties in the Des Moines metro, notarizing documents at kitchen
              tables, cleaning up access sprawl for companies that had outgrown shared
              passwords. Only when the playbook worked repeatedly did it become a
              company.
            </p>
            <p>
              The holding structure isn&apos;t financial engineering. It&apos;s a quality
              mechanism: every subsidiary inherits the same standard — answer fast,
              show your work, charge for outcomes — and none of them can hide behind a
              brand if they slip.
            </p>
            <p>
              We&apos;re headquartered in West Des Moines, Iowa, and we&apos;re building
              toward a simple goal: a portfolio of durable, useful companies that
              people in our community actually recommend to their neighbors.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <div className="mt-12">
            <ButtonLink href="/contact">Talk to me directly</ButtonLink>
          </div>
        </Reveal>
      </Container>

      <MeridianLine />

      {/* origin of the name — a core brand asset */}
      <section className="py-16 sm:py-24" aria-labelledby="name-heading">
        <Container className="max-w-3xl">
          <Reveal>
            <p className="eyebrow">The name</p>
            <h2 id="name-heading" className="mt-4 font-serif text-display-md font-medium">
              Why &ldquo;Kalevant&rdquo;
            </h2>
            <div className="mt-8 space-y-6 text-lg leading-relaxed">
              <p>
                Kalevant{" "}
                <span className="text-muted">(KAL&#8209;eh&#8209;vant)</span> is an
                invented word, and that&apos;s the point — it belongs to nothing else,
                so it can mean exactly what we build into it.
              </p>
              <p>
                It fuses two halves. The first is{" "}
                <strong>Kalejaiye</strong>, my middle name — a reminder that every
                company here carries one person&apos;s name and answers for it. The
                second is <strong>levant</strong>, from the same root as
                &ldquo;elevate&rdquo; — to <em>rise</em>. The Levant is also where the
                sun comes up.
              </p>
              <p>
                Put together: the rising of something personal. A family name pointed
                upward. That&apos;s the standard the four companies are held to — and the
                trajectory they&apos;re built for.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      <MeridianLine flip />

      <section className="py-16 sm:py-24" aria-labelledby="structure-heading">
        <Container>
          <Reveal>
            <h2 id="structure-heading" className="text-center font-serif text-display-md font-medium">
              The structure
            </h2>
          </Reveal>
          <div className="mt-10">
            <Constellation />
          </div>
        </Container>
      </section>
    </>
  );
}
