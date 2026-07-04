"use client";

import { motion } from "framer-motion";
import { PROBLEM } from "@/lib/content/hero";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export function ProblemSection() {
  return (
    <section
      id="problem"
      className="bg-[var(--color-background)] py-24 md:py-32"
    >
      <div className="mx-auto max-w-5xl px-6 md:px-12 lg:px-20">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-3xl font-medium leading-tight tracking-tight text-[var(--color-fg)] md:text-4xl lg:text-5xl"
        >
          {PROBLEM.headline}
        </motion.h2>

        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-3xl text-base leading-relaxed text-[var(--color-fg-muted)] md:text-lg"
        >
          {PROBLEM.body}
        </motion.p>

        <div className="mt-14 grid gap-6 md:mt-16 md:grid-cols-2 md:gap-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-solid)] p-8 md:p-10"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
              {PROBLEM.without.title}
            </p>
            <p className="mt-4 text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
              {PROBLEM.without.body}
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-[var(--color-sky)]/30 bg-[var(--color-sky-soft)]/40 p-8 md:p-10"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-sky-hover)]">
              {PROBLEM.with.title}
            </p>
            <p className="mt-4 text-lg leading-relaxed text-[var(--color-fg)] md:text-xl">
              {PROBLEM.with.body}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
