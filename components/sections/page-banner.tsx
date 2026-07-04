"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Reveal } from "@/components/Reveal";

interface PageBannerProps {
  src: string;
  alt: string;
  priority?: boolean;
}

export function PageBanner({ src, alt, priority = false }: PageBannerProps) {
  return (
    <section className="bg-[var(--color-background)] pb-12 md:pb-16">
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-20">
        <Reveal
          animation="fade-up"
          className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[var(--color-surface-hover)] shadow-[var(--shadow-lift)] sm:aspect-[16/9] sm:rounded-3xl md:aspect-[16/7]"
        >
          <motion.div
            className="absolute inset-0"
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src={src}
              alt={alt}
              fill
              priority={priority}
              quality={90}
              sizes="(max-width: 1024px) 100vw, 1280px"
              className="object-cover object-center"
            />
          </motion.div>
          {/* Soft sky-tinted gradient at bottom for atmosphere */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
            style={{
              background:
                "linear-gradient(0deg, rgba(47,125,92,0.15) 0%, transparent 100%)",
            }}
          />
        </Reveal>
      </div>
    </section>
  );
}
