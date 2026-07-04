import { Reveal } from "@/components/Reveal";

interface PullQuoteProps {
  text: string;
}

export function PullQuote({ text }: PullQuoteProps) {
  return (
    <section className="bg-[var(--color-background)] py-20 md:py-28">
      <Reveal
        as="blockquote"
        className="mx-auto max-w-4xl px-6 text-center md:px-12"
      >
        <p className="font-serif text-2xl italic leading-snug text-[var(--color-fg)] md:text-3xl lg:text-[2.5rem] lg:leading-[1.2]">
          &ldquo;{text}&rdquo;
        </p>
      </Reveal>
    </section>
  );
}
