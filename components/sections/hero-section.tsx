"use client";

import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/Reveal";

export function HeroSection() {
  return (
    <>
      {/* Video Container Section (Full Screen Width / Full Bleed) */}
      <section id="hero-video" className="w-full bg-black overflow-hidden relative h-[80vh] min-h-[400px] max-h-[800px]">
        <video
          src="https://res.cloudinary.com/ngakq1js/video/upload/v1783235242/WhatsApp_Video_2026-07-05_at_11.45.50_oq8bsj.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover"
        />
      </section>

      {/* Hero Text & CTA Section below the Video */}
      <section id="hero-text" className="w-full bg-white pt-20 pb-28 border-b border-[var(--color-border)]">
        <div className="mx-auto max-w-5xl px-6 text-center flex flex-col items-center">
          <Reveal className="mb-6">
            <Image
              src="/images/logo-icon-transparent.png"
              alt="Hitaishii Crest"
              width={56}
              height={56}
              className="h-14 w-auto object-contain mx-auto"
            />
          </Reveal>
          <Reveal delay={50}>
            <p className="text-sm md:text-base font-extrabold uppercase tracking-[0.25em] text-metallic-gold">
              JEE Mentorship · Flexible · Institutional & Personal
            </p>
          </Reveal>
          
          <Reveal delay={100}>
            <h1 className="mt-8 font-serif text-5xl md:text-7xl lg:text-8xl font-black leading-[1.0] tracking-tight text-[var(--color-fg)] uppercase">
              The Mentor
              <br />
              You Wished
              <br />
              You Had
            </h1>
          </Reveal>

          <Reveal delay={200}>
            <p className="mt-8 text-base md:text-lg lg:text-xl font-medium leading-relaxed text-[var(--color-fg-muted)] max-w-3xl">
              Hitaishi pairs JEE aspirants with IITian & top-ranker mentors — on their schedule, around their coaching, wherever they are. For students, directly. For institutions, seamlessly integrated.
            </p>
          </Reveal>

          <Reveal delay={300} className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/student-onboarding"
              className="group inline-flex items-center justify-center rounded-full border border-transparent bg-metallic-gold px-8 py-3.5 text-sm md:text-base font-semibold text-[var(--color-on-primary)] transition-all hover:scale-[1.01] shadow-md hover:shadow-lg whitespace-nowrap gap-2"
            >
              I&apos;m a Student
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
            </Link>
            <Link
              href="/become-a-mentor"
              className="group inline-flex items-center justify-center rounded-full border border-[var(--color-primary)] bg-transparent hover:bg-[var(--color-primary-soft)]/30 px-8 py-3.5 text-sm md:text-base font-semibold text-[var(--color-primary-deep)] transition-all hover:scale-[1.01] shadow-sm hover:shadow whitespace-nowrap gap-2"
            >
              Become a Mentor
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
            </Link>
          </Reveal>

          <Reveal delay={400}>
            <p className="mt-12 text-xs md:text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">
              Mentors from IITs & NITs · Flexible scheduling · Works alongside any coaching
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
