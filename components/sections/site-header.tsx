"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { BRAND, NAV_LINKS, PRIMARY_CTAS } from "@/lib/content/brand";

const DOCK_SHADOW =
  "rgba(15, 23, 42, 0.05) 0px 0px 0px 1px, " +
  "rgba(15, 23, 42, 0.06) 0px 4px 12px -2px, " +
  "rgba(15, 23, 42, 0.06) 0px 12px 30px -8px";

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const dockBg = isScrolled
    ? "bg-[var(--color-background)]/90 backdrop-blur-xl"
    : "bg-[var(--color-background)]/55 backdrop-blur-md";

  return (
    <header className="fixed top-4 left-1/2 z-40 w-full max-w-[calc(100vw-2rem)] -translate-x-1/2 px-0 md:w-auto md:max-w-none">
      <div
        className={`mx-auto flex w-fit items-center gap-0.5 rounded-full border border-[var(--color-border)] p-0.5 transition-all duration-300 ${dockBg}`}
        style={{ boxShadow: DOCK_SHADOW }}
      >
        {/* Logo */}
        <Link
          href="/"
          className="pl-4 pr-3 py-1.5 flex items-center gap-2"
        >
          <Image
            src="/images/logo-icon-transparent.png"
            alt="Hitaishii"
            width={24}
            height={24}
            className="h-6 w-auto object-contain"
            priority
          />
          <span className="font-serif text-sm font-extrabold text-metallic-gold tracking-tight">
            hitaishii
          </span>
        </Link>
 
        {/* Divider */}
        <span className="hidden h-4 w-px bg-[var(--color-border)] md:block" aria-hidden />
 
        {/* Nav links */}
        <nav className="hidden items-center md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-1 text-xs font-medium text-[var(--color-fg-muted)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-fg)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
 
        {/* Single primary CTA */}
        <Link
          href={PRIMARY_CTAS.student.href}
          className="ml-0.5 hidden rounded-full bg-metallic-gold px-3.5 py-1 text-xs font-semibold text-[var(--color-on-primary)] transition-all hover:scale-[1.02] shadow-sm md:inline-flex md:items-center md:gap-1"
        >
          {PRIMARY_CTAS.student.label} <span aria-hidden className="text-[10px]">→</span>
        </Link>
 
        {/* Mobile toggle */}
        <button
          type="button"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav-menu"
          onClick={() => setIsMenuOpen((open) => !open)}
          className="ml-0.5 mr-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-fg)] hover:bg-[var(--color-surface-hover)] md:hidden"
        >
          {isMenuOpen ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div
          id="mobile-nav-menu"
          className="mt-3 w-full rounded-3xl border border-[var(--color-border)] bg-[var(--color-background)]/95 px-5 py-3 backdrop-blur-xl md:hidden"
          style={{ boxShadow: DOCK_SHADOW }}
        >
          <nav className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="flex min-h-[44px] items-center rounded-xl px-3 text-base font-medium text-[var(--color-fg)] transition-colors hover:bg-[var(--color-surface-hover)]"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={PRIMARY_CTAS.mentor.href}
              onClick={() => setIsMenuOpen(false)}
              className="flex min-h-[44px] items-center rounded-xl px-3 text-base font-medium text-[var(--color-fg)] transition-colors hover:bg-[var(--color-surface-hover)]"
            >
              Become a Mentor
            </Link>
            <Link
              href={PRIMARY_CTAS.student.href}
              onClick={() => setIsMenuOpen(false)}
              className="mt-3 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-metallic-gold px-5 py-3 text-sm font-semibold text-[var(--color-on-primary)] shadow-sm"
            >
              {PRIMARY_CTAS.student.label} <span aria-hidden>→</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
