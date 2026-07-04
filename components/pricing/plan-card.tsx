"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import type { Plan } from "@/lib/content/pricing";
import { PRIMARY_CTAS } from "@/lib/content/brand";

interface PlanCardProps {
  plan: Plan;
}

export function PlanCard({ plan }: PlanCardProps) {
  const isPopular = Boolean(plan.mostPopular);

  return (
    <article
      className={`relative flex flex-col rounded-2xl border bg-[var(--color-surface-solid)] p-8 md:p-10 ${
        isPopular
          ? "border-[var(--color-sky)]/60 shadow-[var(--shadow-lift)]"
          : "border-[var(--color-border)]"
      }`}
    >
      {isPopular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--color-sky)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
          Most popular
        </span>
      )}
      <h3 className="font-serif text-2xl font-medium text-[var(--color-fg)]">{plan.name}</h3>
      <p className="mt-2 text-sm text-[var(--color-fg-muted)]">Best for: {plan.bestFor}</p>

      <div className="mt-6">
        {plan.priceMonthly === null ? (
          <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
            Pricing — coming soon
          </span>
        ) : (
          <p className="font-serif text-4xl font-medium text-[var(--color-fg)]">
            ₹{plan.priceMonthly.toLocaleString("en-IN")}
            <span className="ml-1 text-base font-normal text-[var(--color-fg-muted)]">/ month</span>
          </p>
        )}
      </div>

      <ul className="mt-6 space-y-3 text-sm text-[var(--color-fg)]">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5">
            <Check size={18} className="mt-0.5 shrink-0 text-[var(--color-sky)]" aria-hidden />
            <span className="leading-relaxed">{f}</span>
          </li>
        ))}
      </ul>

      <Link
        href={PRIMARY_CTAS.student.href}
        className={`mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors ${
          isPopular
            ? "bg-[var(--color-sky)] text-white hover:bg-[var(--color-sky-hover)]"
            : "border border-[var(--color-border)] text-[var(--color-fg)] hover:bg-[var(--color-surface-hover)]"
        }`}
      >
        Get Your Mentor →
      </Link>
    </article>
  );
}
