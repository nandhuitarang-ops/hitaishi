"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { FAQ_ITEMS } from "@/lib/content/faq";

export function FaqSection() {
  return (
    <section
      id="faq"
      className="bg-[var(--color-background-alt)] py-24 md:py-32"
    >
      <div className="mx-auto max-w-4xl px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-sky)]">
            FAQ
          </p>
          <h2 className="mt-4 font-serif text-3xl font-medium leading-tight tracking-tight text-[var(--color-fg)] md:text-4xl lg:text-5xl">
            Got questions? Here&apos;s what students &amp; partners ask most.
          </h2>
        </motion.div>

        <div className="mt-14 space-y-3">
          {FAQ_ITEMS.map((item, i) => (
            <motion.details
              key={item.q}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-solid)] px-6 py-5 transition-colors open:bg-[var(--color-surface-hover)] md:px-8 md:py-6"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-left">
                <span className="font-serif text-lg font-medium leading-snug text-[var(--color-fg)] md:text-xl">
                  {item.q}
                </span>
                <Plus
                  size={20}
                  className="mt-1 shrink-0 text-[var(--color-fg-muted)] transition-transform duration-300 group-open:rotate-45"
                  aria-hidden
                />
              </summary>
              <p className="mt-4 text-base leading-relaxed text-[var(--color-fg-muted)]">
                {item.a}
              </p>
            </motion.details>
          ))}
        </div>
      </div>
    </section>
  );
}
