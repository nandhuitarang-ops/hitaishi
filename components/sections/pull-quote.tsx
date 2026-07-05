import { Reveal } from "@/components/Reveal";

interface PullQuoteProps {
  text: string;
}

export function PullQuote({ text }: PullQuoteProps) {
  return (
    <section className="bg-[var(--color-background)] py-20 md:py-28">
      <Reveal
        as="blockquote"
        className="mx-auto max-w-5xl px-6 text-center md:px-12"
      >
        <p className="font-serif text-3xl font-semibold italic leading-snug text-[var(--color-fg)] md:text-4xl lg:text-[2.6rem] lg:leading-[1.2]">
          &ldquo;{text}&rdquo;
        </p>
      </Reveal>
    </section>
  );
}
