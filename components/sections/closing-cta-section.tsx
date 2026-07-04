import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { CLOSING_CTA } from "@/lib/content/hero";
import { PRIMARY_CTAS } from "@/lib/content/brand";

export function ClosingCtaSection() {
  return (
    <section className="relative overflow-hidden bg-[var(--color-background)] py-28 md:py-36">
      <div
        className="pointer-events-none absolute -top-32 right-[-10%] hidden h-[480px] w-[480px] rounded-full opacity-40 blur-3xl md:block"
        style={{ background: "radial-gradient(circle, var(--color-sky-soft) 0%, transparent 70%)" }}
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 md:grid-cols-[1fr_0.6fr] md:gap-16 md:px-12 lg:px-20">
        <Reveal animation="fade-up">
          <h2 className="font-serif text-3xl font-medium leading-tight tracking-tight text-[var(--color-fg)] md:text-4xl lg:text-[3.25rem] lg:leading-[1.1]">
            {CLOSING_CTA.headline}
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--color-fg-muted)] md:text-lg">
            {CLOSING_CTA.body}
          </p>
          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <Link
              href={PRIMARY_CTAS.student.href}
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[var(--color-sky)] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--color-sky-hover)] sm:justify-start"
            >
              Get Your Mentor <span aria-hidden>→</span>
            </Link>
            <Link
              href={PRIMARY_CTAS.institution.href}
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-[var(--color-border)] px-6 py-3 text-sm font-medium text-[var(--color-fg)] transition-colors hover:bg-[var(--color-surface-hover)] sm:justify-start"
            >
              Partner With Us <span aria-hidden>→</span>
            </Link>
          </div>
        </Reveal>

        <Reveal
          animation="scale-in"
          className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-3xl bg-[var(--color-surface-hover)] shadow-[var(--shadow-lift)]"
        >
          <Image
            src="/images/hitaishi/lamp-symbol-hero.webp"
            alt="The warmth of a wellwisher"
            fill
            sizes="(max-width: 768px) 80vw, 30vw"
            className="object-cover"
          />
        </Reveal>
      </div>
    </section>
  );
}
