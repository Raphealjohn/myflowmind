import { Accordion } from "@/components/ui/accordion";
import type { FaqItem } from "@/lib/content";

/** FAQ accordion with schema.org FAQPage JSON-LD for featured snippets. */
export function FaqSection({ items, heading = "Questions, answered" }: { items: FaqItem[]; heading?: string }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <section aria-labelledby="faq-heading">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h2 id="faq-heading" className="mb-8 font-serif text-display-md font-medium">
        {heading}
      </h2>
      <Accordion items={items} />
    </section>
  );
}
