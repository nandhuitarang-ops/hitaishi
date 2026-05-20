import { ReactNode } from "react";

type Tone = "primary" | "coral" | "warn" | "error" | "neutral";

const toneClasses: Record<Tone, string> = {
  primary: "bg-primary-soft text-primary-deep",
  coral: "bg-secondary-soft text-[#74240a]",
  warn: "bg-[#fff2c5] text-[#6b4f00]",
  error: "bg-danger-soft text-[#93000a]",
  neutral: "bg-surface-elevated text-ink-soft",
};

interface PillProps {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}

export function Pill({ tone = "primary", children, className = "" }: PillProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-pill font-mono text-[10px] font-medium uppercase tracking-wider ${toneClasses[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
