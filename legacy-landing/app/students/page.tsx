import type { Metadata } from "next";
import { SiteHeader } from "@/components/sections/site-header";
import { SiteFooter } from "@/components/sections/site-footer";
import { PageHero } from "@/components/sections/page-hero";
import { PageBanner } from "@/components/sections/page-banner";
import { OfferingsGrid } from "@/components/sections/offerings-grid";
import { PullQuote } from "@/components/sections/pull-quote";
import { StudentLeadForm } from "@/components/forms/student-lead-form";
import { STUDENTS_PAGE, STUDENT_OFFERINGS } from "@/lib/content/students";

export const metadata: Metadata = {
  title: "Students — Hitaishi",
  description: STUDENTS_PAGE.intro,
};

export default function StudentsPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageHero
          eyebrow={STUDENTS_PAGE.eyebrow}
          headline={STUDENTS_PAGE.headline}
          intro={STUDENTS_PAGE.intro}
        />
        <PageBanner src={STUDENTS_PAGE.banner.src} alt={STUDENTS_PAGE.banner.alt} />
        <OfferingsGrid items={STUDENT_OFFERINGS} />
        <PullQuote text={STUDENTS_PAGE.pullQuote} />

        <section id={STUDENTS_PAGE.formAnchor} className="bg-[var(--color-background)] py-24 md:py-32">
          <div className="mx-auto max-w-3xl px-6 md:px-12">
            <h2 className="font-serif text-3xl font-medium leading-tight text-[var(--color-fg)] md:text-4xl lg:text-5xl">
              {STUDENTS_PAGE.formHeadline}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[var(--color-fg-muted)] md:text-lg">
              {STUDENTS_PAGE.formSubhead}
            </p>
            <div className="mt-10">
              <StudentLeadForm />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
