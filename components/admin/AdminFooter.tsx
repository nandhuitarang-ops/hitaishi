import { BRAND } from "@/lib/content/brand";

export function AdminFooter() {
  return (
    <footer className="mt-16 border-t border-[var(--color-border)] bg-[var(--color-background-alt)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-6 py-8 sm:flex-row lg:px-8">
        <p className="text-xs text-[var(--color-fg-subtle)]">
          © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
        </p>
        <p className="text-xs text-[var(--color-fg-subtle)]">Internal admin · not indexed</p>
      </div>
    </footer>
  );
}
