"use client";

import { useState } from "react";
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
  const [duration, setDuration] = useState<"1" | "3" | "6" | "12">("6");

  const plans = {
    starter: {
      name: "Starter",
      badge: null,
      "1": { price: 1299, desc: "No discounts", features: ["4 sessions, 30 min", "1-on-1 mentor", "Chat support", "Monthly reports", "No discounts"] },
      "3": { price: 1169, desc: "Saved Rs 390 (10% Off)", features: ["4 sessions, 30 min", "1-on-1 mentor", "Chat support", "10% discount"] },
      "6": { price: 974, desc: "Save Rs 1,950 (25% Off)", features: ["4 sessions, 30 min", "1-on-1 mentor", "Chat support", "STAR Bonus: Free mock"] },
      "12": { price: 844, desc: "Saved Rs 5,460 (35% Off)", features: ["4 sessions, 30 min", "1-on-1 mentor", "Chat support", "Max savings"] },
    },
    pro: {
      name: "Pro",
      badge: "MOST POPULAR",
      "1": { price: 1799, desc: "No discounts", features: ["4 sessions, 45 min", "1-on-1 mentor", "7-day chat", "Strategy guidance", "No discounts"] },
      "3": { price: 1619, desc: "Saved Rs 540 (10% Off)", features: ["4 sessions, 45 min", "1-on-1 mentor", "7-day chat", "10% discount"] },
      "6": { price: 1349, desc: "Save Rs 2,700 (25% Off)", features: ["4 sessions, 45 min", "1-on-1 mentor", "7-day chat", "STAR Free mentor swap", "STAR Strategy reset"] },
      "12": { price: 1169, desc: "Saved Rs 7,560 (35% Off)", features: ["4 sessions, 45 min", "1-on-1 mentor", "7-day chat", "Max savings"] },
    },
    elite: {
      name: "Elite",
      badge: "TOP IITIAN MENTOR",
      "1": { price: 2499, desc: "No discounts", features: ["5 sessions, 45 min", "Top IITian mentor", "Priority chat", "Weekly reports", "Emergency support"] },
      "3": { price: 2249, desc: "Saved Rs 750 (10% Off)", features: ["5 sessions, 45 min", "Top IITian mentor", "Priority chat", "10% discount"] },
      "6": { price: 1874, desc: "Save Rs 3,750 (25% Off)", features: ["5 sessions, 45 min", "Top IITian mentor", "Priority chat", "STAR Free mentor swap"] },
      "12": { price: 1624, desc: "Saved Rs 10,500 (35% Off)", features: ["5 sessions, 45 min", "Top IITian mentor", "Priority chat", "Max savings"] },
    },
  };

  const getPlan = (key: "starter" | "pro" | "elite") => {
    return {
      name: plans[key].name,
      badge: plans[key].badge,
      ...plans[key][duration],
    };
  };

  const faqs = [
    {
      q: "Can I change my plan later?",
      a: "Yes. You can upgrade anytime, and we will adjust pricing based on months remaining."
    },
    {
      q: "Do I have to pay the full amount upfront?",
      a: "For 6 and 12-month plans, yes. We also offer installment options on request."
    },
    {
      q: "Why is 6 months the most popular?",
      a: "It covers one full semester with 25% savings and exclusive bonuses. Best value for most students."
    },
    {
      q: "What if I am not satisfied?",
      a: "We offer a 15-day money-back guarantee. If unhappy, full refund, no questions asked."
    },
    {
      q: "Can I reschedule sessions?",
      a: "Yes. Reschedule up to 24 hours before a session with no penalty."
    },
    {
      q: "Works for hostel students?",
      a: "Absolutely. All sessions are online and flexible, including evening and weekend slots."
    }
  ];

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen">
        {/* ─────────────────────────────────────────────
            HERO SECTION
        ───────────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-36 pb-12 md:pt-44 md:pb-16">
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
              Pricing Plans
            </motion.span>

            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={1}
              className="font-serif text-4xl font-medium leading-[1.15] tracking-tight text-[var(--color-fg)] sm:text-5xl md:text-6xl"
            >
              All Pricing Plans for JEE Aspirants
              <br />
              <span className="text-aurora">Simple. Flexible. Personal.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={2}
              className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[var(--color-fg-muted)] md:text-lg"
            >
              Every JEE aspirant deserves a mentor who believes in them. Hitaishi pairs you with an IITian or top-ranker who guides you 1-on-1 through the entire journey from Class 11 through JoSAA counselling. Choose the plan that fits your timeline and goals.
            </motion.p>
          </div>
        </section>

        {/* ─────────────────────────────────────────────
            DURATION TOGGLE SELECTOR
        ───────────────────────────────────────────── */}
        <section className="px-6 pb-12 text-center">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-primary-deep)] mb-3">
              Choose Your Plan Duration
            </h2>
            <p className="text-xs text-[var(--color-fg-muted)] max-w-lg mx-auto mb-6">
              All plans include: flexible scheduling, 1-on-1 sessions, chat support, and progress tracking. Select the duration that best fits your JEE journey.
            </p>

            <div className="inline-flex rounded-full bg-surface-elevated/40 p-1 border border-rule/55 backdrop-blur-sm">
              {[
                { key: "1", label: "1 Month", discount: "Full Price" },
                { key: "3", label: "3 Months", discount: "10% OFF" },
                { key: "6", label: "6 Months", discount: "25% OFF · STAR" },
                { key: "12", label: "12 Months", discount: "35% OFF" },
              ].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setDuration(opt.key as any)}
                  className={`relative px-4 py-2 text-xs font-semibold rounded-full transition-all ${
                    duration === opt.key
                      ? "bg-primary-soft text-primary-deep shadow-sm"
                      : "text-ink-soft hover:text-ink"
                  }`}
                >
                  <div>{opt.label}</div>
                  <div className="text-[9px] opacity-75 font-normal">{opt.discount}</div>
                </button>
              ))}
            </div>

            {duration === "6" && (
              <div className="mt-5 inline-block text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-200/60 rounded-full px-4 py-1.5 shadow-sm">
                🔥 <strong>BEST VALUE:</strong> 25% Off + Exclusive 6-Month Bonuses included!
              </div>
            )}
          </div>
        </section>

        {/* ─────────────────────────────────────────────
            PRICING GRID CARDS
        ───────────────────────────────────────────── */}
        <section className="px-6 pb-20 md:pb-28">
          <div className="mx-auto max-w-6xl grid gap-6 md:grid-cols-3">
            {(["starter", "pro", "elite"] as const).map((key) => {
              const plan = getPlan(key);
              const isFeatured = key === "pro";
              return (
                <Reveal
                  key={key}
                  className={`relative overflow-hidden rounded-3xl border bg-[var(--color-surface-solid)] p-1 shadow-[var(--shadow-lift)] transition-all ${
                    isFeatured
                      ? "border-2 border-[var(--color-primary)] ring-4 ring-primary-soft/10 scale-[1.02] z-10"
                      : "border-[var(--color-rule)]"
                  }`}
                >
                  {isFeatured && (
                    <div className="pointer-events-none absolute -inset-1 rounded-[26px] opacity-40 blur-md" style={{ background: "linear-gradient(135deg, var(--color-primary-soft), transparent 60%)" }} />
                  )}

                  <div className="relative rounded-[22px] bg-[var(--color-surface-solid)] p-6 md:p-8 flex flex-col h-full">
                    {/* Badge */}
                    <div className="mb-4 flex justify-between items-center">
                      <span className="text-sm font-bold text-ink uppercase tracking-wider">{plan.name}</span>
                      {plan.badge && (
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[9px] font-bold tracking-wider ${
                          isFeatured ? "bg-[var(--color-primary)] text-white" : "bg-primary-soft text-primary-deep border border-primary/20"
                        }`}>
                          {plan.badge}
                        </span>
                      )}
                    </div>

                    {/* Price */}
                    <div className="my-2">
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-xl font-medium text-[var(--color-fg-muted)]">Rs</span>
                        <span className="font-serif text-4xl font-semibold tracking-tight text-[var(--color-fg)]">
                          {plan.price.toLocaleString()}
                        </span>
                        <span className="text-xs text-[var(--color-fg-muted)] ml-1">/month</span>
                      </div>
                      <p className="mt-1 text-[11px] font-medium text-emerald-600 font-mono">
                        {plan.desc}
                      </p>
                    </div>

                    {/* Divider */}
                    <div className="my-4 h-px bg-[var(--color-rule)]" />

                    {/* Features List */}
                    <div className="space-y-2.5 flex-1 mb-8">
                      {plan.features.map((item) => (
                        <div key={item} className="flex items-start gap-2.5">
                          <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-[var(--color-primary)]" />
                          <span className="text-xs leading-relaxed text-[var(--color-fg)]">{item}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <Link
                      href="/student"
                      className={`inline-flex w-full items-center justify-center gap-1.5 rounded-full px-5 py-3 text-xs font-semibold transition-all ${
                        isFeatured
                          ? "bg-[var(--color-sky)] text-white hover:bg-[var(--color-sky-hover)] hover:shadow-[var(--shadow-neon)]"
                          : "border border-rule-strong hover:bg-surface-elevated/50 text-ink"
                      }`}
                    >
                      Choose Plan <ArrowRight size={13} />
                    </Link>
                  </div>
                </Reveal>
              );
            })}
          </div>

          {/* Exclusive 6-Month Bonuses Banner */}
          {duration === "6" && (
            <Reveal className="mx-auto max-w-4xl mt-12 rounded-2xl border border-[var(--color-primary)]/30 bg-primary-soft/20 p-5 text-center">
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary-deep mb-2">
                🎁 Exclusive 6-Month Bonuses Included
              </h4>
              <p className="text-xs text-ink-soft leading-relaxed">
                <strong>Free Mentor Swap:</strong> Swap your mentor at any point for any reason, no questions asked. <span className="opacity-45 mx-2">•</span> <strong>Mid-Term Strategy Reset (Month 3):</strong> 1-on-1 strategy session to realign targets. <span className="opacity-45 mx-2">•</span> <strong>Free Mock Analysis Session:</strong> Full deep dive review of your first test series results.
              </p>
            </Reveal>
          )}
        </section>

        {/* ─────────────────────────────────────────────
            QUICK COMPARISON TABLE
        ───────────────────────────────────────────── */}
        <section className="px-6 pb-20 md:pb-28 bg-[var(--color-background-alt)] py-16 md:py-24">
          <div className="mx-auto max-w-4xl">
            <Reveal className="mb-12 text-center">
              <span className="pill mb-4 inline-block">Overview</span>
              <h2 className="font-serif text-3xl font-medium tracking-tight text-[var(--color-fg)] md:text-4xl">
                Quick Comparison - All Durations
              </h2>
            </Reveal>

            <div className="overflow-x-auto rounded-2xl border border-rule/55 bg-surface-solid shadow-sm">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-rule/50 bg-surface-elevated/40 uppercase text-[10px] tracking-wider text-ink-soft">
                    <th className="p-4 font-bold">Duration</th>
                    <th className="p-4 font-bold">Starter</th>
                    <th className="p-4 font-bold">Pro</th>
                    <th className="p-4 font-bold">Elite</th>
                    <th className="p-4 font-bold text-center">Discount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rule/35 text-ink">
                  <tr>
                    <td className="p-4 font-medium">1 Month</td>
                    <td className="p-4 font-mono">Rs 1,299</td>
                    <td className="p-4 font-mono">Rs 1,799</td>
                    <td className="p-4 font-mono">Rs 2,499</td>
                    <td className="p-4 text-center text-ink-soft">None</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium">3 Months</td>
                    <td className="p-4 font-mono">Rs 1,169</td>
                    <td className="p-4 font-mono">Rs 1,619</td>
                    <td className="p-4 font-mono">Rs 2,249</td>
                    <td className="p-4 text-center font-medium text-emerald-600 bg-emerald-50/20">10% Off</td>
                  </tr>
                  <tr className="bg-primary-soft/10">
                    <td className="p-4 font-bold flex items-center gap-1.5">
                      <span>6 Months</span>
                      <span className="text-[8px] bg-primary/20 text-primary-deep font-bold px-1.5 py-0.5 rounded">STAR</span>
                    </td>
                    <td className="p-4 font-mono font-semibold text-primary-deep">Rs 974</td>
                    <td className="p-4 font-mono font-semibold text-primary-deep">Rs 1,349</td>
                    <td className="p-4 font-mono font-semibold text-primary-deep">Rs 1,874</td>
                    <td className="p-4 text-center font-bold text-emerald-600 bg-emerald-50/30">25% Off + STAR</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium">12 Months</td>
                    <td className="p-4 font-mono">Rs 844</td>
                    <td className="p-4 font-mono">Rs 1,169</td>
                    <td className="p-4 font-mono">Rs 1,624</td>
                    <td className="p-4 text-center font-medium text-emerald-600">35% Off</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────
            FAQ SECTION
        ───────────────────────────────────────────── */}
        <section className="px-6 pb-20 md:pb-28 py-16 md:py-24">
          <div className="mx-auto max-w-3xl">
            <Reveal className="mb-12 text-center">
              <span className="pill mb-4 inline-block">FAQ</span>
              <h2 className="font-serif text-3xl font-medium tracking-tight text-[var(--color-fg)] md:text-4xl">
                Frequently Asked Questions
              </h2>
            </Reveal>

            <div className="space-y-6">
              {faqs.map((faq, idx) => (
                <Reveal
                  key={faq.q}
                  delay={idx * 85}
                  className="rounded-2xl border border-[var(--color-rule)] bg-[var(--color-surface-solid)] p-5 md:p-6"
                >
                  <h3 className="font-serif text-base font-semibold leading-snug text-[var(--color-fg)]">
                    {faq.q}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[var(--color-fg-muted)]">
                    {faq.a}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
