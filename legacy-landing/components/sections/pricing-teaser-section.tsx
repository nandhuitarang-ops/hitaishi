"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PRICING_TEASER } from "@/lib/content/hero";
import { PRIMARY_CTAS } from "@/lib/content/brand";

export function PricingTeaserSection() {
  return (
    <section
      id="pricing-teaser"
      className="bg-[var(--color-background)] py-24 md:py-32"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-3xl px-6 text-center md:px-12"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-sky)]">
          {PRICING_TEASER.eyebrow}
        </p>
        <h2 className="mt-5 font-serif text-3xl font-medium leading-tight tracking-tight text-[var(--color-fg)] md:text-4xl lg:text-5xl">
          {PRICING_TEASER.headline}
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[var(--color-fg-muted)] md:text-lg">
          {PRICING_TEASER.body}
        </p>
        <Link
          href={PRIMARY_CTAS.pricing.href}
          className="mt-10 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-[var(--color-fg)] px-6 py-3 text-sm font-medium text-[var(--color-background)] transition-colors hover:bg-[var(--color-accent-hover)] sm:w-auto"
        >
          {PRIMARY_CTAS.pricing.label} <span aria-hidden>→</span>
        </Link>
      </motion.div>
    </section>
  );
}
