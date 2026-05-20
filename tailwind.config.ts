import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "var(--surface)",
          card: "var(--surface-card)",
          elevated: "var(--surface-elevated)",
          dim: "var(--surface-dim)",
        },
        ink: {
          DEFAULT: "var(--ink)",
          soft: "var(--ink-soft)",
          faint: "var(--ink-faint)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          hover: "var(--primary-hover)",
          soft: "var(--primary-soft)",
          deep: "var(--primary-deep)",
          on: "var(--on-primary)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          soft: "var(--secondary-soft)",
        },
        rule: {
          DEFAULT: "var(--rule)",
          strong: "var(--rule-strong)",
        },
        danger: {
          DEFAULT: "var(--error)",
          soft: "var(--error-soft)",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)"],
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      borderRadius: {
        card: "8px",
        btn: "6px",
        input: "4px",
        pill: "9999px",
      },
      maxWidth: {
        container: "1280px",
      },
      boxShadow: {
        overlay: "0 4px 16px rgba(15, 31, 23, 0.08)",
      },
    },
  },
  plugins: [],
} satisfies Config;
