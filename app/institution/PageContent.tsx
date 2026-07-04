"use client";

import Link from "next/link";
import { SiteHeader } from "@/components/sections/site-header";
import { SiteFooter } from "@/components/sections/site-footer";
import { motion, useInView } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import { useRef } from "react";
import {
  CalendarCheck,
  UserPlus,
  BarChart3,
  Palette,
  TrendingUp,
  Users,
  Award,
  Wifi,
  DollarSign,
  Clock,
  FileText,
  HeadphonesIcon,
  ArrowRight,
  Sparkles,
  GraduationCap,
  Building2,
} from "lucide-react";

/* ─── animation helpers ──────────────────────────────────── */

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: EASE },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

function Section({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.section
      ref={ref}
      id={id}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={stagger}
      className={className}
    >
      {children}
    </motion.section>
  );
}

/* ─── reusable card wrapper ──────────────────────────────── */

function FeatureCard({
  icon,
  title,
  description,
  index,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}) {
  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      className="group relative overflow-hidden rounded-2xl border border-[var(--color-rule)] bg-[var(--color-surface-card)] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-border-hover)] hover:shadow-[var(--shadow-lift)] sm:p-8"
    >
      {/* subtle top accent line */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="mb-4 inline-flex items-center justify-center rounded-xl bg-[var(--color-primary-soft)] p-3 text-[var(--color-primary-deep)]">
        {icon}
      </div>
      <h3 className="font-serif text-lg font-medium text-[var(--color-fg)] sm:text-xl">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-[var(--color-fg-muted)]">
        {description}
      </p>
    </motion.div>
  );
}

function WhyCard({
  icon,
  title,
  description,
  index,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}) {
  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      className="flex gap-4 rounded-xl border border-[var(--color-rule)] bg-[var(--color-surface-card)] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--color-border-hover)] hover:shadow-[var(--shadow-soft)] sm:p-6"
    >
      <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary)] text-white">
        {icon}
      </div>
      <div>
        <h4 className="font-serif text-base font-medium text-[var(--color-fg)]">
          {title}
        </h4>
        <p className="mt-1 text-sm leading-relaxed text-[var(--color-fg-muted)]">
          {description}
        </p>
      </div>
    </motion.div>
  );
}

/* ─── data ──────────────────────────────────────────────── */

const HOW_IT_WORKS = [
  {
    icon: <CalendarCheck size={22} />,
    title: "Flexible Timetable Integration",
    description:
      "We adapt to YOUR schedule — not the other way around. Our mentoring slots fit neatly around your existing class hours.",
  },
  {
    icon: <UserPlus size={22} />,
    title: "Seamless Onboarding",
    description:
      "We handle student sign-ups, mentor matching, and setup — so your team doesn't lift a finger.",
  },
  {
    icon: <BarChart3 size={22} />,
    title: "Progress Dashboard",
    description:
      "Track every student's mentoring sessions, engagement, and growth from a single admin dashboard.",
  },
  {
    icon: <Palette size={22} />,
    title: "Custom Branding",
    description:
      "Your logo, your colours, your identity. Students see your brand — Hitaishi works behind the scenes.",
  },
];

const WHY_PARTNER = [
  {
    icon: <TrendingUp size={20} />,
    title: "Enhance, Don't Replace",
    description:
      "We supplement your coaching with personalised mentorship — your students stay yours.",
  },
  {
    icon: <Users size={20} />,
    title: "Personalised Attention",
    description:
      "Every student gets a dedicated IITian or top-ranker mentor who understands their unique journey.",
  },
  {
    icon: <Award size={20} />,
    title: "Better Results = Better Reputation",
    description:
      "When your students score higher, your institute's reputation rises with them.",
  },
  {
    icon: <Wifi size={20} />,
    title: "Fully Digital — No Infrastructure",
    description:
      "Zero setup. Zero physical space. Everything runs online on a platform we built and maintain.",
  },
  {
    icon: <DollarSign size={20} />,
    title: "Affordable Bulk Pricing",
    description:
      "Institutional plans designed for scale — the more students you enrol, the more you save.",
  },
];

const TIMETABLE = [
  {
    icon: <Clock size={20} />,
    title: "Sync with Your Class Schedule",
    description:
      "We study your timetable and slot mentoring sessions in the gaps — mornings, evenings, or weekends.",
  },
  {
    icon: <GraduationCap size={20} />,
    title: "Sessions Outside Class Hours",
    description:
      "Mentoring never overlaps with your lectures. Students get support when they need it — without conflicts.",
  },
  {
    icon: <FileText size={20} />,
    title: "Weekly Progress Reports",
    description:
      "Admins receive detailed weekly summaries: attendance, session quality, topic coverage, and student feedback.",
  },
  {
    icon: <HeadphonesIcon size={20} />,
    title: "Dedicated Account Manager",
    description:
      "A single point of contact from Hitaishi — available on call, WhatsApp, or email for anything you need.",
  },
];

/* ─── page ──────────────────────────────────────────────── */

export function PageContent() {
  const heroRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { once: true });

  return (
    <>
      <SiteHeader />

      <main className="overflow-hidden">
        {/* ── HERO ────────────────────────────────────────── */}
        <section
          ref={heroRef}
          className="relative flex min-h-[85vh] items-center justify-center px-6 pt-28 pb-20"
        >
          {/* decorative background blobs */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
            <div className="absolute -top-32 -right-40 h-[600px] w-[600px] rounded-full bg-[var(--color-primary-soft)] opacity-40 blur-[120px]" />
            <div className="absolute -bottom-32 -left-40 h-[500px] w-[500px] rounded-full bg-[var(--color-sky-soft)] opacity-30 blur-[100px]" />
            {/* grid pattern */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  "linear-gradient(var(--color-fg) 1px, transparent 1px), linear-gradient(90deg, var(--color-fg) 1px, transparent 1px)",
                backgroundSize: "64px 64px",
              }}
            />
          </div>

          <div className="relative mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={heroInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-rule)] bg-[var(--color-surface-card)] px-4 py-2 text-xs font-medium text-[var(--color-ink-soft)] shadow-[var(--shadow-soft)]"
            >
              <Building2 size={14} className="text-[var(--color-primary)]" />
              For Coaching Institutes &amp; Schools
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="font-serif text-4xl font-medium leading-[1.1] tracking-tight text-[var(--color-fg)] sm:text-5xl md:text-6xl lg:text-7xl"
            >
              Your students deserve more than what a{" "}
              <span className="relative inline-block">
                <span className="text-aurora">classroom alone</span>
                <svg
                  className="absolute -bottom-1 left-0 w-full"
                  viewBox="0 0 300 12"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M2 8 C50 2, 100 10, 150 4 S250 10, 298 6"
                    stroke="var(--color-primary)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    opacity="0.35"
                  />
                </svg>
              </span>{" "}
              can give.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-[var(--color-fg-muted)] sm:text-xl"
            >
              Hitaishi partners with coaching institutes to give every student a
              personal IITian mentor — without disrupting your timetable, your
              brand, or your budget.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <a
                href="#partner"
                className="ripple inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-7 py-3.5 text-sm font-medium text-white shadow-[var(--shadow-neon)] transition-all hover:bg-[var(--color-primary-hover)] hover:shadow-[var(--shadow-glow-accent)]"
              >
                <Sparkles size={16} />
                Partner With Us
                <ArrowRight size={16} />
              </a>
              <a
                href="#how-it-works"
                className="chip-ghost"
              >
                See How It Works
              </a>
            </motion.div>

            {/* trust strip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={heroInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-[var(--color-fg-subtle)]"
            >
              <span className="flex items-center gap-1.5">
                <span className="primary-dot" /> Trusted by institutes across India
              </span>
              <span className="flex items-center gap-1.5">
                <span className="primary-dot" /> 500+ IITian mentors
              </span>
              <span className="flex items-center gap-1.5">
                <span className="primary-dot" /> Fully digital — zero setup
              </span>
            </motion.div>
          </div>
        </section>

        {/* ── HOW IT WORKS ───────────────────────────────── */}
        <Section
          id="how-it-works"
          className="mx-auto max-w-7xl px-6 py-20 sm:py-28"
        >
          <motion.div variants={fadeUp} custom={0} className="max-w-2xl">
            <span className="pill">How It Works</span>
            <h2 className="mt-4 font-serif text-3xl font-medium tracking-tight text-[var(--color-fg)] sm:text-4xl lg:text-5xl">
              How Hitaishi Works with Institutions
            </h2>
            <p className="mt-4 text-base text-[var(--color-fg-muted)] sm:text-lg">
              A plug-and-play mentoring layer that complements your coaching —
              not competes with it.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS.map((item, i) => (
              <FeatureCard key={item.title} {...item} index={i + 1} />
            ))}
          </div>
        </Section>

        {/* ── WHY PARTNER ────────────────────────────────── */}
        <Section
          id="why-partner"
          className="mx-auto max-w-7xl px-6 py-20 sm:py-28"
        >
          <motion.div variants={fadeUp} custom={0} className="max-w-2xl">
            <span className="pill">Why Hitaishi</span>
            <h2 className="mt-4 font-serif text-3xl font-medium tracking-tight text-[var(--color-fg)] sm:text-4xl lg:text-5xl">
              Why Partner with Hitaishi
            </h2>
            <p className="mt-4 text-base text-[var(--color-fg-muted)] sm:text-lg">
              We don't replace your coaching. We make it better — by giving
              every student the one thing a lecture hall can't: personal
              attention.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {WHY_PARTNER.map((item, i) => (
              <WhyCard key={item.title} {...item} index={i + 1} />
            ))}
          </div>
        </Section>

        {/* ── TIMETABLE ──────────────────────────────────── */}
        <Section
          id="timetable"
          className="mx-auto max-w-7xl px-6 py-20 sm:py-28"
        >
          <motion.div variants={fadeUp} custom={0} className="max-w-2xl">
            <span className="pill">Scheduling</span>
            <h2 className="mt-4 font-serif text-3xl font-medium tracking-tight text-[var(--color-fg)] sm:text-4xl lg:text-5xl">
              How We Adapt to Your Timetable
            </h2>
            <p className="mt-4 text-base text-[var(--color-fg-muted)] sm:text-lg">
              Your schedule is sacred. We build around it — so students get
              mentoring without missing a single lecture.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {TIMETABLE.map((item, i) => (
              <FeatureCard key={item.title} {...item} index={i + 1} />
            ))}
          </div>
        </Section>

        {/* ── CTA ────────────────────────────────────────── */}
        <section
          id="partner"
          className="relative overflow-hidden px-6 py-24 sm:py-32"
        >
          {/* green gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary-deep)] via-[var(--color-primary)] to-[var(--color-primary-hover)]" />
          {/* decorative circles */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
            <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full border border-white/10" />
            <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full border border-white/10" />
            <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5" />
          </div>

          <Reveal className="relative mx-auto max-w-3xl text-center">
            <h2 className="font-serif text-3xl font-medium tracking-tight text-white sm:text-4xl lg:text-5xl">
              Ready to give your students the edge?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base text-white/80 sm:text-lg">
              Schedule a quick 15-minute demo. We'll walk you through the
              platform, show you the dashboard, and discuss a plan that fits
              your institute.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/institution-onboarding"
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-medium text-[var(--color-primary-deep)] shadow-lg transition-all hover:bg-white/90 hover:shadow-xl"
              >
                <Sparkles size={16} />
                Schedule a Demo
                <ArrowRight size={16} />
              </Link>
              <a
                href="https://wa.me/919964081555?text=Hi%2C%20I%27m%20interested%20in%20the%20institutional%20partnership%20program."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-3.5 text-sm font-medium text-white transition-all hover:border-white/60 hover:bg-white/10"
              >
                Chat on WhatsApp
              </a>
            </div>

            <p className="mt-8 text-xs text-white/50">
              No commitment required. No credit card needed. Just a conversation.
            </p>
          </Reveal>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
