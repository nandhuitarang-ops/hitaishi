import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/sections/site-header";
import { SiteFooter } from "@/components/sections/site-footer";
import { PageHero } from "@/components/sections/page-hero";
import { PageBanner } from "@/components/sections/page-banner";
import { OfferingsGrid } from "@/components/sections/offerings-grid";
import { PullQuote } from "@/components/sections/pull-quote";
import { MENTORS_PAGE, MENTOR_OFFERINGS } from "@/lib/content/mentors";

export const metadata: Metadata = {
  title: "Mentors — Hitaishi",
  description: MENTORS_PAGE.intro,
};

export default function MentorsPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageHero
          eyebrow={MENTORS_PAGE.eyebrow}
          headline={MENTORS_PAGE.headline}
          intro={MENTORS_PAGE.intro}
        />
        <PageBanner src={MENTORS_PAGE.banner.src} alt={MENTORS_PAGE.banner.alt} />
        <OfferingsGrid items={MENTOR_OFFERINGS} />
        <PullQuote text={MENTORS_PAGE.pullQuote} />

        <section className="bg-[var(--color-background)] py-24 md:py-32">
          <div className="mx-auto max-w-4xl rounded-3xl border border-[var(--color-sky)]/30 bg-[var(--color-sky-soft)]/40 px-6 py-12 md:px-12 md:py-16">
            <h2 className="font-serif text-2xl font-medium leading-tight text-[var(--color-fg)] md:text-3xl">
              {MENTORS_PAGE.fitTitle}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[var(--color-fg-muted)] md:text-lg">
              {MENTORS_PAGE.fitBody}
            </p>
            <Link
              href="/become-a-mentor"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--color-sky)] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--color-sky-hover)]"
            >
              Become a Mentor →
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
