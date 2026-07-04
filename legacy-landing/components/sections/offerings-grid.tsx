"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export interface OfferingItem {
  title: string;
  body: string;
  image?: string;
  imageAlt?: string;
}

interface OfferingsGridProps {
  items: ReadonlyArray<OfferingItem>;
}

export function OfferingsGrid({ items }: OfferingsGridProps) {
  return (
    <section className="bg-[var(--color-background-alt)] py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-20">
        <div className="grid gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {items.map((item, i) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-solid)]"
            >
              {item.image && (
                <div className="relative aspect-[3/2] w-full overflow-hidden bg-[var(--color-surface-hover)]">
                  <Image
                    src={item.image}
                    alt={item.imageAlt ?? item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col p-7 md:p-8">
                <h3 className="font-serif text-xl font-medium leading-snug text-[var(--color-fg)] md:text-2xl">
                  {item.title}
                </h3>
                <p className="mt-4 text-base leading-relaxed text-[var(--color-fg-muted)]">
                  {item.body}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
