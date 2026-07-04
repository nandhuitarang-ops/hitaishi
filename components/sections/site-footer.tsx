"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, type FormEvent } from "react";
import { BRAND } from "@/lib/content/brand";

const NAV_LINKS = [
  { href: "/students", label: "Students" },
  { href: "/mentors", label: "Mentors" },
  { href: "/institution", label: "Institutions" },
  { href: "/pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
] as const;

const SOCIAL_LINKS = [
  { href: "https://twitter.com/hitaishi", label: "Twitter" },
  { href: "https://linkedin.com/company/hitaishi", label: "LinkedIn" },
  { href: "https://instagram.com/hitaishi", label: "Instagram" },
] as const;

export function SiteFooter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="relative overflow-hidden border-t border-[var(--color-border)] bg-[var(--color-background-alt)]">
      {/* Large HITAISHI watermark — z-0, absolute, fades at top and bottom via mask gradient */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 flex items-end justify-center overflow-hidden"
        style={{
          height: "600px",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
        }}
        aria-hidden="true"
      >
        <Image
          src="/images/logo-watermark.svg"
          alt=""
          width={2200}
          height={550}
          className="h-auto w-full max-w-[1600px] md:max-w-[2200px]"
          style={{ opacity: 0.1 }}
          priority={false}
        />
      </div>

      {/* Content layer — z-10, in normal flow */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-12 pb-6 md:px-12 lg:px-20">
        {/* Top section: Navigation + Social + Newsletter */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
          {/* Column 1 — Navigation */}
          <nav className="md:col-span-4" aria-label="Footer navigation">
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[var(--color-fg-subtle)]">
              Navigation
            </p>
            <ul className="mt-5 space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-base text-[var(--color-fg)] transition-colors hover:text-[var(--color-primary)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Column 2 — Social */}
          <div className="md:col-span-3">
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[var(--color-fg-subtle)]">
              Social
            </p>
            <ul className="mt-5 space-y-3">
              {SOCIAL_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base text-[var(--color-fg)] transition-colors hover:text-[var(--color-primary)]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Newsletter (right-aligned) */}
          <div className="md:col-span-5 md:text-right">
            <h3 className="font-serif text-2xl font-medium text-[var(--color-fg)] md:text-3xl">
              What&apos;s new, straight to you
            </h3>
            <p className="mt-2 text-sm text-[var(--color-fg-muted)]">
              Includes the latest product updates, mentorship tips, and JEE insights.
            </p>

            {subscribed ? (
              <div
                role="status"
                className="mt-5 inline-block rounded-xl bg-[var(--color-primary-soft)] px-5 py-3 text-center"
              >
                <p className="text-sm font-medium text-[var(--color-primary-deep)]">
                  Thanks for subscribing! 🎉
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubscribe}
                className="mt-5 flex flex-col gap-2 sm:flex-row sm:gap-3"
              >
                <label htmlFor="footer-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="footer-email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@framer.com"
                  required
                  className="min-w-0 flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-solid)] px-5 py-3 text-sm text-[var(--color-fg)] placeholder:text-[var(--color-fg-subtle)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-soft)]"
                />
                <button
                  type="submit"
                  className="flex-shrink-0 rounded-xl bg-[var(--color-fg)] px-6 py-3 text-sm font-medium text-[var(--color-background)] transition-colors hover:bg-[var(--color-primary-deep)]"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Spacer — gives the watermark breathing room and pushes the copyright bar to the bottom */}
        <div className="h-96 md:h-[500px]" aria-hidden="true" />

        {/* Copyright bar */}
        <div className="relative flex flex-col items-start justify-between gap-3 border-t border-[var(--color-border)] pt-6 md:flex-row md:items-center">
          <p className="text-xs text-[var(--color-fg-subtle)]">
            © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <Link
              href="/privacy"
              className="text-xs text-[var(--color-fg-subtle)] transition-colors hover:text-[var(--color-fg)]"
            >
              Privacy
            </Link>
            <span aria-hidden="true" className="text-xs text-[var(--color-fg-subtle)]">
              |
            </span>
            <Link
              href="/terms"
              className="text-xs text-[var(--color-fg-subtle)] transition-colors hover:text-[var(--color-fg)]"
            >
              Terms
            </Link>
            <span aria-hidden="true" className="text-xs text-[var(--color-fg-subtle)]">
              |
            </span>
            <Link
              href="/policy/academic-integrity"
              className="text-xs text-[var(--color-fg-subtle)] transition-colors hover:text-[var(--color-fg)]"
            >
              Academic Integrity
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
