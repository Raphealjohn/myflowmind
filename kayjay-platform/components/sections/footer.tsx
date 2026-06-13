import Link from "next/link";
import { Container } from "@/components/ui/container";
import { COMPANIES } from "@/lib/content";
import { NewsletterForm } from "@/components/sections/newsletter-form";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line">
      <Container className="grid gap-12 py-14 md:grid-cols-[2fr_1fr_1fr_2fr]">
        <div>
          <p className="font-serif text-lg font-semibold">
            Kalevant<span className="text-gold">.</span>
          </p>
          <p className="mt-3 max-w-xs text-sm text-muted">
            A holding company in West Des Moines, Iowa — operating businesses in
            automation, real estate, notarization, and security.
          </p>
        </div>

        <nav aria-label="Companies">
          <p className="eyebrow mb-3">Companies</p>
          <ul className="space-y-2 text-sm">
            {COMPANIES.map((c) => (
              <li key={c.slug}>
                <Link href={`/companies/${c.slug}`} className="text-muted hover:text-ink">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Company">
          <p className="eyebrow mb-3">Kalevant</p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/about" className="text-muted hover:text-ink">
                About
              </Link>
            </li>
            <li>
              <Link href="/insights" className="text-muted hover:text-ink">
                Insights
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-muted hover:text-ink">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/legal/privacy" className="text-muted hover:text-ink">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/legal/terms" className="text-muted hover:text-ink">
                Terms
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <p className="eyebrow mb-3">The Kalevant Brief</p>
          <p className="mb-4 text-sm text-muted">
            One email a month on building and operating small companies. No noise.
          </p>
          <NewsletterForm />
        </div>
      </Container>

      <div className="border-t border-line py-5">
        <Container className="flex flex-col gap-2 text-xs text-muted sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Kalevant Group. All rights reserved.</p>
          <p>West Des Moines, Iowa</p>
        </Container>
      </div>
    </footer>
  );
}
