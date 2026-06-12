import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { BentoGrid } from "@/components/sections/bento-grid";
import { Reveal } from "@/components/sections/reveal";

export const metadata: Metadata = {
  title: "Companies",
  description:
    "The Kayjay Holding portfolio: MyFlowMind, Kayjay Realty, Kayjay Notary Services, and Kayjay Security Consulting.",
  alternates: { canonical: "/companies" },
};

export default function CompaniesPage() {
  return (
    <Container className="py-20 sm:py-28">
      <Reveal>
        <p className="eyebrow">The portfolio</p>
        <h1 className="mt-4 max-w-3xl font-serif text-display-lg font-medium">
          Companies built to be kept, not flipped.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted">
          Each Kayjay company serves its own customers under its own brand — and is
          held to the parent standard for responsiveness, transparency, and craft.
        </p>
      </Reveal>
      <div className="mt-14">
        <BentoGrid />
      </div>
    </Container>
  );
}
