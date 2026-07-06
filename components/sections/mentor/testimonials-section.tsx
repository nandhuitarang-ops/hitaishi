"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

const TESTIMONIALS = [
  {
    rating: 5,
    quote: "Physics used to be a nightmare. The shortcuts and concepts my mentor shared saved my preparation.",
    name: "Amardeep Singh",
    role: "JEE MENTEE",
    subInfo: "JEE 2028 Aspirant",
    badge: "165/180 IN PHYSICS",
  },
  {
    rating: 5,
    quote: "The daily calls kept me on track. It's not just about teaching, it's about having someone who listens and guides you through the exam strategy.",
    name: "Sahil Mansoor",
    role: "JEE TOPPER",
    subInfo: "IIT Kharagpur CSE",
    badge: "99.8%ILE IN CHEMISTRY",
  },
  {
    rating: 5,
    quote: "Structured tests and proper analysis helped me jump from 450 to 620 in my mocks. The error-tracking spreadsheet my mentor made was a lifesaver.",
    name: "Suchitra Negi",
    role: "JEE ACHIEVER",
    subInfo: "IIT Delhi Electrical",
    badge: "99.4%ILE IN JEE",
  },
  {
    rating: 5,
    quote: "Having an IIT Bombay mentor who went through the same pressure just a year ago kept me sane during the final stretch of my preparation.",
    name: "Aarav Mehta",
    role: "JEE MENTEE",
    subInfo: "JEE 2027 Aspirant",
    badge: "99.9%ILE IN MATHS",
  },
  {
    rating: 5,
    quote: "I was stuck at 140 marks in mock tests. My mentor taught me how to prioritize questions during the test, helping me cross 210 in the main exam.",
    name: "Sneha Reddy",
    role: "JEE ACHIEVER",
    subInfo: "NIT Trichy ECE",
    badge: "99.6%ILE IN JEE",
  },
  {
    rating: 5,
    quote: "The daily touchpoints and direct support on WhatsApp meant I never felt isolated or lost in the massive syllabus.",
    name: "Vikram Aditya",
    role: "JEE MENTEE",
    subInfo: "JEE 2028 Aspirant",
    badge: "99.7%ILE IN PHYSICS",
  },
];

export function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      className="bg-[var(--color-background)] py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-20">
        <div className="text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: EASE }}
            className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)] md:text-sm"
          >
            Testimonials
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            className="mt-5 font-serif text-3xl font-medium leading-tight tracking-tight text-[var(--color-fg)] md:text-4xl lg:text-5xl"
          >
            Real students.{" "}
            <span className="text-[var(--color-primary-deep)]">Real results.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
            className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-[var(--color-fg-muted)] md:text-lg"
          >
            See how Hitaishi mentors are transforming the preparation journey for JEE
            aspirants across India.
          </motion.p>
        </div>

        <div className="mt-14 grid gap-6 md:mt-16 md:grid-cols-3 md:gap-8">
          {TESTIMONIALS.map((item, i) => {
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.7,
                  delay: 0.1 + (i % 3) * 0.1,
                  ease: EASE,
                }}
                className="group flex flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-solid)] p-8 transition-all hover:-translate-y-0.5 hover:border-[var(--color-primary)]/40 hover:shadow-[var(--shadow-lift)] md:p-10"
              >
                <div className="flex gap-1 text-[var(--color-primary)]">
                  {Array.from({ length: item.rating }).map((_, idx) => (
                    <Star
                      key={idx}
                      size={16}
                      className="fill-current text-current"
                    />
                  ))}
                </div>

                <blockquote className="mt-6 flex-1 font-serif text-base italic leading-relaxed text-[var(--color-fg-muted)] md:text-lg">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>

                <hr className="my-6 border-[var(--color-border)]" />

                <div className="flex items-end justify-between gap-4">
                  <div className="flex flex-col">
                    <span className="font-serif text-base font-semibold text-[var(--color-fg)]">
                      {item.name}
                    </span>
                    <span className="mt-1 text-[10px] font-bold tracking-wider text-[var(--color-primary-deep)] uppercase">
                      {item.role}
                    </span>
                    <span className="mt-0.5 text-xs text-[var(--color-fg-subtle)]">
                      {item.subInfo}
                    </span>
                  </div>
                  {item.badge && (
                    <span className="shrink-0 rounded-full bg-[var(--color-primary-soft)] px-3 py-1 text-[10px] font-bold tracking-wider text-[var(--color-primary-deep)] uppercase">
                      {item.badge}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
