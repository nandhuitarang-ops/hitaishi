import { Shell } from "@/components/Shell";
import { Skeleton } from "@/components/ui";

export default function StudentResourcesLoading() {
  return (
    <Shell
      role="student"
      active="resources"
      pageCode="S.07 — RESOURCES LIBRARY"
      pageTitle="Resources"
      pageSubtitle="Curated by your mentors. Filter by subject or recency."
      actions={<Skeleton className="h-9 w-64 rounded-input" />}
    >
      {/* Filter bar */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-5">
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-24 rounded-pill" />
          ))}
        </div>
        <Skeleton className="h-9 w-36 rounded-input" />
      </div>

      {/* Resource list */}
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
                  <Skeleton className="h-6 w-16 rounded-pill" />
                  <Skeleton className="h-4 w-14" />
                </div>
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <div className="flex items-center gap-2 mt-2">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
              <Skeleton className="h-8 w-20 shrink-0" />
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 flex flex-col items-center gap-3">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-8 w-40" />
      </div>
    </Shell>
  );
}