import Link from "next/link";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <Container className="flex min-h-[50vh] flex-col items-center justify-center py-20 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 font-serif text-display-lg font-medium">
        That page isn&apos;t in the portfolio.
      </h1>
      <Link
        href="/"
        className="mt-8 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper hover:opacity-85 dark:bg-paper dark:text-ink"
      >
        Back to the homepage
      </Link>
    </Container>
  );
}
