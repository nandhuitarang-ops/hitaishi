import { Shell } from "@/components/Shell";
import { Skeleton } from "@/components/ui";

export default function StudentDoubtsLoading() {
  return (
    <Shell
      role="student"
      active="doubts"
      pageCode="S.06 — DOUBT QUEUE"
      pageTitle="Resolve your concepts"
      pageSubtitle="Ask anything in plain English. Average mentor response: 2 hours."
    >
      {/* Ask a new doubt card */}
      <div className="bg-surface-card border border-rule rounded-card mb-6">
        <div className="px-5 pt-5 pb-3">
          <Skeleton className="h-3 w-28 mb-1" />
          <Skeleton className="h-5 w-44" />
        </div>
        <div className="px-5 pb-5">
          <div className="grid md:grid-cols-2 gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <div className="md:col-span-2">
              <Skeleton className="h-24 w-full" />
            </div>
            <div className="md:col-span-2 flex items-center justify-between">
              <div className="flex gap-3">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
              <Skeleton className="h-8 w-32" />
            </div>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-2 mb-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-24 rounded-pill" />
        ))}
      </div>

      {/* Doubt list */}
      <div className="grid gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-surface-card border border-rule rounded-card p-5"
          >
            <div className="flex items-start gap-4">
              <div className="flex-1 min-w-[260px]">
                <div className="flex items-center gap-2 mb-3">
                  <Skeleton className="h-6 w-20 rounded-pill" />
                  <Skeleton className="h-6 w-28 rounded-pill" />
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <Skeleton className="h-8 w-28 shrink-0" />
            </div>
          </div>
        ))}
      </div>
    </Shell>
  );
}