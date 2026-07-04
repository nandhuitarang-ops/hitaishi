
export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-surface transition-opacity duration-300">
      <div className="flex flex-col items-center gap-6">
        {/* Orbiting Ring Loader */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          {/* Outer glowing ripple */}
          <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping opacity-75" />
          {/* Main rotating ring */}
          <div className="w-12 h-12 rounded-full border-2 border-t-primary border-r-primary/30 border-b-transparent border-l-transparent animate-spin" />
          {/* Inner reverse-spinning ring */}
          <div className="absolute w-6 h-6 rounded-full border border-t-secondary border-r-transparent border-b-transparent border-l-secondary/40 animate-[spin_1s_infinite_linear_reverse]" />
        </div>

        {/* Elegant Logo / Loading Text */}
        <div className="text-center">
          <h2 className="font-serif italic text-2xl font-semibold text-primary tracking-wide animate-pulse">
            Hitaishi
          </h2>
          <p className="font-mono text-[9px] text-ink-soft tracking-widest uppercase mt-2.5">
            Securing Connection...
          </p>
        </div>
      </div>
    </div>
  );
}
