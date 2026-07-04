import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/sections/site-header";
import { SiteFooter } from "@/components/sections/site-footer";
import { PageHero } from "@/components/sections/page-hero";
import { PlanCard } from "@/components/pricing/plan-card";
import {
  STUDENT_PLANS,
  FINE_PRINT,
  INSTITUTIONAL_PRICING,
  PRICING_FAQ,
  GST_TREATMENT,
} from "@/lib/content/pricing";
import { PRIMARY_CTAS } from "@/lib/content/brand";

export const metadata: Metadata = {
  title: "Pricing — Hitaishi",
  description:
    "Simple, honest pricing for serious JEE aspirants. Pay only for the mentorship you need. Custom partnership pricing for coaching institutions.",
};

export default function PricingPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageHero
          eyebrow="Pricing"
          headline="Simple, honest pricing for serious aspirants."
          intro={
            <>
              <p>
                Hitaishi is built to be accessible. Pay only for the mentorship you need — no
                hidden fees, no long lock-ins, and the freedom to upgrade, pause, or cancel
                anytime.
              </p>
              <p className="mt-4 text-sm uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">
                No registration fee · Cancel anytime · Same vetted IITian &amp; top-ranker mentors on every plan
              </p>
            </>
          }
        />

        <section className="bg-[var(--color-background-alt)] py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-20">
            <div className="grid gap-6 md:grid-cols-3 md:gap-8">
              {STUDENT_PLANS.map((plan) => (
                <PlanCard key={plan.id} plan={plan} />
              ))}
            </div>

            <ul className="mx-auto mt-12 max-w-3xl space-y-2 text-sm text-[var(--color-fg-muted)]">
              {FINE_PRINT.map((line) => (
                <li key={line}>— {line}</li>
              ))}
              <li>— {GST_TREATMENT ?? "[GST treatment — pending]"}</li>
            </ul>
          </div>
        </section>

        <section className="bg-[var(--color-background)] py-24 md:py-32">
          <div className="mx-auto grid max-w-6xl items-start gap-10 px-6 md:grid-cols-[1fr_1fr] md:gap-16 md:px-12">
            <div>
              <h2 className="font-serif text-3xl font-medium leading-tight text-[var(--color-fg)] md:text-4xl">
                {INSTITUTIONAL_PRICING.headline}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[var(--color-fg-muted)] md:text-lg">
                {INSTITUTIONAL_PRICING.body}
              </p>
              <ul className="mt-6 space-y-3 text-base text-[var(--color-fg)]">
                {INSTITUTIONAL_PRICING.highlights.map((h) => (
                  <li key={h}>— {h}</li>
                ))}
              </ul>
              <Link
                href={PRIMARY_CTAS.institution.href}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--color-sky)] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--color-sky-hover)]"
              >
                {PRIMARY_CTAS.institution.label} →
              </Link>
            </div>
            <div className="rounded-2xl border border-[var(--color-sky)]/30 bg-[var(--color-sky-soft)]/40 p-8 md:p-10">
              <p className="font-serif text-xl font-medium text-[var(--color-fg)]">
                Early partner benefit
              </p>
              <p className="mt-4 text-base leading-relaxed text-[var(--color-fg-muted)]">
                {INSTITUTIONAL_PRICING.earlyPartnerNote}
              </p>
            </div>
          </div>
        </section>

        <section className="bg-[var(--color-background-alt)] py-24 md:py-32">
          <div className="mx-auto max-w-4xl px-6 md:px-12">
            <p className="text-center font-serif text-lg italic text-[var(--color-fg-muted)]">
              Mentors don&apos;t pay — mentors earn. See{" "}
              <Link href="/mentors" className="text-[var(--color-sky-hover)] underline-offset-4 hover:underline">
                Mentors
              </Link>{" "}
              for how our fixed monthly payout works.
            </p>
          </div>
        </section>

        <section className="bg-[var(--color-background)] py-24 md:py-32">
          <div className="mx-auto max-w-4xl px-6 md:px-12">
            <h2 className="font-serif text-3xl font-medium leading-tight text-[var(--color-fg)] md:text-4xl">
              Pricing FAQ
            </h2>
            <div className="mt-10 space-y-3">
              {PRICING_FAQ.map((item) => (
                <details
                  key={item.q}
                  className="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-solid)] px-6 py-5 md:px-8 md:py-6"
                >
                  <summary className="cursor-pointer list-none font-serif text-lg font-medium leading-snug text-[var(--color-fg)] md:text-xl">
                    {item.q}
                  </summary>
                  <p className="mt-3 text-base leading-relaxed text-[var(--color-fg-muted)]">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
