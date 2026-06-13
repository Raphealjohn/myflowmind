"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Container } from "@/components/ui/container";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const LINKS = [
  { href: "/companies", label: "Companies" },
  { href: "/about", label: "About" },
  { href: "/insights", label: "Insights" },
  { href: "/contact", label: "Contact" },
];

/**
 * Sticky condensing nav. On /companies/[slug] routes the layout sets
 * data-subsidiary on <body>, so the gold underline + CTA pick up the
 * subsidiary accent automatically via the --accent custom property.
 */
export function Nav() {
  const [condensed, setCondensed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur transition-all duration-300 ease-out ${
        condensed
          ? "border-line bg-paper/90 py-2"
          : "border-transparent bg-paper/60 py-4"
      }`}
    >
      <Container className="flex items-center justify-between gap-4">
        <Link href="/" className="font-serif text-lg font-semibold tracking-tight">
          Kalevant<span className="text-accent">.</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
          {LINKS.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`text-sm transition-colors hover:text-ink ${
                  active
                    ? "text-ink underline decoration-accent decoration-2 underline-offset-8"
                    : "text-muted"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/contact"
            className="hidden rounded-full bg-ink px-5 py-2 text-sm font-medium text-paper transition-opacity hover:opacity-85 sm:inline-flex dark:bg-paper dark:text-ink"
          >
            Start a conversation
          </Link>
          <button
            type="button"
            className="rounded-full border border-line p-2 md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span aria-hidden="true">{menuOpen ? "✕" : "☰"}</span>
          </button>
        </div>
      </Container>

      {menuOpen ? (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className="border-t border-line bg-paper md:hidden"
        >
          <Container className="flex flex-col gap-1 py-4">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-3 text-base hover:bg-line/40"
              >
                {link.label}
              </Link>
            ))}
          </Container>
        </nav>
      ) : null}
    </header>
  );
}
