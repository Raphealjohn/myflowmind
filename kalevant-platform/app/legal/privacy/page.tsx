import type { Metadata } from "next";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Privacy Policy",
  alternates: { canonical: "/legal/privacy" },
};

/** Wired to actual data practices: HubSpot CRM, Resend email, Cal.com, analytics. */
export default function PrivacyPage() {
  return (
    <Container as="article" className="max-w-3xl py-20 sm:py-28">
      <h1 className="font-serif text-display-lg font-medium">Privacy Policy</h1>
      <p className="mt-4 text-sm text-muted">Last updated: June 2026</p>

      <div className="mt-10 space-y-8 leading-relaxed">
        <section>
          <h2 className="font-serif text-2xl font-medium">What we collect</h2>
          <p className="mt-3 text-muted">
            When you submit a form, book an appointment, subscribe to The Kalevant
            Brief, or download a gated resource, we collect the information you
            provide: name, email address, phone number, company, and your message.
            We also record the page you submitted from and, if you arrived from a
            marketing link, campaign parameters (UTM tags) stored in a first-party
            cookie for up to 90 days.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-2xl font-medium">Where it lives</h2>
          <p className="mt-3 text-muted">
            Contact and inquiry data is stored in HubSpot, our customer relationship
            management system. Transactional and follow-up emails are sent through
            Resend. Appointment bookings are processed by Cal.com. Site analytics
            are aggregate and do not identify you personally.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-2xl font-medium">How we use it</h2>
          <p className="mt-3 text-muted">
            We use your information to respond to your inquiry, deliver what you
            requested, and — only if you checked the consent box — send relevant
            follow-up emails. We score inquiries internally to prioritize fast
            responses. We do not sell or rent personal information to anyone.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-2xl font-medium">Your choices</h2>
          <p className="mt-3 text-muted">
            Every email we send includes a one-click unsubscribe link that takes
            effect immediately. You can also request access to, correction of, or
            deletion of your data at any time by writing to us through the contact
            page — we process such requests within 30 days.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-2xl font-medium">Contact</h2>
          <p className="mt-3 text-muted">
            Kalevant Group LLC, West Des Moines, Iowa. Reach us via the contact page for
            any privacy question or request.
          </p>
        </section>
      </div>
    </Container>
  );
}
