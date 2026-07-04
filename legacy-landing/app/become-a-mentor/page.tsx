import type { Metadata } from "next";
import { SiteHeader } from "@/components/sections/site-header";
import { SiteFooter } from "@/components/sections/site-footer";
import { PageHero } from "@/components/sections/page-hero";
import { MentorOnboardingForm } from "@/components/forms/mentor-onboarding-form";

export const metadata: Metadata = {
  title: "Become a Mentor — Hitaishi",
  description:
    "Apply to become a Hitaishi mentor. Tell us about your JEE journey, your availability, and how you'd like to give back.",
};

export default function BecomeAMentorPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageHero
          eyebrow="Become a Mentor"
          headline="Apply to become a Hitaishi mentor."
          intro={
            <>
              <p>
                Just a few steps. Tell us about your JEE journey, your availability, and how
                you&apos;d like to give back — and our team will reach out to get you onboarded.
              </p>
              <p className="mt-4 text-sm text-[var(--color-fg-subtle)]">
                It takes about 5 minutes. No payment, no commitment — just the first step toward
                changing a student&apos;s trajectory.
              </p>
            </>
          }
        />
        <section className="bg-[var(--color-background-alt)] py-16 md:py-24">
          <div className="mx-auto max-w-3xl px-6 md:px-12">
            <MentorOnboardingForm />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
