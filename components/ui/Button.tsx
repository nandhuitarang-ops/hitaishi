import Link from "next/link";
import { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary: "bg-primary text-primary-on hover:bg-primary-hover",
  secondary: "bg-primary-soft text-primary-deep hover:bg-[#c5dccd]",
  ghost:
    "bg-transparent text-primary-deep border border-rule-strong hover:bg-primary-soft",
  danger: "bg-danger text-white hover:bg-[#93000a]",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2.5 text-base",
};

interface BaseProps {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
}

interface ButtonProps
  extends BaseProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> {
  loading?: boolean;
}

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={`animate-spin h-4 w-4 flex-shrink-0 ${className ?? ""}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  loading = false,
  children,
  ...rest
}: ButtonProps) {
  const isDisabled = rest.disabled || loading;
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-medium rounded-btn transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...rest}
      disabled={isDisabled}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}

interface LinkButtonProps extends BaseProps {
  href: string;
  target?: string;
  rel?: string;
}

export function LinkButton({
  variant = "primary",
  size = "md",
  className = "",
  href,
  target,
  rel,
  children,
}: LinkButtonProps) {
  return (
    <Link
      href={href}
      target={target}
      rel={rel}
      className={`inline-flex items-center justify-center gap-2 font-medium rounded-btn transition-colors ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </Link>
  );
}
