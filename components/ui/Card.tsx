import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ className = "", children, ...rest }: CardProps) {
  return (
    <div
      className={`bg-surface-card border border-rule rounded-card ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title?: string;
  meta?: string;
  action?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export function CardHeader({
  title,
  meta,
  action,
  className = "",
  children,
}: CardHeaderProps) {
  return (
    <div
      className={`px-5 py-4 bg-surface-elevated border-b border-rule rounded-t-card flex items-center justify-between gap-3 ${className}`}
    >
      <div className="min-w-0">
        {meta && <div className="meta">{meta}</div>}
        {title && (
          <h3 className="font-serif text-lg leading-tight mt-0.5">{title}</h3>
        )}
        {children}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

export function CardBody({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={`p-5 ${className}`}>{children}</div>;
}
