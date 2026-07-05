import Link from "next/link";
import { SiteFooter } from "@/components/sections/site-footer";
import { InstitutionOnboardingClient } from "./InstitutionOnboardingClient";

export const metadata = {
  title: "Partner Institution Onboarding — Hitaishi",
  description: "Register your institution with Hitaishi to offer premium, personalized JEE mentorship.",
};

export default function InstitutionOnboardingPage() {
  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-rule/40 w-full">
        <div className="max-w-3xl mx-auto px-5 py-3.5 flex items-center justify-between">
          <Link href="/" className="text-xs font-medium text-ink-soft hover:text-ink transition-colors flex items-center gap-1">
            ← Back to site
          </Link>
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-soft/75">
            Institution Onboarding
          </span>
        </div>
      </header>
      <main className="min-h-screen bg-surface text-ink relative overflow-hidden flex flex-col justify-between pt-8 pb-12">
        {/* Dynamic Glowing Accent Background Lights */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
          <div className="absolute -top-[250px] -left-[250px] w-[700px] h-[700px] rounded-full bg-[var(--color-primary)]/10 blur-[130px]" />
          <div className="absolute -bottom-[250px] -right-[250px] w-[700px] h-[700px] rounded-full bg-secondary/8 blur-[130px]" />
        </div>

        <div className="relative z-10 w-full flex flex-col flex-grow">
          <div className="max-w-3xl w-full mx-auto px-6 py-10 md:py-16">
            <div className="text-center mb-8">
              <h1 className="font-serif text-4xl font-semibold text-ink leading-tight">Partner With Us</h1>
              <p className="text-sm text-ink-soft mt-2">
                Bring 1-on-1 IITian mentorship to your students.
              </p>
            </div>
            <InstitutionOnboardingClient />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
