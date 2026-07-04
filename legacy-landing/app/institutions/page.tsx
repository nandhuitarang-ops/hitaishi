import type { Metadata } from "next";
import { SiteHeader } from "@/components/sections/site-header";
import { SiteFooter } from "@/components/sections/site-footer";
import { PageHero } from "@/components/sections/page-hero";
import { PageBanner } from "@/components/sections/page-banner";
import { OfferingsGrid } from "@/components/sections/offerings-grid";
import { PullQuote } from "@/components/sections/pull-quote";
import { InstitutionLeadForm } from "@/components/forms/institution-lead-form";
import { INSTITUTIONS_PAGE, INSTITUTION_OFFERINGS } from "@/lib/content/institutions";

export const metadata: Metadata = {
  title: "Institutions — Hitaishi",
  description: INSTITUTIONS_PAGE.intro,
};

export default function InstitutionsPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageHero
          eyebrow={INSTITUTIONS_PAGE.eyebrow}
          headline={INSTITUTIONS_PAGE.headline}
          intro={INSTITUTIONS_PAGE.intro}
        />
        <PageBanner src={INSTITUTIONS_PAGE.banner.src} alt={INSTITUTIONS_PAGE.banner.alt} />
        <OfferingsGrid items={INSTITUTION_OFFERINGS} />
        <PullQuote text={INSTITUTIONS_PAGE.pullQuote} />

        <section className="bg-[var(--color-background)] py-24 md:py-32">
          <div className="mx-auto max-w-4xl rounded-3xl border border-[var(--color-sky)]/30 bg-[var(--color-sky-soft)]/40 px-6 py-12 md:px-12 md:py-16">
            <h2 className="font-serif text-2xl font-medium leading-tight text-[var(--color-fg)] md:text-3xl">
              {INSTITUTIONS_PAGE.earlyPartnersTitle}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[var(--color-fg-muted)] md:text-lg">
              {INSTITUTIONS_PAGE.earlyPartnersBody}
            </p>
          </div>
        </section>

        <section id={INSTITUTIONS_PAGE.formAnchor} className="bg-[var(--color-background-alt)] py-24 md:py-32">
          <div className="mx-auto max-w-3xl px-6 md:px-12">
            <h2 className="font-serif text-3xl font-medium leading-tight text-[var(--color-fg)] md:text-4xl lg:text-5xl">
              {INSTITUTIONS_PAGE.formHeadline}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[var(--color-fg-muted)] md:text-lg">
              {INSTITUTIONS_PAGE.formSubhead}
            </p>
            <div className="mt-10">
              <InstitutionLeadForm />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
