"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

/**
 * Signature device: a thin gold meridian that draws itself across the
 * section as it scrolls into view, visually threading the portfolio together.
 */
export function MeridianLine({ flip = false }: { flip?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 90%", "end 40%"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });
  const pathLength = useTransform(progress, [0, 1], [0, 1]);

  const d = flip
    ? "M 1440 30 C 1080 30, 1000 90, 720 90 S 360 30, 0 60"
    : "M 0 30 C 360 30, 440 90, 720 90 S 1080 30, 1440 60";

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none w-full overflow-hidden">
      <svg viewBox="0 0 1440 120" className="h-16 w-full sm:h-24" preserveAspectRatio="none">
        {reduced ? (
          <path d={d} className="meridian-path" />
        ) : (
          <motion.path d={d} className="meridian-path" style={{ pathLength }} />
        )}
      </svg>
    </div>
  );
}
