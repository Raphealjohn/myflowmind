"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { COMPANIES } from "@/lib/content";

const CENTER = { x: 300, y: 220 };
const NODE_POSITIONS = [
  { x: 110, y: 90 },
  { x: 490, y: 90 },
  { x: 110, y: 350 },
  { x: 490, y: 350 },
];

/**
 * Interactive company constellation: each subsidiary orbits the Kayjay
 * center. Hover/focus shows a summary card; click/Enter navigates.
 */
export function Constellation() {
  const router = useRouter();
  const reduced = useReducedMotion();
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="relative mx-auto max-w-2xl">
      <svg
        viewBox="0 0 600 440"
        role="group"
        aria-label="Kayjay company structure: four subsidiaries connected to the Kayjay Holding center"
        className="w-full"
      >
        {/* connecting lines */}
        {NODE_POSITIONS.map((pos, i) => (
          <motion.line
            key={COMPANIES[i].slug}
            x1={CENTER.x}
            y1={CENTER.y}
            x2={pos.x}
            y2={pos.y}
            stroke="rgb(var(--line))"
            strokeWidth="1"
            initial={reduced ? undefined : { pathLength: 0 }}
            whileInView={reduced ? undefined : { pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.15 * i, ease: "easeOut" }}
          />
        ))}

        {/* center node */}
        <circle cx={CENTER.x} cy={CENTER.y} r="46" fill="rgb(var(--ink))" />
        <text
          x={CENTER.x}
          y={CENTER.y + 5}
          textAnchor="middle"
          className="fill-paper font-serif"
          fontSize="16"
        >
          Kayjay
        </text>

        {/* subsidiary nodes */}
        {COMPANIES.map((company, i) => {
          const pos = NODE_POSITIONS[i];
          return (
            <g
              key={company.slug}
              role="link"
              tabIndex={0}
              aria-label={`${company.name}: ${company.tagline}`}
              className="cursor-pointer outline-none focus-visible:opacity-80"
              onClick={() => router.push(`/companies/${company.slug}`)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  router.push(`/companies/${company.slug}`);
                }
              }}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
            >
              <circle
                cx={pos.x}
                cy={pos.y}
                r={active === i ? 40 : 34}
                fill={company.accentHex}
                opacity={active === null || active === i ? 0.92 : 0.35}
                style={{ transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)" }}
              />
              <text
                x={pos.x}
                y={pos.y + (pos.y < CENTER.y ? -52 : 64)}
                textAnchor="middle"
                fontSize="14"
                className="fill-ink font-medium"
              >
                {company.name}
              </text>
            </g>
          );
        })}
      </svg>

      {/* hover/focus summary card */}
      <div aria-live="polite" className="mt-4 min-h-[5rem] text-center">
        {active !== null ? (
          <div className="mx-auto max-w-md rounded-xl border border-line bg-surface px-5 py-4 text-sm shadow-sm">
            <p className="font-medium">{COMPANIES[active].name}</p>
            <p className="mt-1 text-muted">{COMPANIES[active].summary}</p>
          </div>
        ) : (
          <p className="text-sm text-muted">
            Hover or tab through the constellation to explore each company.
          </p>
        )}
      </div>
    </div>
  );
}
