"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const SESSION_KEY = "hitaishi:intro_seen";
const TOTAL_MS = 2400;

const EASE = [0.22, 1, 0.36, 1] as const;
const wordmark = "hitaishi".split("");

export function IntroClip() {
  const reduced = useReducedMotion();
  const pathname = usePathname();
  // Computed during first client render only — IntroClipMount loads this with ssr:false,
  // so sessionStorage access is safe and there is no hydration mismatch.
  const [visible, setVisible] = useState<boolean>(() => {
    // Skip the splash on the homepage — the hero handles the brand reveal there.
    if (pathname === "/") return false;
    if (sessionStorage.getItem(SESSION_KEY) === "1") return false;
    return true;
  });

  useEffect(() => {
    if (visible) sessionStorage.setItem(SESSION_KEY, "1");
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const duration = reduced ? 700 : TOTAL_MS;
    const t = window.setTimeout(() => setVisible(false), duration);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setVisible(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [visible, reduced]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ duration: 0.55, ease: EASE }}
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ backgroundColor: "#f8fafc" }}
          role="dialog"
          aria-modal="true"
          aria-label="Hitaishi intro"
        >
          <div className="flex flex-col items-center gap-7">
            {/* Concentric arcs — academic compass mark */}
            <motion.svg
              width="96"
              height="96"
              viewBox="0 0 96 96"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: EASE }}
              aria-hidden
            >
              {/* Outer arc */}
              <motion.path
                d="M 16 48 A 32 32 0 0 1 80 48"
                stroke="#2f7d5c"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.85, delay: 0.1, ease: EASE }}
              />
              {/* Middle arc */}
              <motion.path
                d="M 26 48 A 22 22 0 0 1 70 48"
                stroke="#266649"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.8 }}
                transition={{ duration: 0.75, delay: 0.35, ease: EASE }}
              />
              {/* Inner arc */}
              <motion.path
                d="M 36 48 A 12 12 0 0 1 60 48"
                stroke="#0b6445"
                strokeWidth="1.6"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.7 }}
                transition={{ duration: 0.6, delay: 0.55, ease: EASE }}
              />
              {/* Centre dot */}
              <motion.circle
                cx="48"
                cy="48"
                r="3"
                fill="#2f7d5c"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.85, ease: EASE }}
                style={{ transformOrigin: "48px 48px" }}
              />
              {/* Soft glow */}
              <motion.circle
                cx="48"
                cy="48"
                r="34"
                fill="#2f7d5c"
                opacity="0.08"
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1.1, opacity: 0.1 }}
                transition={{ duration: 0.9, delay: 0.9, ease: EASE }}
                style={{ transformOrigin: "48px 48px" }}
              />
            </motion.svg>

            {/* Wordmark */}
            <h1 className="font-serif text-4xl font-medium tracking-tight text-[#181d1a] md:text-5xl">
              {wordmark.map((c, i) => (
                <span key={i} className="inline-block overflow-hidden align-bottom">
                  <motion.span
                    initial={{ y: "110%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      duration: 0.55,
                      delay: 1.0 + i * 0.05,
                      ease: EASE,
                    }}
                    className="inline-block"
                  >
                    {c}
                  </motion.span>
                </span>
              ))}
            </h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.6 }}
              className="max-w-[18rem] text-center text-[11px] font-medium uppercase tracking-[0.2em] text-[#3f4943] md:max-w-none md:text-xs md:tracking-[0.32em]"
            >
              your wellwisher in the JEE journey
            </motion.p>
          </div>

          <motion.button
            type="button"
            onClick={() => setVisible(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            aria-label="Skip intro"
            className="absolute bottom-4 right-4 inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full px-4 text-xs uppercase tracking-[0.18em] text-[#3f4943] transition-colors hover:bg-[#2f7d5c]/10 hover:text-[#181d1a]"
          >
            Skip ↵
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
