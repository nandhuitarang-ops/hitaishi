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
      className="relative w-full overflow-hidden bg-[var(--color-background)] pt-20 lg:pt-28 pb-20 lg:pb-32"
    >
      {/* Subtle light theme background ambient glows */}
      <div className="absolute inset-0 pointer-events-none opacity-40" aria-hidden="true">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-[var(--color-sky-soft)] blur-[120px] -translate-y-1/2" />
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] rounded-full bg-[var(--color-surface-elevated)] blur-[130px] translate-x-1/3" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Column — Text & CTAs */}
          <div className="lg:col-span-6 text-left flex flex-col justify-center items-start pb-8 lg:pb-12 z-20 lg:-ml-12">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
              className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)]"
            >
              {HERO.eyebrow}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
              className="mt-6 font-serif text-[clamp(2.8rem,7vw,4.8rem)] font-medium leading-[1.0] tracking-tight text-[var(--color-fg)] uppercase"
            >
              The Mentor<br />
              You Wished<br />
              You Had
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
              className="mt-6 max-w-xl text-base text-[var(--color-fg-muted)] md:text-lg leading-relaxed"
            >
              {HERO.subhead}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6, ease: EASE }}
              className="mt-8 flex flex-wrap gap-4 w-full sm:w-auto"
            >
              <Link
                href={PRIMARY_CTAS.student.href}
                className="inline-flex items-center justify-center rounded-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] px-8 py-4 text-sm font-semibold text-white shadow-md transition-all hover:scale-[1.02]"
              >
                {PRIMARY_CTAS.student.label} <span aria-hidden className="ml-1">→</span>
              </Link>
              <Link
                href={PRIMARY_CTAS.mentor.href}
                className="inline-flex items-center justify-center rounded-full border border-[var(--color-border)] bg-white hover:bg-[var(--color-background-alt)] px-8 py-4 text-sm font-semibold text-[var(--color-fg)] transition-all hover:scale-[1.02]"
              >
                {PRIMARY_CTAS.mentor.label} <span aria-hidden className="ml-1">→</span>
              </Link>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mt-6 text-xs uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]"
            >
              {HERO.trustLine}
            </motion.p>
          </div>

          {/* Right Column — Transparent Student Cutout (Overlapping Bottom Edge) */}
          <div className="lg:col-span-6 relative w-full flex justify-center lg:justify-end items-end h-[350px] sm:h-[450px] lg:h-auto lg:min-h-[500px] z-20">
            {/* Green gradient backlight glow behind the girl */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.85, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.2 }}
              className="absolute bottom-16 right-1/2 translate-x-1/2 w-[520px] h-[520px] lg:w-[600px] lg:h-[600px] rounded-full bg-emerald-500/35 blur-[90px] pointer-events-none z-10"
            />

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.4, ease: EASE }}
              className="relative w-full max-w-[500px] lg:max-w-[540px] aspect-[4/5] z-20 pointer-events-none"
              style={{ marginBottom: "8px" }}
            >
              <Image
                src="/images/hitaishi/hero-student-cutout-transparent.webp"
                alt="JEE Aspirant Student Portrait"
                fill
                sizes="(max-w-px) 100vw, 540px"
                priority
                className="object-cover object-bottom"
              />
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: EASE }}
          className="relative z-10 w-full max-w-[850px] lg:max-w-[980px] ml-auto mr-0 overflow-hidden rounded-2xl shadow-2xl -mt-6 lg:-mt-12 aspect-video bg-neutral-950 pointer-events-none"
          style={{ contentVisibility: "auto" }}
        >
          <video
            src="https://res.cloudinary.com/du61qbbhs/video/upload/v1782905965/Changes_video_color_to__2F7D5C_202607011701_pwspbd.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
}
