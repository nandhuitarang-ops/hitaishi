import Link from "next/link";
import { BRAND } from "@/lib/content/brand";

const COLUMNS = [
  {
    title: "Hitaishi",
    links: [
      { href: "/students", label: "Students" },
      { href: "/mentors", label: "Mentors" },
      { href: "/institutions", label: "Institutions" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/#faq", label: "FAQ" },
      { href: "/contact", label: "Contact" },
      { href: "/become-a-mentor", label: "Become a Mentor" },
    ],
  },
  {
    title: "Get in touch",
    links: [
      { href: `mailto:${BRAND.email}`, label: BRAND.email },
      { href: `https://wa.me/${BRAND.whatsapp.replace(/\D/g, "")}`, label: "WhatsApp" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-background-alt)]">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-12 lg:px-20">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-8 md:grid-cols-4 md:gap-10">
          <div className="col-span-2">
            <p className="font-serif text-2xl font-medium tracking-tight text-[var(--color-fg)]">
              {BRAND.name.toLowerCase()}
            </p>
            <p className="mt-3 text-sm italic text-[var(--color-fg-muted)]">{BRAND.tagline}</p>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-[var(--color-fg-muted)]">
              Mentorship for every JEE aspirant. Personal IIT &amp; NIT mentors, on
              your schedule, around your coaching.
            </p>
            <p className="mt-4 text-sm text-[var(--color-fg-muted)]">
              {BRAND.domain} · {BRAND.city}
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-fg)]">
                {col.title}
              </p>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-[var(--color-border)] pt-8 md:flex-row md:items-center">
          <p className="text-xs text-[var(--color-fg-muted)]">
            © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
          </p>
          <p className="text-xs text-[var(--color-fg-muted)]">
            Coaching gives you the syllabus. {BRAND.name} gives you the edge.
          </p>
        </div>
      </div>
    </footer>
  );
}
