"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

type Status = "idle" | "submitting" | "done" | "error";

export function NewsletterForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus("submitting");
    setError(null);

    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: data.get("email"),
        consent: data.get("consent") === "on",
        sourcePage: pathname,
      }),
    }).catch(() => null);

    if (res?.ok) {
      setStatus("done");
      form.reset();
    } else {
      setStatus("error");
      setError("Subscription failed — please try again.");
    }
  }

  if (status === "done") {
    return (
      <p role="status" className="text-sm font-medium text-accent">
        You&apos;re in. First Brief lands next month.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="flex gap-2">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          placeholder="you@company.com"
          className="w-full rounded-full border border-line bg-surface px-4 py-2.5 text-sm placeholder:text-muted"
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className="shrink-0 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-opacity hover:opacity-85 disabled:opacity-50 dark:bg-paper dark:text-ink"
        >
          {status === "submitting" ? "…" : "Subscribe"}
        </button>
      </div>
      <div className="flex items-start gap-2">
        <input
          id="newsletter-consent"
          name="consent"
          type="checkbox"
          required
          className="mt-0.5 h-3.5 w-3.5 rounded border-line"
        />
        <label htmlFor="newsletter-consent" className="text-xs text-muted">
          I agree to receive The Kayjay Brief. Unsubscribe anytime.
        </label>
      </div>
      {error ? (
        <p role="alert" className="text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : null}
    </form>
  );
}
