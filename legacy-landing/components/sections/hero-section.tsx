"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { HERO } from "@/lib/content/hero";
import { BRAND, PRIMARY_CTAS } from "@/lib/content/brand";

const EASE = [0.22, 1, 0.36, 1] as const;
const wordmark = "hitaishi".split("");
const TEXT_SHADOW =
  "0 2px 28px rgba(0,0,0,0.75), 0 1px 6px rgba(0,0,0,0.65), 0 0 32px rgba(0,0,0,0.45)";

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-[640px] min-h-[100svh] w-full overflow-hidden bg-black"
    >
      {/* Single static background image with zoom-out + continuous Ken Burns */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.25 }}
        animate={{ scale: [1.25, 1.0, 1.06, 1.0] }}
        transition={{
          duration: 24,
          times: [0, 0.16, 0.6, 1],
          ease: ["easeOut", "easeInOut", "easeInOut"],
          repeat: Infinity,
          repeatType: "reverse",
        }}
      >
        <Image
          src={HERO.image.src}
          alt={HERO.image.alt}
          fill
          priority
          quality={90}
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>

      {/* Focused centered scrim — only as dark as text legibility needs.
          Combined with the per-element text-shadow this keeps the image clearly visible. */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "radial-gradient(ellipse 65% 45% at center, rgba(5,11,24,0.5) 0%, rgba(5,11,24,0.25) 55%, rgba(5,11,24,0) 100%)",
        }}
      />
      {/* Soft top + bottom edge gradients so the header dock and scroll cue
          have something to read against — kept light. */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-32"
        style={{
          background:
            "linear-gradient(180deg, rgba(5,11,24,0.4) 0%, rgba(5,11,24,0) 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-32"
        style={{
          background:
            "linear-gradient(0deg, rgba(5,11,24,0.4) 0%, rgba(5,11,24,0) 100%)",
        }}
      />

      {/* Brand reveal */}
      <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
          className="max-w-[20rem] text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-300 md:max-w-none md:text-xs md:tracking-[0.42em]"
          style={{ textShadow: TEXT_SHADOW }}
        >
          {HERO.eyebrow}
        </motion.p>

        <h1
          className="mt-7 font-serif text-[clamp(3.5rem,11vw,9rem)] font-medium leading-[0.95] tracking-tight text-white md:mt-9"
          style={{ textShadow: TEXT_SHADOW }}
        >
          {wordmark.map((c, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0.6, y: 14, filter: "blur(8px)" }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                duration: 0.9,
                delay: 1.2 + i * 0.07,
                ease: EASE,
              }}
              className="inline-block"
            >
              {c}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 14, letterSpacing: "0.08em" }}
          animate={{ opacity: 1, y: 0, letterSpacing: "var(--tagline-tracking)" }}
          transition={{ duration: 1.0, delay: 2.0, ease: EASE }}
          className="mt-7 max-w-[22rem] text-[11px] font-medium uppercase text-sky-100 md:mt-9 md:max-w-none md:text-sm"
          style={
            {
              textShadow: TEXT_SHADOW,
              ["--tagline-tracking" as string]: "0.18em",
            } as React.CSSProperties
          }
        >
          {BRAND.tagline}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.4, ease: EASE }}
          className="mx-auto mt-9 max-w-2xl font-serif text-base italic leading-relaxed text-white/90 md:mt-12 md:text-xl"
          style={{ textShadow: TEXT_SHADOW }}
        >
          &ldquo;{HERO.headline}&rdquo;
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 2.7, ease: EASE }}
          className="pointer-events-auto mt-9 flex w-full max-w-md flex-col items-stretch gap-3 md:mt-12 md:w-auto md:max-w-none md:flex-row md:items-center md:justify-center"
        >
          <Link
            href={PRIMARY_CTAS.student.href}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-sky)] px-7 py-3.5 text-sm font-medium text-white shadow-lg shadow-sky-900/40 transition-all hover:scale-[1.02] hover:bg-[var(--color-sky-hover)]"
          >
            {PRIMARY_CTAS.student.label} <span aria-hidden>→</span>
          </Link>
          <Link
            href={PRIMARY_CTAS.mentor.href}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 bg-white/10 px-7 py-3.5 text-sm font-medium text-white backdrop-blur-md transition-all hover:scale-[1.02] hover:bg-white/20"
          >
            {PRIMARY_CTAS.mentor.label} <span aria-hidden>→</span>
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 3.0 }}
          className="mt-7 max-w-xs text-[10px] uppercase tracking-[0.14em] text-white/65 md:max-w-xl md:text-xs md:tracking-[0.22em]"
          style={{ textShadow: TEXT_SHADOW }}
        >
          {HERO.trustLine}
        </motion.p>
      </div>

      {/* Scroll cue — hidden on small phones where it collides with hero content */}
      <motion.div
        className="pointer-events-none absolute bottom-6 left-1/2 z-20 hidden -translate-x-1/2 sm:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0.4] }}
        transition={{ duration: 2.5, delay: 3.5, repeat: Infinity, repeatDelay: 0.5 }}
      >
        <div className="flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/70">
          <span>Scroll</span>
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden
          >
            ↓
          </motion.span>
        </div>
      </motion.div>
    </section>
  );
}
