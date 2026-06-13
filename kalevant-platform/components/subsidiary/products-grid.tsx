import Link from "next/link";
import type { Product, SubsidiarySlug } from "@/lib/content";

const CADENCE_LABEL: Record<NonNullable<Product["cadence"]>, string> = {
  "one-time": "one-time",
  monthly: "/month",
  "per-visit": "per session",
};

const CTA_INTENT: Record<SubsidiarySlug, string> = {
  myflowmind: "automation",
  realty: "real_estate",
  notary: "notarization",
  security: "security",
};

/** Fixed-scope packaged offers — the storefront layer on each microsite. */
export function ProductsGrid({
  products,
  slug,
}: {
  products: Product[];
  slug: SubsidiarySlug;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {products.map((product) => (
        <article
          key={product.name}
          className="flex flex-col rounded-2xl border border-line bg-surface p-6"
        >
          <h3 className="font-serif text-xl font-medium">{product.name}</h3>
          <p className="mt-2 text-2xl font-semibold text-accent">
            {product.price}
            {product.cadence ? (
              <span className="ml-1 text-sm font-normal text-muted">
                {CADENCE_LABEL[product.cadence]}
              </span>
            ) : null}
          </p>
          <p className="mt-3 text-sm text-muted">{product.pitch}</p>
          <ul className="mt-4 flex-1 space-y-2 text-sm">
            {product.includes.map((item) => (
              <li key={item} className="flex gap-2">
                <span aria-hidden="true" className="text-accent">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
          <Link
            href={`/contact?intent=${CTA_INTENT[slug]}`}
            className="mt-6 rounded-full border border-accent py-2.5 text-center text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-ink"
          >
            Get started
          </Link>
        </article>
      ))}
    </div>
  );
}
