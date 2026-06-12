import type { Metadata } from "next";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Terms of Service",
  alternates: { canonical: "/legal/terms" },
};

export default function TermsPage() {
  return (
    <Container as="article" className="max-w-3xl py-20 sm:py-28">
      <h1 className="font-serif text-display-lg font-medium">Terms of Service</h1>
      <p className="mt-4 text-sm text-muted">Last updated: June 2026</p>

      <div className="mt-10 space-y-8 leading-relaxed">
        <section>
          <h2 className="font-serif text-2xl font-medium">Who we are</h2>
          <p className="mt-3 text-muted">
            This website is operated by Kayjay Holding of West Des Moines, Iowa, on
            behalf of its operating companies: MyFlowMind, Kayjay Realty, Kayjay
            Notary Services, and Kayjay Security Consulting. Services are provided
            by the individual operating company you engage, under its own service
            agreement.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-2xl font-medium">Use of this site</h2>
          <p className="mt-3 text-muted">
            Content on this site is provided for general information and does not
            constitute legal, financial, real estate, or security advice. Submitting
            an inquiry or booking a consultation does not create a client
            relationship until a written agreement is signed with the relevant
            operating company.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-2xl font-medium">Intellectual property</h2>
          <p className="mt-3 text-muted">
            All content, branding, and downloadable resources on this site belong to
            Kayjay Holding or its operating companies. Gated resources are licensed
            for your internal business use and may not be resold or redistributed.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-2xl font-medium">Limitation of liability</h2>
          <p className="mt-3 text-muted">
            The site is provided as-is. To the maximum extent permitted by Iowa law,
            Kayjay Holding is not liable for indirect or consequential damages
            arising from use of this website. Engagements with operating companies
            are governed by their individual agreements.
          </p>
        </section>
      </div>
    </Container>
  );
}
