import Link from "next/link";
import { SiteHeader } from "@/components/sections/site-header";
import { SiteFooter } from "@/components/sections/site-footer";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center bg-[var(--color-background)] py-32 md:py-48">
        <div className="mx-auto max-w-xl px-6 text-center md:px-12">
          <p className="font-serif text-7xl font-medium text-[var(--color-sky)]">404</p>
          <h1 className="mt-4 font-serif text-3xl font-medium text-[var(--color-fg)] md:text-4xl">
            That page wandered off.
          </h1>
          <p className="mt-4 text-base text-[var(--color-fg-muted)]">
            Don&apos;t worry — every mentor has done worse on a mock test. Let&apos;s get you back
            on track.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--color-sky)] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--color-sky-hover)]"
          >
            Back to home →
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
