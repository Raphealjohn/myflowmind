import { Container } from "@/components/ui/container";
import { getTickerMetrics } from "@/lib/content";

/**
 * Live portfolio ticker — operational numbers, CMS-editable so they never
 * go stale. Server component; revalidates with the Sanity fetch.
 */
export async function Ticker() {
  const metrics = await getTickerMetrics();

  return (
    <section aria-label="Portfolio metrics" className="border-y border-line py-8">
      <Container>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
          {metrics.slice(0, 4).map((metric) => (
            <div key={metric.label}>
              <dd className="font-serif text-display-md font-medium text-gold">
                {metric.value}
              </dd>
              <dt className="mt-1 text-sm text-muted">{metric.label}</dt>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
