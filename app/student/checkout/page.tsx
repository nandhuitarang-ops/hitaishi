import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Check } from "lucide-react";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";
import { profiles, auditLog } from "@/db/schema";
import { Card, CardBody, Pill } from "@/components/ui";
import { PayButton } from "./PayButton";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Checkout — Hitaishi Student",
  robots: "noindex, nofollow",
};

const PLAN = {
  name: "Hitaishi Mentorship",
  price: 14999,
  sessions: 4,
  features: [
    "4 1-on-1 mentor sessions per month",
    "Unlimited doubt clearing",
    "Personalised exam strategy & study plan",
    "Motivation & mental-game support",
    "Progress tracking & honest feedback",
  ],
};

export default async function CheckoutPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [profileRow] = await db
    .select({ onboardingStep: profiles.onboardingStep })
    .from(profiles)
    .where(eq(profiles.userId, user.id))
    .limit(1);

  if (profileRow && (profileRow.onboardingStep ?? 0) < 3) {
    await db
      .update(profiles)
      .set({ onboardingStep: 3 })
      .where(eq(profiles.userId, user.id));

    await db.insert(auditLog).values({
      actorId: user.id,
      action: "onboarding_completed",
      targetType: "profile",
      targetId: user.id,
      metadata: { fullName: user.fullName, email: user.email },
      createdAt: new Date(),
    });
  }

  return (
    <main className="min-h-screen bg-surface text-ink">
      <header className="border-b border-rule bg-surface-card px-6 md:px-10 py-5 flex items-center justify-between">
        <Link href="/" className="font-serif text-xl text-primary-deep">
          Hitaishi
        </Link>
        <div className="meta">CHECKOUT</div>
      </header>

      <div className="max-w-lg mx-auto px-6 py-10">
        <Card>
          <CardBody className="p-6 space-y-6">
            <div>
              <Pill tone="primary">One plan</Pill>
              <h2 className="font-serif text-3xl mt-2">{PLAN.name}</h2>
              <p className="text-sm text-ink-soft mt-1">
                Everything you need to ace JEE.
              </p>
            </div>

            <div className="border-t border-rule pt-4">
              <p className="font-serif text-4xl font-medium">
                ₹{PLAN.price.toLocaleString("en-IN")}
                <span className="ml-1 text-base font-normal text-ink-soft">
                  / month
                </span>
              </p>
            </div>

            <ul className="space-y-3 text-sm">
              {PLAN.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <Check
                    size={18}
                    className="mt-0.5 shrink-0 text-primary"
                    aria-hidden
                  />
                  <span className="leading-relaxed">{f}</span>
                </li>
              ))}
            </ul>

            <div className="rounded-card border border-rule bg-surface p-4 text-sm text-ink-soft">
              <Pill tone="neutral" className="mb-2">
                Payment method
              </Pill>
              <p>Credit / Debit card, UPI, Net Banking</p>
            </div>

            <div className="pt-2">
              <PayButton />
            </div>

            <p className="text-xs text-ink-soft text-center">
              Secure checkout. You can cancel anytime.
            </p>
          </CardBody>
        </Card>
      </div>
    </main>
  );
}
