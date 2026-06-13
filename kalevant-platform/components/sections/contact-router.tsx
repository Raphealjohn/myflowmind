"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  ConsentField,
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/ui/field";
import {
  contactSchema,
  INTENT_ROUTING,
  INTENTS,
  type ContactFormValues,
  type ContactIntent,
} from "@/lib/validation";

/** Conditional follow-up prompt per intent — the "smart" in smart router. */
const INTENT_PROMPTS: Record<ContactIntent, string> = {
  automation:
    "Which workflows eat the most of your team's time? (e.g. lead follow-up, invoicing, scheduling)",
  real_estate:
    "Are you buying, selling, or investing — and in which part of the metro?",
  notarization:
    "What documents need notarizing, and do you prefer mobile or remote online?",
  security:
    "Roughly how many people are in your company, and which identity platform do you use today (if any)?",
  partnership: "Tell us about the opportunity and the timeline you're working with.",
  other: "How can we help?",
};

type Status = "idle" | "submitting" | "done" | "error";

export function ContactRouter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const presetIntent = searchParams.get("intent");
  const defaultIntent: ContactIntent = INTENTS.includes(presetIntent as ContactIntent)
    ? (presetIntent as ContactIntent)
    : "automation";

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { intent: defaultIntent, sourcePage: pathname },
  });

  const intent = watch("intent");

  async function onSubmit(values: ContactFormValues) {
    // Optimistic: flip to submitting state immediately, roll back on failure.
    setStatus("submitting");
    setServerError(null);

    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, sourcePage: pathname }),
    }).catch(() => null);

    if (res?.ok) {
      setStatus("done");
    } else {
      setStatus("error");
      const body = res ? ((await res.json().catch(() => null)) as { message?: string } | null) : null;
      setServerError(
        body?.message ?? "Something went wrong. Email us directly and we'll sort it out."
      );
    }
  }

  if (status === "done") {
    return (
      <div role="status" className="rounded-2xl border border-line bg-surface p-10 text-center">
        <p className="font-serif text-display-md font-medium">Got it. ✓</p>
        <p className="mx-auto mt-4 max-w-md text-muted">
          Your inquiry is in the {INTENT_ROUTING[intent].label.toLowerCase()} queue. A
          human — usually Rapheal — replies within one business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <SelectField
        label="What brings you here?"
        required
        error={errors.intent?.message}
        {...register("intent")}
      >
        {INTENTS.map((value) => (
          <option key={value} value={value}>
            {INTENT_ROUTING[value].label}
          </option>
        ))}
      </SelectField>

      <div className="grid gap-6 sm:grid-cols-2">
        <TextField
          label="First name"
          required
          autoComplete="given-name"
          error={errors.firstName?.message}
          {...register("firstName")}
        />
        <TextField
          label="Last name"
          autoComplete="family-name"
          error={errors.lastName?.message}
          {...register("lastName")}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <TextField
          label="Email"
          type="email"
          required
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <TextField
          label="Phone"
          type="tel"
          autoComplete="tel"
          error={errors.phone?.message}
          {...register("phone")}
        />
      </div>

      <TextField
        label="Company"
        autoComplete="organization"
        error={errors.company?.message}
        {...register("company")}
      />

      <TextAreaField
        label={INTENT_PROMPTS[intent]}
        required
        error={errors.message?.message}
        {...register("message")}
      />

      <ConsentField error={errors.consent?.message} {...register("consent")} />

      {serverError ? (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {serverError}
        </p>
      ) : null}

      <Button type="submit" disabled={status === "submitting"} className="w-full sm:w-auto">
        {status === "submitting" ? "Sending…" : "Send it"}
      </Button>
    </form>
  );
}
