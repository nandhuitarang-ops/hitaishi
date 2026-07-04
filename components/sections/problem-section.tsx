import { Reveal } from "@/components/Reveal";
import { PROBLEM } from "@/lib/content/hero";

export function ProblemSection() {
  return (
    <section
      id="problem"
      className="bg-[var(--color-background)] py-24 md:py-32"
    >
      <div className="mx-auto max-w-5xl px-6 md:px-12 lg:px-20">
        <Reveal
          as="h2"
          className="font-serif text-3xl font-medium leading-tight tracking-tight text-[var(--color-fg)] md:text-4xl lg:text-5xl"
        >
          {PROBLEM.headline}
        </Reveal>

        <Reveal
          as="p"
          delay={100}
          className="mt-6 max-w-3xl text-base leading-relaxed text-[var(--color-fg-muted)] md:text-lg"
        >
          {PROBLEM.body}
        </Reveal>

        <div className="mt-14 grid gap-6 md:mt-16 md:grid-cols-2 md:gap-8">
          <Reveal
            delay={150}
            className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-solid)] p-8 md:p-10"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
              {PROBLEM.without.title}
            </p>
            <p className="mt-4 text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
              {PROBLEM.without.body}
            </p>
          </Reveal>

          <Reveal
            delay={250}
            className="rounded-2xl border border-[var(--color-sky)]/30 bg-[var(--color-sky-soft)]/40 p-8 md:p-10"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-sky-hover)]">
              {PROBLEM.with.title}
            </p>
            <p className="mt-4 text-lg leading-relaxed text-[var(--color-fg)] md:text-xl">
              {PROBLEM.with.body}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
