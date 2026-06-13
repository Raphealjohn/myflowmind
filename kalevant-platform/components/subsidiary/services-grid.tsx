"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Service } from "@/lib/content";

/** Services grid with an accessible native <dialog> for service detail. */
export function ServicesGrid({ services }: { services: Service[] }) {
  const [selected, setSelected] = useState<Service | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (selected) dialogRef.current?.showModal();
  }, [selected]);

  const close = useCallback(() => {
    dialogRef.current?.close();
    setSelected(null);
  }, []);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        {services.map((service) => (
          <button
            key={service.title}
            type="button"
            onClick={() => setSelected(service)}
            className="group rounded-2xl border border-line bg-surface p-6 text-left transition-all duration-300 ease-out hover:-translate-y-1 hover:border-accent"
          >
            <span aria-hidden="true" className="inline-block h-2 w-8 rounded-full bg-accent" />
            <h3 className="mt-4 font-serif text-xl font-medium">{service.title}</h3>
            <p className="mt-2 text-sm text-muted">{service.description}</p>
            <p className="mt-4 text-sm font-medium text-accent">
              Details
              <span aria-hidden="true" className="ml-1 inline-block transition-transform group-hover:translate-x-1">
                →
              </span>
            </p>
          </button>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        onClose={close}
        onClick={(e) => {
          if (e.target === dialogRef.current) close();
        }}
        className="w-full max-w-lg rounded-2xl border border-line bg-surface p-0 text-ink backdrop:bg-ink/50 backdrop:backdrop-blur-sm"
      >
        {selected ? (
          <div className="p-8">
            <h3 className="font-serif text-2xl font-medium">{selected.title}</h3>
            <p className="mt-4 leading-relaxed text-muted">{selected.detail}</p>
            <div className="mt-8 flex justify-end gap-3">
              <button
                type="button"
                onClick={close}
                className="rounded-full border border-line px-5 py-2 text-sm hover:border-ink"
              >
                Close
              </button>
              <a
                href="#cta"
                onClick={close}
                className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-ink hover:opacity-85"
              >
                Get started
              </a>
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
