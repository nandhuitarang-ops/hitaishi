"use client";

import { SiteHeader } from "@/components/sections/site-header";
import { SiteFooter } from "@/components/sections/site-footer";
import { motion } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import {
  GraduationCap,
  HelpCircle,
  BarChart3,
  Target,
  TrendingUp,
  Shield,
  Heart,
  Clock,
  BookOpen,
  Zap,
  ArrowRight,
  CheckCircle2,
  IndianRupee,
  Users,
  Brain,
} from "lucide-react";
import Link from "next/link";

/* ── Reusable fade-in wrapper ── */
const EASE = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: EASE },
  }),
};

/* ── Feature items for "What You Get" ── */
const features = [
  { icon: GraduationCap, title: "Dedicated IITian Mentor", desc: "1-on-1 with a vetted IITian or JEE top-ranker who's walked the path." },
  { icon: Clock, title: "Weekly Sessions", desc: "Structured, consistent sessions every week — no more aimless prep." },
  { icon: HelpCircle, title: "24/7 Doubt Support", desc: "Stuck at 2 AM before an exam? Your mentor has your back." },
  { icon: BookOpen, title: "Custom Study Plans", desc: "Tailored to your strengths, weaknesses, and coaching schedule." },
  { icon: BarChart3, title: "Mock Test Analysis", desc: "Data-driven review of every mock — find where marks are hiding." },
  { icon: Heart, title: "Mental Health & Motivation", desc: "The JEE grind is brutal. We help you stay grounded and focused." },
];

/* ── Value Breakdown data ── */
const valueBreakdown = [
  { label: "Cost per session", detail: "₹3,750 / session", note: "vs ₹800–1,500/hr for private tutoring" },
  { label: "Cost per week", detail: "₹3,750 / week", note: "less than a pizza date, but for your future" },
  { label: "Coaching fees saved", detail: "₹1,00,000 – ₹3,00,000", note: "vs ₹1–3 lakh for coaching centers" },
  { label: "ROI", detail: "A better JEE rank", note: "better college → better opportunities for life" },
];

/* ── Why it's worth it ── */
const worthPoints = [
  { icon: Target, text: "Personalized 1-on-1 mentorship from IITians who actually care about your journey." },
  { icon: HelpCircle, text: "Unlimited doubt resolution — no more waiting for the next class." },
  { icon: BookOpen, text: "Study plan tailored to your strengths, weaknesses, and coaching schedule." },
  { icon: Target, text: "Exam strategy sessions that teach you how to crack JEE, not just study it." },
  { icon: BarChart3, text: "Progress tracking dashboard — see your growth over weeks and months." },
  { icon: TrendingUp, text: "A fraction of coaching fees for truly personalized guidance." },
];

export function PageContent() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen">
        {/* ─────────────────────────────────────────────
            HERO SECTION
        ───────────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-36 pb-20 md:pt-44 md:pb-28">
          {/* Background glow */}
          <div
            className="pointer-events-none absolute top-0 left-1/2 -z-10 h-[600px] w-[900px] -translate-x-1/2 rounded-full opacity-30 blur-[120px]"
            style={{ background: "var(--color-primary-soft)" }}
          />

          <div className="mx-auto max-w-4xl px-6 text-center">
            <motion.span
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0}
              className="pill mb-6 inline-block"
            >
              Pricing
            </motion.span>

            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={1}
              className="font-serif text-4xl font-medium leading-[1.15] tracking-tight text-[var(--color-fg)] sm:text-5xl md:text-6xl"
            >
              Mentorship that fits your goals
              <br />
              <span className="text-aurora">— and your budget.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={2}
              className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[var(--color-fg-muted)]"
            >
              JEE coaching costs ₹1–3 lakh. Our personalized mentorship delivers more — for a fraction of the price.
            </motion.p>
          </div>
        </section>

        {/* ─────────────────────────────────────────────
            PRICING CARD
        ───────────────────────────────────────────── */}
        <section className="px-6 pb-20 md:pb-28">
          <div className="mx-auto max-w-5xl">
            <Reveal className="relative mx-auto max-w-xl overflow-hidden rounded-3xl border-2 border-[var(--color-primary)] bg-[var(--color-surface-solid)] p-1 shadow-[var(--shadow-lift)]">
              {/* Glow ring */}
              <div className="pointer-events-none absolute -inset-1 rounded-[26px] opacity-40 blur-md" style={{ background: "linear-gradient(135deg, var(--color-primary-soft), transparent 60%)" }} />

              <div className="relative rounded-[22px] bg-[var(--color-surface-solid)] p-8 md:p-10">
                {/* Badge */}
                <div className="mb-6 flex justify-center">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-primary-soft)] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-primary-deep)]">
                    <Zap size={14} className="text-[var(--color-primary)]" />
                    Full Mentorship Plan
                  </span>
                </div>

                {/* Price */}
                <div className="text-center">
                  <p className="text-sm text-[var(--color-fg-muted)]">One-time investment for</p>
                  <div className="mt-2 flex items-baseline justify-center gap-1">
                    <IndianRupee size={28} className="text-[var(--color-primary)]" />
                    <span className="font-serif text-6xl font-medium tracking-tight text-[var(--color-fg)] md:text-7xl">
                      14,999
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-[var(--color-fg-muted)]">inclusive of all taxes</p>
                </div>

                {/* Divider */}
                <div className="my-8 h-px bg-[var(--color-rule)]" />

                {/* What's included */}
                <div className="space-y-3">
                  {[
                    "Personalized 1-on-1 mentorship from IITians",
                    "Unlimited doubt resolution",
                    "Custom study plan — strengths & weaknesses",
                    "Exam strategy & mock test analysis",
                    "Progress tracking dashboard",
                    "Weekly structured sessions",
                    "24/7 doubt support via chat",
                    "Mental health & motivation support",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[var(--color-primary)]" />
                      <span className="text-sm leading-relaxed text-[var(--color-fg)]">{item}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Link
                  href="/student"
                  className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-sky)] px-6 py-3.5 text-sm font-medium text-white transition-all hover:bg-[var(--color-sky-hover)] hover:shadow-[var(--shadow-neon)]"
                >
                  Get Started — ₹14,999 <ArrowRight size={16} />
                </Link>

          <p className="mt-4 text-center text-xs text-[var(--color-fg-subtle)]">
              Month-to-month. Upgrade, downgrade, or cancel anytime.
            </p>
          </div>
            </Reveal>
          </div>
        </section>

        {/* ─────────────────────────────────────────────
            WHY IT'S WORTH IT
        ───────────────────────────────────────────── */}
        <section className="px-6 pb-20 md:pb-28">
          <div className="mx-auto max-w-5xl">
            <Reveal className="mb-12 text-center">
              <span className="pill mb-4 inline-block">Why it's worth it</span>
              <h2 className="font-serif text-3xl font-medium tracking-tight text-[var(--color-fg)] md:text-4xl">
                ₹14,999 for the edge that changes everything
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-[var(--color-fg-muted)]">
                Coaching gives you the syllabus. This gives you the <em className="font-serif italic">strategy</em>.
              </p>
            </Reveal>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {worthPoints.map((point, i) => {
                const Icon = point.icon;
                return (
                  <Reveal
                    key={point.text}
                    delay={i * 100}
                    className="flex items-start gap-4 rounded-xl border border-[var(--color-rule)] bg-[var(--color-surface-solid)] p-5 transition-all hover:border-[var(--color-border-hover)] hover:shadow-[var(--shadow-lift)]"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary-soft)]">
                      <Icon size={20} className="text-[var(--color-primary)]" />
                    </div>
                    <p className="text-sm leading-relaxed text-[var(--color-fg)]">{point.text}</p>
                  </Reveal>
                );
              })}
            </div>

            {/* Coaching comparison callout */}
            <Reveal className="mt-10 rounded-2xl border border-[var(--color-rule-strong)] bg-gradient-to-br from-[var(--color-primary-soft)]/40 to-transparent p-6 md:p-8">
              <div className="flex flex-col items-center gap-6 md:flex-row">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-primary)] text-white">
                  <Shield size={28} />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-medium text-[var(--color-fg)]">
                    Coaching costs ₹1–3 lakh. We deliver personalized guidance for a fraction.
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-fg-muted)]">
                    Coaching centers give you a classroom of 50+. Hitaishi gives you a mentor who knows your name, your strengths, and where you're stuck — for less than 10% of what you'd pay for a coaching seat.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ─────────────────────────────────────────────
            WHAT YOU GET
        ───────────────────────────────────────────── */}
        <section className="px-6 pb-20 md:pb-28">
          <div className="mx-auto max-w-5xl">
            <Reveal className="mb-12 text-center">
              <span className="pill mb-4 inline-block">What you get</span>
              <h2 className="font-serif text-3xl font-medium tracking-tight text-[var(--color-fg)] md:text-4xl">
                Everything you need to crack JEE
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-[var(--color-fg-muted)]">
                Not just sessions. A complete support system designed around you.
              </p>
            </Reveal>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <Reveal
                    key={feature.title}
                    delay={i * 100}
                    className="group rounded-2xl border border-[var(--color-rule)] bg-[var(--color-surface-solid)] p-6 transition-all duration-300 hover:border-[var(--color-border-hover)] hover:shadow-[var(--shadow-lift)]"
                  >
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-primary-soft)] transition-colors group-hover:bg-[var(--color-primary)]">
                      <Icon size={22} className="text-[var(--color-primary)] transition-colors group-hover:text-white" />
                    </div>
                    <h3 className="font-serif text-lg font-medium text-[var(--color-fg)]">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--color-fg-muted)]">{feature.desc}</p>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────
            VALUE BREAKDOWN
        ───────────────────────────────────────────── */}
        <section className="px-6 pb-20 md:pb-28">
          <div className="mx-auto max-w-3xl">
            <Reveal className="mb-12 text-center">
              <span className="pill mb-4 inline-block">Value breakdown</span>
              <h2 className="font-serif text-3xl font-medium tracking-tight text-[var(--color-fg)] md:text-4xl">
                Let's do the math
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-[var(--color-fg-muted)]">
                ₹14,999 isn't an expense — it's the highest-ROI investment in your JEE prep.
              </p>
            </Reveal>

            <div className="overflow-hidden rounded-2xl border border-[var(--color-rule)] bg-[var(--color-surface-solid)]">
              {valueBreakdown.map((item, i) => (
                <Reveal
                  key={item.label}
                  delay={i * 100}
                  className={`flex flex-col gap-2 p-6 md:flex-row md:items-center md:justify-between ${
                    i !== valueBreakdown.length - 1 ? "border-b border-[var(--color-rule)]" : ""
                  }`}
                >
                  <div>
                    <p className="text-sm font-medium text-[var(--color-fg)]">{item.label}</p>
                    <p className="text-xs text-[var(--color-fg-subtle)]">{item.note}</p>
                  </div>
                  <p className="font-serif text-xl font-medium text-[var(--color-primary)]">{item.detail}</p>
                </Reveal>
              ))}
            </div>

            {/* ROI callout */}
            <Reveal className="mt-8 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-deep)] p-8 text-center text-white">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/15">
                <TrendingUp size={28} className="text-white" />
              </div>
              <h3 className="font-serif text-2xl font-medium">The real ROI</h3>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/80">
                A better JEE rank means a better college — which means better opportunities, placements, and networks for the rest of your life. ₹14,999 today could shape your next 40 years.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ─────────────────────────────────────────────
            CTA SECTION
        ───────────────────────────────────────────── */}
        <section className="px-6 pb-20 md:pb-28">
          <Reveal className="mx-auto max-w-3xl rounded-3xl border border-[var(--color-rule)] bg-[var(--color-surface-solid)] p-10 text-center shadow-[var(--shadow-lift)] md:p-14">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-primary-soft)]">
              <Brain size={28} className="text-[var(--color-primary)]" />
            </div>
            <h2 className="font-serif text-3xl font-medium tracking-tight text-[var(--color-fg)] md:text-4xl">
              Ready to invest in yourself?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-[var(--color-fg-muted)]">
              ₹14,999. One plan. Everything included. The mentorship that could change your JEE outcome — and your future.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/student"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--color-sky)] px-8 py-3.5 text-sm font-medium text-white transition-all hover:bg-[var(--color-sky-hover)] hover:shadow-[var(--shadow-neon)]"
              >
                Get Started — ₹14,999 <ArrowRight size={16} />
              </Link>
              <Link
                href="/#faq"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--color-rule-strong)] px-7 py-3 text-sm font-medium text-[var(--color-fg-muted)] transition-colors hover:bg-[var(--color-surface-hover)]"
              >
                Have questions? Read the FAQ
              </Link>
            </div>
          </Reveal>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
