import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/ui/container";
import { ContactRouter } from "@/components/sections/contact-router";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell us what you need — automation, real estate, notarization, or security — and your inquiry routes straight to the right Kalevant company.",
  alternates: { canonical: "/contact" },
};

function FormSkeleton() {
  return (
    <div className="space-y-6" aria-hidden="true">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="skeleton h-12 w-full" />
      ))}
    </div>
  );
}

export default function ContactPage() {
  return (
    <Container className="grid gap-14 py-20 sm:py-28 lg:grid-cols-[1fr_1.2fr]">
      <div>
        <p className="eyebrow">Contact</p>
        <h1 className="mt-4 font-serif text-display-lg font-medium">
          One form. The right desk.
        </h1>
        <p className="mt-6 max-w-md text-lg text-muted">
          Pick what you need and your message routes directly to the right Kalevant
          company — no info@ black hole. Expect a reply within one business day.
        </p>
        <dl className="mt-10 space-y-4 text-sm">
          <div>
            <dt className="font-medium">Headquarters</dt>
            <dd className="text-muted">West Des Moines, Iowa</dd>
          </div>
          <div>
            <dt className="font-medium">Founder</dt>
            <dd className="text-muted">Rapheal John</dd>
          </div>
        </dl>
      </div>
      <div>
        <Suspense fallback={<FormSkeleton />}>
          <ContactRouter />
        </Suspense>
      </div>
    </Container>
  );
}
