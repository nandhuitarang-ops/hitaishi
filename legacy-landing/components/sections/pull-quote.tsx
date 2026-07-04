"use client";

import { motion } from "framer-motion";

interface PullQuoteProps {
  text: string;
}

export function PullQuote({ text }: PullQuoteProps) {
  return (
    <section className="bg-[var(--color-background)] py-20 md:py-28">
      <motion.blockquote
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-4xl px-6 text-center md:px-12"
      >
        <p className="font-serif text-2xl italic leading-snug text-[var(--color-fg)] md:text-3xl lg:text-[2.5rem] lg:leading-[1.2]">
          &ldquo;{text}&rdquo;
        </p>
      </motion.blockquote>
    </section>
  );
}
