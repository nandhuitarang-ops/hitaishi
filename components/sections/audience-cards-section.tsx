import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { AUDIENCES } from "@/lib/content/hero";

export function AudienceCardsSection() {
  return (
    <section
      id="audiences"
      className="bg-[var(--color-background-alt)] py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-20">
        <Reveal
          as="h2"
          className="mx-auto max-w-3xl text-center font-serif text-3xl font-medium leading-tight tracking-tight text-[var(--color-fg)] md:text-4xl lg:text-5xl"
        >
          Built for everyone in the JEE journey.
        </Reveal>

        <div className="mt-14 grid gap-6 md:mt-16 md:grid-cols-3 md:gap-8">
          {AUDIENCES.map((aud, i) => (
            <Reveal
              key={aud.href}
              delay={i * 100}
            >
              <Link
                href={aud.href}
                className="group flex h-full flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-solid)] p-8 transition-all hover:-translate-y-1 hover:border-[var(--color-sky)]/60 hover:shadow-[var(--shadow-lift)] md:p-10"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-sky)]">
                  {aud.eyebrow}
                </p>
                <h3 className="mt-5 flex-1 font-serif text-xl font-medium leading-snug text-[var(--color-fg)] md:text-2xl">
                  {aud.title}
                </h3>
                <p className="mt-6 text-sm font-medium text-[var(--color-fg)] transition-transform group-hover:translate-x-1">
                  {aud.label}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
