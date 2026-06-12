"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const reduced = useReducedMotion();
  const stagger = (i: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 28 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, delay: 0.12 * i, ease: EASE },
        };

  return (
    <section className="relative overflow-hidden pb-10 pt-20 sm:pt-28">
      <Container>
        <motion.p {...stagger(0)} className="eyebrow">
          Kayjay Holding · West Des Moines, Iowa
        </motion.p>

        <motion.h1
          {...stagger(1)}
          className="mt-6 max-w-5xl font-serif text-display-xl font-medium"
        >
          Four operating companies.
          <br />
          One standard of <em className="text-gold not-italic">execution</em>.
        </motion.h1>

        <motion.p {...stagger(2)} className="mt-8 max-w-xl text-lg text-muted">
          We build and operate businesses in workflow automation, real estate,
          notarization, and security consulting — each one accountable to the same
          owner, and to you.
        </motion.p>

        <motion.div {...stagger(3)} className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/companies">Explore the portfolio</ButtonLink>
          <ButtonLink href="/contact" variant="outline">
            Work with us
          </ButtonLink>
        </motion.div>
      </Container>

      {/* Static meridian arc behind the hero — the scroll-drawn ones follow below. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 320"
        className="pointer-events-none absolute -right-32 top-8 -z-10 hidden w-[60rem] opacity-40 lg:block"
        fill="none"
      >
        <path
          d="M 0 280 C 400 280, 600 40, 1440 80"
          stroke="rgb(var(--gold))"
          strokeWidth="1"
        />
        <path
          d="M 0 300 C 420 310, 640 80, 1440 140"
          stroke="rgb(var(--line))"
          strokeWidth="1"
        />
      </svg>
    </section>
  );
}
