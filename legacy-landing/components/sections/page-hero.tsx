"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface PageHeroProps {
  eyebrow: string;
  headline: string;
  intro: ReactNode;
}

export function PageHero({ eyebrow, headline, intro }: PageHeroProps) {
  return (
    <section className="bg-[var(--color-background)] pt-32 pb-16 md:pt-40 md:pb-24">
      <div className="mx-auto max-w-4xl px-6 md:px-12">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-sky)]"
        >
          {eyebrow}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 font-serif text-[clamp(2.2rem,5vw,4rem)] font-medium leading-[1.05] tracking-tight text-[var(--color-fg)]"
        >
          {headline}
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--color-fg-muted)] md:text-lg"
        >
          {intro}
        </motion.div>
      </div>
    </section>
  );
}
