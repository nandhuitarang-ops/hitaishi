interface Step {
  label: string;
}

interface StepperProps {
  steps: Step[];
  current: number;
  className?: string;
}

export function Stepper({ steps, current, className = "" }: StepperProps) {
  return (
    <ol className={`flex items-center gap-2 ${className}`}>
      {steps.map((step, idx) => {
        const isDone = idx < current;
        const isActive = idx === current;
        return (
          <li key={step.label} className="flex items-center gap-2 flex-1">
            <div
              className={`flex items-center gap-2 w-full ${
                isDone || isActive ? "" : "opacity-50"
              }`}
            >
              <span
                className={`w-7 h-7 flex items-center justify-center rounded-pill font-mono text-xs font-medium border ${
                  isActive
                    ? "bg-primary text-primary-on border-primary"
                    : isDone
                      ? "bg-primary-soft text-primary-deep border-primary-soft"
                      : "bg-surface-card text-ink-faint border-rule-strong"
                }`}
                aria-current={isActive ? "step" : undefined}
              >
                {isDone ? "✓" : idx + 1}
              </span>
              <span
                className={`text-xs font-mono uppercase tracking-wider ${
                  isActive ? "text-primary-deep font-medium" : "text-ink-soft"
                }`}
              >
                {step.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <span
                className="hidden md:block flex-1 h-px bg-rule"
                aria-hidden
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
