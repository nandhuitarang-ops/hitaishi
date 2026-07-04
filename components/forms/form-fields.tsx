"use client";

import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";

interface FieldShellProps {
  label: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  hint?: string;
}

export function FieldShell({ label, error, required, children, hint }: FieldShellProps) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-fg)]">
        {label}
        {required && <span className="ml-1 text-[var(--color-sky)]">*</span>}
      </span>
      {children}
      {hint && !error && (
        <span className="mt-1 block text-xs text-[var(--color-fg-subtle)]">{hint}</span>
      )}
      {error && (
        <span className="mt-1 block text-xs text-red-600">{error}</span>
      )}
    </label>
  );
}

const INPUT_BASE =
  "mt-2 block w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-solid)] px-4 py-3 text-base text-[var(--color-fg)] placeholder:text-[var(--color-fg-subtle)] focus:border-[var(--color-sky)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sky)]/30 transition";

export const TextInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function TextInput(props, ref) {
    return <input ref={ref} className={INPUT_BASE} {...props} />;
  }
);

export const TextArea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function TextArea(props, ref) {
    return <textarea ref={ref} rows={4} className={INPUT_BASE} {...props} />;
  }
);

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function Select(props, ref) {
    return <select ref={ref} className={INPUT_BASE} {...props} />;
  }
);

interface CheckGroupProps {
  options: ReadonlyArray<{ value: string; label: string }>;
  value: string[];
  onChange: (next: string[]) => void;
  error?: string;
  columns?: number;
}

export function CheckGroup({ options, value, onChange, error, columns = 2 }: CheckGroupProps) {
  const toggle = (v: string) => {
    if (value.includes(v)) onChange(value.filter((x) => x !== v));
    else onChange([...value, v]);
  };
  return (
    <div>
      <div
        className="mt-2 grid gap-2"
        style={{
          // Auto-fit ensures small phones get 2 cols and wider screens scale up
          // to the requested `columns` max — no manual breakpoint juggling.
          gridTemplateColumns: `repeat(auto-fit, minmax(min(140px, 100%), 1fr))`,
          gridAutoFlow: "row",
          // Cap effective columns at `columns` on wide screens.
          maxWidth: columns >= 3 ? "none" : `calc(${columns} * 240px + ${columns - 1} * 0.5rem)`,
        }}
      >
        {options.map((opt) => {
          const active = value.includes(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggle(opt.value)}
              className={`min-h-[44px] rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${
                active
                  ? "border-[var(--color-sky)] bg-[var(--color-sky-soft)] text-[var(--color-fg)]"
                  : "border-[var(--color-border)] bg-[var(--color-surface-solid)] text-[var(--color-fg-muted)] hover:border-[var(--color-sky)]/50"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </div>
  );
}
