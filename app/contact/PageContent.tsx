"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import { SiteHeader } from "@/components/sections/site-header";
import { SiteFooter } from "@/components/sections/site-footer";
import { BRAND } from "@/lib/content/brand";
import {
  MessageCircle,
  Mail,
  Users,
  GraduationCap,
  Building2,
  Handshake,
  CheckCircle2,
  ArrowRight,
  Send,
  Sparkles,
  ShieldCheck,
  Heart,
  HelpCircle,
} from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

const AUDIENCE = [
  {
    icon: GraduationCap,
    title: "Students",
    desc: "Looking for a personal JEE mentor who's been through the grind — someone who can guide you when coaching feels like too much.",
  },
  {
    icon: Heart,
    title: "Parents",
    desc: "Want to ensure your child gets the right guidance, beyond marks and ranks — mentorship that builds confidence and strategy.",
  },
  {
    icon: Building2,
    title: "Institutions",
    desc: "Coaching centres and schools looking to partner with Hitaishi to offer mentorship as a value-add for your students.",
  },
  {
    icon: Handshake,
    title: "Mentors",
    desc: "IITians and top rankers who want to give back, earn on their own schedule, and help the next generation crack JEE.",
  },
];

const WHY_CONTACT = [
  {
    icon: Sparkles,
    title: "Free Consultation",
    desc: "Talk to us about your JEE goals — no charges, no strings attached.",
  },
  {
    icon: ShieldCheck,
    title: "No Commitment Required",
    desc: "Explore your options freely. We're here to inform, not pressure.",
  },
  {
    icon: Users,
    title: "Right Mentor Match",
    desc: "We'll connect you with a mentor who fits your subject, pace, and goals.",
  },
  {
    icon: HelpCircle,
    title: "Ask Anything",
    desc: "Doubts about the platform, mentorship process, pricing — we'll answer everything.",
  },
];

const ROLE_OPTIONS = ["Student", "Parent", "Institution", "Mentor"] as const;

export function PageContent() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      <SiteHeader />

      <main>
        {/* ─── Hero ─── */}
        <section className="relative overflow-hidden bg-[var(--color-background)] pt-32 pb-20 md:pt-40 md:pb-28">
          {/* Subtle decorative blobs */}
          <div
            className="pointer-events-none absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full opacity-30 blur-3xl"
            style={{ background: "var(--color-primary-soft)" }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-32 -left-32 h-[400px] w-[400px] rounded-full opacity-20 blur-3xl"
            style={{ background: "var(--color-primary-soft)" }}
            aria-hidden
          />

          <div className="relative mx-auto max-w-4xl px-6 text-center md:px-12">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-primary)]"
            >
              Get in touch
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
              className="mt-5 font-serif text-[clamp(2.4rem,6vw,4.2rem)] font-medium leading-[1.05] tracking-tight text-[var(--color-ink)]"
            >
              Let&apos;s talk.{" "}
              <span className="text-[var(--color-primary)]">
                We&apos;re here to help.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
              className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[var(--color-ink-soft)] md:text-lg"
            >
              Whether you&apos;re a student exploring mentorship, a parent
              seeking guidance for your child, or a mentor ready to make a
              difference — we&apos;re just a message away.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
              className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <a
                href={`https://wa.me/${BRAND.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-7 py-3.5 text-sm font-medium text-[var(--color-on-primary)] shadow-lg shadow-green-900/20 transition-all hover:scale-[1.02] hover:bg-[var(--color-primary-hover)]"
              >
                <MessageCircle size={18} />
                WhatsApp Us
              </a>
              <a
                href={`mailto:${BRAND.email}`}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--color-rule-strong)] bg-transparent px-7 py-3.5 text-sm font-medium text-[var(--color-primary-deep)] transition-all hover:bg-[var(--color-primary-soft)]"
              >
                <Mail size={18} />
                Send an Email
              </a>
            </motion.div>
          </div>
        </section>

        {/* ─── Who Should Contact Us ─── */}
        <section className="bg-[var(--color-surface-card)] py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-6 md:px-12">
            <Reveal className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-primary)]">
                Who should reach out
              </p>
              <h2 className="mt-4 font-serif text-[clamp(1.8rem,4vw,2.8rem)] font-medium leading-tight tracking-tight text-[var(--color-ink)]">
                We&apos;re here for you
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base text-[var(--color-ink-soft)]">
                Hitaishi serves a wide community. No matter where you are in the
                JEE journey, we can help.
              </p>
            </Reveal>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {AUDIENCE.map((item, i) => (
                <Reveal
                  key={item.title}
                  delay={i * 100}
                  className="group rounded-2xl border border-[var(--color-rule)] bg-[var(--color-surface-card)] p-7 transition-all duration-300 hover:border-[var(--color-primary)] hover:shadow-lg hover:shadow-green-900/5"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-primary-soft)] text-[var(--color-primary)] transition-colors duration-300 group-hover:bg-[var(--color-primary)] group-hover:text-[var(--color-on-primary)]">
                    <item.icon size={22} />
                  </div>
                  <h3 className="mt-5 font-serif text-lg font-medium text-[var(--color-ink)]">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-[var(--color-ink-soft)]">
                    {item.desc}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ─── How to Contact Us ─── */}
        <section className="bg-[var(--color-background)] py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-6 md:px-12">
            <Reveal className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-primary)]">
                How to reach us
              </p>
              <h2 className="mt-4 font-serif text-[clamp(1.8rem,4vw,2.8rem)] font-medium leading-tight tracking-tight text-[var(--color-ink)]">
                Pick your preferred way
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base text-[var(--color-ink-soft)]">
                Multiple channels, same promise — we&apos;ll get back to you
                fast.
              </p>
            </Reveal>

            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {/* WhatsApp */}
              <Reveal className="group relative flex flex-col items-center rounded-2xl border border-[var(--color-rule)] bg-[var(--color-surface-card)] p-8 text-center transition-all duration-300 hover:border-[var(--color-primary)] hover:shadow-lg hover:shadow-green-900/5">
                <a
                  href={`https://wa.me/${BRAND.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center"
                >
                <span className="absolute top-4 right-4 rounded-full bg-[var(--color-primary)] px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-on-primary)]">
                  Fastest
                </span>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-primary-soft)] text-[var(--color-primary)] transition-colors duration-300 group-hover:bg-[var(--color-primary)] group-hover:text-[var(--color-on-primary)]">
                  <MessageCircle size={26} />
                </div>
                <h3 className="mt-5 font-serif text-lg font-medium text-[var(--color-ink)]">
                  WhatsApp
                </h3>
                <p className="mt-1.5 text-sm text-[var(--color-ink-soft)]">
                  {BRAND.whatsapp}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--color-primary)] transition-colors group-hover:text-[var(--color-primary-hover)]">
                  Start Chat <ArrowRight size={14} />
                </span>
              </a>
              </Reveal>

              {/* Email */}
              <Reveal
                delay={100}
                className="group flex flex-col items-center rounded-2xl border border-[var(--color-rule)] bg-[var(--color-surface-card)] p-8 text-center transition-all duration-300 hover:border-[var(--color-primary)] hover:shadow-lg hover:shadow-green-900/5"
              >
                <a
                  href={`mailto:${BRAND.email}`}
                  className="flex flex-col items-center"
                >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-primary-soft)] text-[var(--color-primary)] transition-colors duration-300 group-hover:bg-[var(--color-primary)] group-hover:text-[var(--color-on-primary)]">
                  <Mail size={26} />
                </div>
                <h3 className="mt-5 font-serif text-lg font-medium text-[var(--color-ink)]">
                  Email
                </h3>
                <p className="mt-1.5 text-sm text-[var(--color-ink-soft)]">
                  {BRAND.email}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--color-primary)] transition-colors group-hover:text-[var(--color-primary-hover)]">
                  Send Mail <ArrowRight size={14} />
                </span>
              </a>
              </Reveal>

              {/* Contact Form */}
              <Reveal
                delay={200}
                className="group flex flex-col items-center rounded-2xl border border-[var(--color-primary)] bg-[var(--color-primary-soft)]/40 p-8 text-center"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-primary)] text-[var(--color-on-primary)]">
                  <Send size={26} />
                </div>
                <h3 className="mt-5 font-serif text-lg font-medium text-[var(--color-ink)]">
                  Contact Form
                </h3>
                <p className="mt-1.5 text-sm text-[var(--color-ink-soft)]">
                  Fill out the form below and we&apos;ll respond within 24
                  hours.
                </p>
                <a
                  href="#contact-form"
                  className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--color-primary)]"
                >
                  Jump to Form <ArrowRight size={14} />
                </a>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ─── Why Contact Us ─── */}
        <section className="bg-[var(--color-surface-card)] py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-6 md:px-12">
            <Reveal className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-primary)]">
                Why reach out
              </p>
              <h2 className="mt-4 font-serif text-[clamp(1.8rem,4vw,2.8rem)] font-medium leading-tight tracking-tight text-[var(--color-ink)]">
                Zero risk, all upside
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base text-[var(--color-ink-soft)]">
                We built Hitaishi to remove friction from the mentorship
                experience — starting with the very first conversation.
              </p>
            </Reveal>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {WHY_CONTACT.map((item, i) => (
                <Reveal
                  key={item.title}
                  delay={i * 100}
                  className="rounded-2xl border border-[var(--color-rule)] bg-[var(--color-background)] p-7"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                    <item.icon size={20} />
                  </div>
                  <h3 className="mt-4 font-serif text-base font-medium text-[var(--color-ink)]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-soft)]">
                    {item.desc}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Contact Form ─── */}
        <section
          id="contact-form"
          className="bg-[var(--color-background)] py-20 md:py-28"
        >
          <div className="mx-auto max-w-2xl px-6 md:px-12">
            <Reveal className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-primary)]">
                Send us a message
              </p>
              <h2 className="mt-4 font-serif text-[clamp(1.8rem,4vw,2.8rem)] font-medium leading-tight tracking-tight text-[var(--color-ink)]">
                We&apos;d love to hear from you
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-base text-[var(--color-ink-soft)]">
                Fill out the form below and we&apos;ll get back to you within 24
                hours. We read every message.
              </p>
            </Reveal>

            <Reveal
              delay={150}
              className="mt-12"
            >
              {submitted ? (
                <div className="rounded-2xl border border-[var(--color-primary-soft)] bg-[var(--color-primary-soft)]/30 p-12 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="mt-6 font-serif text-2xl font-medium text-[var(--color-ink)]">
                    Message sent!
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-soft)]">
                    Thanks for reaching out. We&apos;ll get back to you within
                    24 hours. In the meantime, feel free to{" "}
                    <a
                      href={`https://wa.me/${BRAND.whatsapp.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-[var(--color-primary)] underline decoration-[var(--color-primary)]/30 underline-offset-2 hover:decoration-[var(--color-primary)]"
                    >
                      WhatsApp us
                    </a>{" "}
                      for a faster response.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSubmitted(true);
                  }}
                  className="space-y-6"
                >
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-[var(--color-ink)]"
                    >
                      Name <span className="text-[var(--color-error)]">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="Your full name"
                      className="mt-2 block w-full rounded-xl border border-[var(--color-rule)] bg-[var(--color-surface-card)] px-4 py-3 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-faint)] transition-colors focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-[var(--color-ink)]"
                    >
                      Email{" "}
                      <span className="text-[var(--color-error)]">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      className="mt-2 block w-full rounded-xl border border-[var(--color-rule)] bg-[var(--color-surface-card)] px-4 py-3 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-faint)] transition-colors focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-[var(--color-ink)]"
                    >
                      Phone{" "}
                      <span className="text-[var(--color-ink-faint)]">
                        (optional)
                      </span>
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      className="mt-2 block w-full rounded-xl border border-[var(--color-rule)] bg-[var(--color-surface-card)] px-4 py-3 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-faint)] transition-colors focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
                    />
                  </div>

                  {/* I am a */}
                  <div>
                    <label
                      htmlFor="role"
                      className="block text-sm font-medium text-[var(--color-ink)]"
                    >
                      I am a{" "}
                      <span className="text-[var(--color-error)]">*</span>
                    </label>
                    <select
                      id="role"
                      name="role"
                      required
                      defaultValue=""
                      className="mt-2 block w-full appearance-none rounded-xl border border-[var(--color-rule)] bg-[var(--color-surface-card)] px-4 py-3 text-sm text-[var(--color-ink)] transition-colors focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%236f7a72' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' viewBox='0 0 24 24'%3E%3Cpath d='M4 9l8 8 8-8'/%3E%3C/svg%3E")`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 12px center",
                      }}
                    >
                      <option value="" disabled>
                        Select your role
                      </option>
                      {ROLE_OPTIONS.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-[var(--color-ink)]"
                    >
                      Message{" "}
                      <span className="text-[var(--color-error)]">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      placeholder="Tell us how we can help you..."
                      className="mt-2 block w-full resize-none rounded-xl border border-[var(--color-rule)] bg-[var(--color-surface-card)] px-4 py-3 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-faint)] transition-colors focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
                    />
                  </div>

                  {/* Submit */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] px-8 py-3.5 text-sm font-medium text-[var(--color-on-primary)] shadow-lg shadow-green-900/20 transition-all hover:scale-[1.01] hover:bg-[var(--color-primary-hover)] active:scale-[0.99] sm:w-auto"
                    >
                      <Send size={16} />
                      Send Message
                    </button>
                  </div>
                </form>
              )}
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
