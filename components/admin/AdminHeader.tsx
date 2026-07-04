import Link from "next/link";
import { BRAND } from "@/lib/content/brand";

export function AdminHeader() {
  return (
    <header className="fixed top-3 left-1/2 z-50 w-[calc(100%-1.5rem)] -translate-x-1/2 md:top-5 md:w-auto">
      <div className="relative mx-auto overflow-hidden rounded-full border border-[var(--color-border)] bg-[var(--color-background)]/90 px-5 py-3 shadow-[0_18px_40px_-18px_rgba(15,23,42,0.18)] backdrop-blur-xl">
        <div className="relative flex items-center justify-between gap-6 md:gap-10">
          <Link
            href="/"
            className="font-serif text-lg font-medium tracking-tight text-[var(--color-fg)]"
            aria-label={`${BRAND.name} home`}
          >
            {BRAND.name.toLowerCase()}
          </Link>

          <div className="hidden items-center gap-2 md:flex">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-sky)]/30 bg-[var(--color-sky-soft)]/50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-sky-hover)]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-sky)]" />
              Admin
            </span>
            <span className="text-sm font-medium text-[var(--color-fg-muted)]">Leads dashboard</span>
          </div>

          <Link
            href="/"
            className="inline-flex h-9 items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-solid)] px-4 text-sm font-medium text-[var(--color-fg)] transition-colors hover:bg-[var(--color-surface-hover)]"
          >
            ← Back to site
          </Link>
        </div>
      </div>
    </header>
  );
}
