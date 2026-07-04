import type { Metadata } from "next";
import { SiteHeader } from "@/components/sections/site-header";
import { SiteFooter } from "@/components/sections/site-footer";
import { PageHero } from "@/components/sections/page-hero";
import { ContactForm } from "@/components/forms/contact-form";
import { BRAND } from "@/lib/content/brand";

export const metadata: Metadata = {
  title: "Contact — Hitaishi",
  description:
    "Get in touch with Hitaishi. Mentorship for every JEE aspirant. Hyderabad, India.",
};

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageHero
          eyebrow="Contact"
          headline="Get in touch."
          intro="Tell us a little about yourself and we'll get back to you within 2 working days."
        />
        <section className="bg-[var(--color-background-alt)] py-16 md:py-24">
          <div className="mx-auto grid max-w-5xl gap-12 px-6 md:grid-cols-[1.2fr_0.8fr] md:gap-16 md:px-12">
            <div>
              <ContactForm />
            </div>
            <aside className="space-y-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-solid)] p-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">
                  Brand
                </p>
                <p className="mt-2 font-serif text-2xl font-medium text-[var(--color-fg)]">
                  {BRAND.name}
                </p>
                <p className="text-sm italic text-[var(--color-fg-muted)]">{BRAND.tagline}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">
                  Where
                </p>
                <p className="mt-2 text-base text-[var(--color-fg)]">{BRAND.city}</p>
                <p className="text-base text-[var(--color-fg-muted)]">{BRAND.domain}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">
                  Direct
                </p>
                <p className="mt-2 text-base text-[var(--color-fg)]">{BRAND.email}</p>
                <p className="text-base text-[var(--color-fg-muted)]">WhatsApp: {BRAND.whatsapp}</p>
              </div>
              <p className="border-t border-[var(--color-border)] pt-6 font-serif text-base italic text-[var(--color-fg-muted)]">
                Mentorship for every JEE aspirant.
              </p>
            </aside>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
