import { Shell } from "@/components/Shell";
import { Skeleton } from "@/components/ui";

export default function AdminSessionsLoading() {
  return (
    <Shell
      role="admin"
      active="sessions"
      pageCode="A.05 — SESSION MONITOR"
      pageTitle="Session monitor"
      pageSubtitle="Live oversight of in-progress sessions, with TOS-disclosed silent observe."
      actions={<Skeleton className="h-9 w-72 rounded-input" />}
    >
      {/* Stats bar */}
      <div className="bg-surface-card border border-rule rounded-card mb-6">
        <div className="p-5 flex flex-wrap items-center gap-6">
          <div>
            <Skeleton className="h-3 w-24 mb-2" />
            <Skeleton className="h-8 w-12" />
          </div>
          <div>
            <Skeleton className="h-3 w-20 mb-2" />
            <Skeleton className="h-8 w-12" />
          </div>
          <div>
            <Skeleton className="h-3 w-28 mb-2" />
            <Skeleton className="h-8 w-12" />
          </div>
          <div className="ml-auto">
            <Skeleton className="h-7 w-36 rounded-pill" />
          </div>
        </div>
      </div>

      {/* Live now section */}
      <Skeleton className="h-4 w-20 mb-3" />
      <div className="grid gap-3 mb-8">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="bg-surface-card border border-rule rounded-card p-5"
          >
            <div className="flex items-start gap-4">
              <div className="flex-1 min-w-[260px]">
                <div className="flex items-center gap-3 mb-2">
                  <Skeleton className="h-6 w-16 rounded-pill" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-6 w-24 rounded-pill" />
                </div>
                <Skeleton className="h-5 w-3/4 mb-2" />
                <div className="flex items-center gap-3">
                  <Skeleton className="h-7 w-7 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
              <Skeleton className="h-8 w-36 shrink-0" />
            </div>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <Skeleton className="h-4 w-96 mb-8" />

      {/* Flagged conversations */}
      <div className="bg-surface-card border border-rule rounded-card mb-6">
        <div className="px-5 pt-5 pb-3">
          <Skeleton className="h-3 w-36 mb-1" />
          <Skeleton className="h-5 w-24" />
        </div>
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between px-5 py-3 border-t border-rule"
          >
            <div>
              <Skeleton className="h-4 w-48 mb-1" />
              <Skeleton className="h-3 w-40" />
            </div>
            <Skeleton className="h-7 w-20" />
          </div>
        ))}
      </div>

      {/* Recent recordings */}
      <div className="bg-surface-card border border-rule rounded-card">
        <div className="px-5 pt-5 pb-3">
          <Skeleton className="h-3 w-28 mb-1" />
          <Skeleton className="h-5 w-28" />
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between px-5 py-3 border-t border-rule"
          >
            <div>
              <Skeleton className="h-4 w-56 mb-1" />
              <Skeleton className="h-3 w-44" />
            </div>
            <Skeleton className="h-7 w-20" />
          </div>
        ))}
      </div>
    </Shell>
  );
}