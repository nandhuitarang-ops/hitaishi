"use client";

/**
 * Role-specific decorative background elements for the login page.
 * Each role gets unique floating shapes, patterns, and accent colors.
 */

/* ───── STUDENT: Playful geometric shapes + dotted patterns ───── */
export function StudentDecorations() {
  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0" aria-hidden="true">
      {/* Ambient glows */}
      <div className="absolute -top-[200px] left-[15%] w-[500px] h-[500px] rounded-full bg-[var(--color-primary)]/8 blur-[120px]" />
      <div className="absolute -bottom-[200px] right-[10%] w-[500px] h-[500px] rounded-full bg-amber-400/6 blur-[120px]" />

      {/* Top-left dotted block */}
      <div className="absolute top-[15%] left-[6%] hidden lg:block">
        <div className="w-20 h-32 rounded-2xl bg-primary-soft/40 border border-primary/10 flex flex-wrap gap-2 p-3">
          {Array.from({ length: 15 }).map((_, i) => (
            <span key={i} className="w-2 h-2 rounded-full bg-primary/25" />
          ))}
        </div>
      </div>

      {/* Bottom-left notebook lines */}
      <div className="absolute bottom-[18%] left-[8%] hidden lg:block">
        <div className="w-24 h-20 rounded-xl bg-white/60 border border-rule shadow-soft p-3 flex flex-col gap-2">
          <div className="h-1 w-full rounded bg-primary/20" />
          <div className="h-1 w-3/4 rounded bg-primary/15" />
          <div className="h-1 w-full rounded bg-primary/10" />
          <div className="h-1 w-1/2 rounded bg-secondary/15" />
        </div>
      </div>

      {/* Top-right floating formulas */}
      <div className="absolute top-[12%] right-[7%] hidden lg:block">
        <div className="font-mono text-xs text-ink-faint/30 space-y-1.5 text-right">
          <div>E = mc²</div>
          <div>∫ f(x)dx</div>
          <div>F = ma</div>
        </div>
      </div>

      {/* Right wavy line */}
      <svg className="absolute right-[5%] top-[35%] hidden xl:block w-16 h-32 text-primary/15" fill="none" viewBox="0 0 60 120">
        <path d="M30,0 C50,20 10,40 30,60 C50,80 10,100 30,120" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>

      {/* Bottom-right pencil/ruler icon */}
      <div className="absolute bottom-[12%] right-[8%] hidden lg:block">
        <div className="w-16 h-16 rounded-xl bg-secondary-soft/50 border border-secondary/15 flex items-center justify-center">
          <svg className="w-7 h-7 text-secondary/50" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
          </svg>
        </div>
      </div>

      {/* Floating circles */}
      <div className="absolute top-[40%] left-[12%] hidden xl:block">
        <div className="w-5 h-5 rounded-full bg-secondary/20 animate-bounce" style={{ animationDuration: "3s" }} />
      </div>
      <div className="absolute top-[55%] right-[12%] hidden xl:block">
        <div className="w-3 h-3 rounded-full bg-primary/25 animate-bounce" style={{ animationDuration: "4s", animationDelay: "1s" }} />
      </div>
    </div>
  );
}

/* ───── MENTOR: Professional geometric patterns + knowledge icons ───── */
export function MentorDecorations() {
  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0" aria-hidden="true">
      {/* Ambient glows */}
      <div className="absolute -top-[200px] right-[20%] w-[500px] h-[500px] rounded-full bg-blue-400/6 blur-[120px]" />
      <div className="absolute -bottom-[200px] left-[15%] w-[500px] h-[500px] rounded-full bg-violet-400/5 blur-[120px]" />

      {/* Top-left hexagonal pattern */}
      <div className="absolute top-[12%] left-[5%] hidden lg:block">
        <svg className="w-24 h-24 text-primary/10" viewBox="0 0 100 100" fill="currentColor">
          <polygon points="50,5 93,25 93,65 50,85 7,65 7,25" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <polygon points="50,20 75,32 75,56 50,68 25,56 25,32" fill="currentColor" opacity="0.15" />
        </svg>
      </div>

      {/* Bottom-left connected nodes */}
      <div className="absolute bottom-[15%] left-[7%] hidden lg:block">
        <svg className="w-28 h-20 text-primary/15" viewBox="0 0 120 80" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="20" cy="20" r="6" fill="var(--color-primary-soft)" />
          <circle cx="60" cy="50" r="8" fill="var(--color-secondary-soft)" />
          <circle cx="100" cy="25" r="5" fill="var(--color-primary-soft)" />
          <line x1="26" y1="23" x2="52" y2="47" />
          <line x1="68" y1="47" x2="95" y2="28" />
        </svg>
      </div>

      {/* Top-right lightbulb card */}
      <div className="absolute top-[14%] right-[6%] hidden lg:block">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200/50 flex items-center justify-center shadow-soft">
          <svg className="w-7 h-7 text-amber-500/60" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
          </svg>
        </div>
      </div>

      {/* Right side: vertical stat bars */}
      <div className="absolute right-[7%] bottom-[20%] hidden lg:flex gap-1.5 items-end">
        {[40, 60, 35, 55, 70].map((h, i) => (
          <div
            key={i}
            className="w-3 rounded-t-sm bg-primary/15"
            style={{ height: `${h}px` }}
          />
        ))}
      </div>

      {/* Floating shapes */}
      <div className="absolute top-[45%] left-[10%] hidden xl:block">
        <div className="w-4 h-4 rotate-45 bg-primary/15 animate-pulse" style={{ animationDuration: "4s" }} />
      </div>
      <div className="absolute top-[60%] right-[10%] hidden xl:block">
        <div className="w-6 h-6 rounded-full border-2 border-dashed border-primary/15 animate-spin" style={{ animationDuration: "12s" }} />
      </div>
    </div>
  );
}

/* ───── ADMIN: Dashboard-style analytics + gear patterns ───── */
export function AdminDecorations() {
  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0" aria-hidden="true">
      {/* Ambient glows */}
      <div className="absolute -top-[200px] left-[30%] w-[500px] h-[500px] rounded-full bg-slate-400/6 blur-[120px]" />
      <div className="absolute -bottom-[200px] right-[25%] w-[500px] h-[500px] rounded-full bg-indigo-400/5 blur-[120px]" />

      {/* Top-left gear icon */}
      <div className="absolute top-[12%] left-[6%] hidden lg:block">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center shadow-soft">
          <svg className="w-7 h-7 text-slate-400 animate-spin" style={{ animationDuration: "20s" }} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
        </div>
      </div>

      {/* Bottom-left mini dashboard */}
      <div className="absolute bottom-[14%] left-[6%] hidden lg:block">
        <div className="w-28 h-20 rounded-xl bg-white/70 border border-rule shadow-soft p-3 flex flex-col gap-1.5">
          <div className="flex gap-1 items-end h-8">
            {[12, 18, 8, 22, 15, 20].map((h, i) => (
              <div key={i} className="flex-1 rounded-t-sm" style={{
                height: `${h}px`,
                backgroundColor: i % 2 === 0 ? "var(--color-primary)" : "var(--color-secondary)",
                opacity: 0.3,
              }} />
            ))}
          </div>
          <div className="h-0.5 w-full bg-rule/50" />
          <div className="flex justify-between">
            <div className="h-1 w-8 rounded bg-ink-faint/15" />
            <div className="h-1 w-5 rounded bg-ink-faint/10" />
          </div>
        </div>
      </div>

      {/* Top-right shield icon */}
      <div className="absolute top-[13%] right-[6%] hidden lg:block">
        <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary-soft)]/20 border border-[var(--color-primary)]/30 flex items-center justify-center shadow-soft">
          <svg className="w-7 h-7 text-[var(--color-primary)]/50" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
          </svg>
        </div>
      </div>

      {/* Right: users/activity dots */}
      <div className="absolute right-[7%] bottom-[18%] hidden lg:block">
        <div className="flex -space-x-2">
          {["bg-primary/30", "bg-secondary/30", "bg-[var(--color-primary)]/30", "bg-amber-500/30"].map((bg, i) => (
            <div key={i} className={`w-8 h-8 rounded-full ${bg} border-2 border-white flex items-center justify-center`}>
              <span className="text-[8px] font-bold text-white/80">{String.fromCharCode(65 + i)}</span>
            </div>
          ))}
          <div className="w-8 h-8 rounded-full bg-surface-elevated border-2 border-white flex items-center justify-center">
            <span className="text-[8px] font-medium text-ink-faint">+12</span>
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute top-[42%] left-[11%] hidden xl:block">
        <div className="w-3 h-3 rounded-full bg-slate-300/40 animate-ping" style={{ animationDuration: "3s" }} />
      </div>
      <div className="absolute top-[55%] right-[11%] hidden xl:block">
        <div className="w-2.5 h-2.5 rounded-sm bg-indigo-300/30 rotate-45 animate-pulse" style={{ animationDuration: "5s" }} />
      </div>
    </div>
  );
}

export function RoleDecorations({ role }: { role: "student" | "mentor" | "admin" }) {
  switch (role) {
    case "mentor":
      return <MentorDecorations />;
    case "admin":
      return <AdminDecorations />;
    default:
      return <StudentDecorations />;
  }
}
