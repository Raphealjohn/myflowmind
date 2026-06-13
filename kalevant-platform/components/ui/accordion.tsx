"use client";

import { useState } from "react";
import type { FaqItem } from "@/lib/content";

/** Native details/summary accordion — keyboard accessible for free. */
export function Accordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item, i) => (
        <details
          key={item.question}
          open={open === i}
          onToggle={(e) => {
            if ((e.target as HTMLDetailsElement).open) setOpen(i);
            else if (open === i) setOpen(null);
          }}
          className="group py-5"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-medium [&::-webkit-details-marker]:hidden">
            {item.question}
            <span
              aria-hidden="true"
              className="text-gold transition-transform duration-200 ease-out group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="mt-3 max-w-measure text-muted">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
