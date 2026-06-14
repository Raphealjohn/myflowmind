"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import type { GatedResource } from "@/lib/resources";

type Status = "idle" | "submitting" | "done" | "error";

function ResourceGate({ resource }: { resource: GatedResource }) {
  const [status, setStatus] = useState<Status>("idle");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const pathname = usePathname();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setStatus("submitting");

    const res = await fetch("/api/resources", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: data.get("email"),
        firstName: data.get("firstName"),
        resourceSlug: resource.slug,
        consent: data.get("consent") === "on",
        sourcePage: pathname,
      }),
    }).catch(() => null);

    if (res?.ok) {
      const body = (await res.json()) as { downloadUrl?: string };
      setDownloadUrl(body.downloadUrl ?? null);
      setStatus("done");
    } else {
      setStatus("error");
    }
  }

  return (
    <div
      data-subsidiary={resource.subsidiary !== "general" ? resource.subsidiary : undefined}
      className="flex h-full flex-col rounded-2xl border border-line bg-surface p-6"
    >
      <span aria-hidden="true" className="inline-block h-2 w-8 rounded-full bg-accent" />
      <h3 className="mt-4 font-serif text-xl font-medium">{resource.title}</h3>
      <p className="mt-2 flex-1 text-sm text-muted">{resource.description}</p>

      {status === "done" ? (
        <div role="status" className="mt-6 text-sm">
          <p className="font-medium text-accent">Sent — check your inbox.</p>
          {downloadUrl ? (
            <a href={downloadUrl} className="mt-1 inline-block underline underline-offset-4">
              Or download it directly →
            </a>
          ) : null}
        </div>
      ) : (
        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <label htmlFor={`${resource.slug}-name`} className="sr-only">
            First name
          </label>
          <input
            id={`${resource.slug}-name`}
            name="firstName"
            placeholder="First name"
            autoComplete="given-name"
            className="w-full rounded-lg border border-line bg-paper px-4 py-2.5 text-sm placeholder:text-muted"
          />
          <label htmlFor={`${resource.slug}-email`} className="sr-only">
            Work email
          </label>
          <input
            id={`${resource.slug}-email`}
            name="email"
            type="email"
            required
            placeholder="Work email"
            autoComplete="email"
            className="w-full rounded-lg border border-line bg-paper px-4 py-2.5 text-sm placeholder:text-muted"
          />
          <div className="flex items-start gap-2">
            <input
              id={`${resource.slug}-consent`}
              name="consent"
              type="checkbox"
              required
              className="mt-0.5 h-3.5 w-3.5 rounded border-line"
            />
            <label htmlFor={`${resource.slug}-consent`} className="text-xs text-muted">
              Email me the download and occasional related resources. Unsubscribe anytime.
            </label>
          </div>
          {status === "error" ? (
            <p role="alert" className="text-xs text-red-600 dark:text-red-400">
              Delivery failed — please try again.
            </p>
          ) : null}
          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full rounded-full bg-accent py-2.5 text-sm font-medium text-ink transition-opacity hover:opacity-85 disabled:opacity-50"
          >
            {status === "submitting" ? "Sending…" : "Get the download"}
          </button>
        </form>
      )}
    </div>
  );
}

export function ResourceVault({ resources }: { resources: GatedResource[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {resources.map((resource) => (
        <ResourceGate key={resource.slug} resource={resource} />
      ))}
    </div>
  );
}
