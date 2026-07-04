"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import { SiteHeader } from "@/components/sections/site-header";
import { SiteFooter } from "@/components/sections/site-footer";
import { STUDENTS_PAGE } from "@/lib/content/students";

/* ─── animation constants ─── */
const EASE = [0.22, 1, 0.36, 1] as const;
const STAGGER = 0.08;

/* ─── data ─── */
const LEARN_ITEMS = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
        <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
    title: "Personalised Study Strategies",
    body: "Not a generic timetable — a plan built around your coaching schedule, your weak chapters, and your real-life energy cycles.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
        <path d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
      </svg>
    ),
    title: "Doubt Resolution Anytime",
    body: "Stuck on a concept at 11 PM? Your mentor — someone who topped JEE — clears it like a friend would, not a textbook.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
        <path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Exam Temperament & Time Management",
    body: "Learn how to stay calm under pressure, allocate time smartly across sections, and avoid the silly mistakes that cost marks.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
        <path d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
      </svg>
    ),
    title: "Subject-Specific Guidance from IITians",
    body: "Whether it's Organic Chemistry tricks or Calculus intuition — get insights that only someone who's been through the same syllabus can share.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
        <path d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    title: "Real-Time Progress Tracking",
    body: "Your mentor tracks where you started, where you are, and where you need to be — with honest feedback, not empty encouragement.",
  },
];

const WHY_HITAISHI = [
  {
    number: "01",
    title: "Mentors Who've Cracked JEE Themselves",
    body: "Every mentor is either an IITian or a top JEE ranker. They didn't read about the exam — they lived it. That's the difference between advice and guidance.",
  },
  {
    number: "02",
    title: "Flexible Scheduling Around Coaching",
    body: "Morning batch, evening coaching, or self-study mode — your mentor works on your timeline. Sessions happen when you're ready, not when a batch starts.",
  },
  {
    number: "03",
    title: "Works Alongside Any Coaching Institute",
    body: "Hitaishi doesn't replace your coaching — it fills the gaps coaching can't. Think of it as a personal advisor who coordinates with your existing prep.",
  },
  {
    number: "04",
    title: "Affordable & Transparent Pricing",
    body: "No hidden fees. No lock-in contracts. Plans that scale with how much support you actually need — start small, upgrade anytime.",
  },
];

/* ─── page ─── */
export function PageContent() {
  return (
    <>
      <SiteHeader />
      <main>
        {/* ── HERO ── */}
        <StudentHero />

        {/* ── WHAT YOU'LL LEARN ── */}
        <LearnSection />

        {/* ── PULL QUOTE ── */}
        <QuoteStrip />

        {/* ── WHY HITAISHI ── */}
        <WhySection />

        {/* ── CTA ── */}
        <CtaBanner />
      </main>
      <SiteFooter />
    </>
  );
}

/* ================================================================
   HERO
   ================================================================ */
function StudentHero() {
  return (
    <section className="relative overflow-hidden bg-[var(--color-primary-deep)] pb-24 pt-40 md:pb-32 md:pt-48">
      {/* decorative grid dots */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--color-on-primary) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      {/* glow orb */}
      <div
        className="pointer-events-none absolute -right-32 top-0 h-[520px] w-[520px] rounded-full opacity-30 blur-[100px]"
        style={{ background: "radial-gradient(circle, var(--color-primary) 0%, transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-4xl px-6 text-center md:px-12">
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-primary-soft)] backdrop-blur-sm"
        >
          {STUDENTS_PAGE.eyebrow}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.12, ease: EASE }}
          className="mt-7 font-serif text-[clamp(2.4rem,6vw,4.5rem)] font-medium leading-[1.05] tracking-tight text-white md:mt-9"
        >
          {STUDENTS_PAGE.headline}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.28, ease: EASE }}
          className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/80 md:mt-8 md:text-lg"
        >
          {STUDENTS_PAGE.intro}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.42, ease: EASE }}
          className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center md:mt-12"
        >
          <Link
            href="#get-mentor"
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-medium text-[var(--color-primary-deep)] shadow-lg transition-all hover:scale-[1.02] hover:bg-white/90"
          >
            Get Your Mentor <span aria-hidden>→</span>
          </Link>
          <Link
            href="#learn"
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-white/30 px-7 py-3.5 text-sm font-medium text-white backdrop-blur-sm transition-all hover:scale-[1.02] hover:bg-white/10"
          >
            See What You&apos;ll Learn
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ================================================================
   LEARN — "What You'll Learn" Section
   ================================================================ */
function LearnSection() {
  return (
    <section id="learn" className="bg-[var(--color-background)] py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-20">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <Reveal
            as="p"
            className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-sky)]"
          >
            What You&apos;ll Learn
          </Reveal>
          <Reveal
            as="h2"
            delay={80}
            className="mt-5 font-serif text-[clamp(1.8rem,4vw,3rem)] font-medium leading-tight tracking-tight text-[var(--color-fg)]"
          >
            The skills that separate good JEE scores from great ones.
          </Reveal>
        </div>

        {/* Items grid */}
        <div className="mt-16 grid gap-5 md:mt-20 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {LEARN_ITEMS.map((item, i) => (
            <Reveal
              key={item.title}
              delay={i * 80}
              className="group relative flex flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-solid)] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-sky)]/40 hover:shadow-[var(--shadow-lift)] md:p-8"
            >
              {/* icon */}
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-primary-soft)] text-[var(--color-primary)] transition-colors group-hover:bg-[var(--color-primary)] group-hover:text-white">
                {item.icon}
              </div>
              <h3 className="font-serif text-lg font-medium leading-snug text-[var(--color-fg)] md:text-xl">
                {item.title}
              </h3>
              <p className="mt-3 flex-1 text-[0.9rem] leading-relaxed text-[var(--color-fg-muted)]">
                {item.body}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   PULL QUOTE
   ================================================================ */
function QuoteStrip() {
  return (
    <section className="bg-[var(--color-background-alt)] py-20 md:py-28">
      <Reveal
        as="blockquote"
        className="mx-auto max-w-3xl px-6 text-center md:px-12"
      >
        <div className="mx-auto mb-6 h-10 w-1 rounded-full bg-[var(--color-primary)]" />
        <p className="font-serif text-2xl italic leading-snug text-[var(--color-fg)] md:text-3xl lg:text-[2.25rem] lg:leading-[1.25]">
          &ldquo;{STUDENTS_PAGE.pullQuote}&rdquo;
        </p>
      </Reveal>
    </section>
  );
}

/* ================================================================
   WHY HITAISHI
   ================================================================ */
function WhySection() {
  return (
    <section className="bg-[var(--color-background)] py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-20">
        {/* Two-column layout */}
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
          {/* Left: sticky heading */}
          <div className="lg:sticky lg:top-28">
            <Reveal
              as="p"
              className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-sky)]"
            >
              Why Hitaishi
            </Reveal>
            <Reveal
              as="h2"
              delay={80}
              className="mt-5 font-serif text-[clamp(2rem,4vw,3.25rem)] font-medium leading-[1.08] tracking-tight text-[var(--color-fg)]"
            >
              Built for how students actually prepare.
            </Reveal>
            <Reveal
              as="p"
              delay={180}
              className="mt-5 max-w-md text-base leading-relaxed text-[var(--color-fg-muted)]"
            >
              JEE prep isn&apos;t one-size-fits-all. Hitaishi adapts to your schedule, your
              coaching, your pace — so mentorship fits into your life, not the other way around.
            </Reveal>
          </div>

          {/* Right: numbered list */}
          <div className="space-y-0">
            {WHY_HITAISHI.map((item, i) => (
              <Reveal
                key={item.number}
                delay={i * 100}
                className="group relative border-t border-[var(--color-border)] py-8 transition-colors hover:border-[var(--color-sky)]/40 md:py-10"
              >
                <div className="flex items-start gap-6">
                  <span className="font-mono text-sm font-medium text-[var(--color-sky)] opacity-60 transition-opacity group-hover:opacity-100">
                    {item.number}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-serif text-xl font-medium leading-snug text-[var(--color-fg)] md:text-2xl">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-[0.9rem] leading-relaxed text-[var(--color-fg-muted)]">
                      {item.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
            {/* closing border */}
            <div className="border-t border-[var(--color-border)]" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   CTA BANNER
   ================================================================ */
function CtaBanner() {
  return (
    <section id="get-mentor" className="relative overflow-hidden bg-[var(--color-background-alt)] py-28 md:py-36">
      {/* decorative glow */}
      <div
        className="pointer-events-none absolute -left-20 bottom-0 h-[400px] w-[400px] rounded-full opacity-30 blur-[80px]"
        style={{ background: "radial-gradient(circle, var(--color-sky-soft) 0%, transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-4xl px-6 text-center md:px-12">
        <Reveal
          as="p"
          className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-sky)]"
        >
          Get Started
        </Reveal>

        <Reveal
          as="h2"
          delay={80}
          className="mt-5 font-serif text-[clamp(2rem,5vw,3.5rem)] font-medium leading-[1.08] tracking-tight text-[var(--color-fg)]"
        >
          {STUDENTS_PAGE.formHeadline}
        </Reveal>

        <Reveal
          as="p"
          delay={180}
          className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[var(--color-fg-muted)] md:text-lg"
        >
          {STUDENTS_PAGE.formSubhead}
        </Reveal>

        <Reveal
          delay={300}
          className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center md:mt-12"
        >
          <Link
            href="/student-onboarding"
            className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-[var(--color-sky)] px-8 py-3.5 text-sm font-medium text-white shadow-lg shadow-green-900/20 transition-all hover:scale-[1.02] hover:bg-[var(--color-sky-hover)]"
          >
            Sign Up & Get Matched <span aria-hidden>→</span>
          </Link>
          <Link
            href="/#pricing"
            className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full border border-[var(--color-rule-strong)] px-8 py-3.5 text-sm font-medium text-[var(--color-fg)] transition-all hover:scale-[1.02] hover:bg-[var(--color-surface-hover)]"
          >
            View Plans & Pricing
          </Link>
        </Reveal>

        <Reveal
          as="p"
          animation="fade-in"
          delay={450}
          className="mt-6 text-xs text-[var(--color-fg-subtle)]"
        >
          No commitment required · Matched within 48 hours · Cancel anytime
        </Reveal>
      </div>
    </section>
  );
}
