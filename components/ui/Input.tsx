import { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from "react";

interface FieldWrapperProps {
  label?: string;
  hint?: string;
  error?: string;
  htmlFor?: string;
  required?: boolean;
  children: React.ReactNode;
}

export function Field({ label, hint, error, htmlFor, required, children }: FieldWrapperProps) {
  return (
    <label className="flex flex-col gap-1.5" htmlFor={htmlFor}>
      {label && (
        <span className="font-mono text-xs font-medium uppercase tracking-wider text-ink-soft">
          {label}
          {required && <span className="text-danger ml-1">*</span>}
        </span>
      )}
      {children}
      {hint && !error && <span className="text-xs text-ink-faint">{hint}</span>}
      {error && <span className="text-xs text-danger">{error}</span>}
    </label>
  );
}

const inputBase =
  "w-full rounded-input border bg-surface-card px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-soft transition-colors";

export function Input({
  className = "",
  ...rest
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input className={`${inputBase} border-rule-strong ${className}`} {...rest} />
  );
}

export function Textarea({
  className = "",
  rows = 4,
  ...rest
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      rows={rows}
      className={`${inputBase} border-rule-strong resize-y ${className}`}
      {...rest}
    />
  );
}

export function Select({
  className = "",
  children,
  ...rest
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={`${inputBase} border-rule-strong appearance-none bg-[length:14px] bg-no-repeat bg-[position:calc(100%-12px)_center] pr-9 ${className}`}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='14' height='8' viewBox='0 0 14 8'><path d='M1 1l6 6 6-6' stroke='%233f4943' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/></svg>\")",
      }}
      {...rest}
    >
      {children}
    </select>
  );
}
