import { Shell } from "@/components/Shell";
import { Skeleton } from "@/components/ui";

export default function MentorDoubtsLoading() {
  return (
    <Shell
      role="mentor"
      active="doubts"
      pageCode="M.06 — DOUBT INBOX"
      pageTitle="Doubt inbox"
      pageSubtitle="Claim a doubt to lock it for 30 minutes while you write the answer."
    >
      {/* Tab bar */}
      <div className="flex gap-2 mb-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-40 rounded-pill" />
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
              <Skeleton className="h-10 w-10 rounded-full shrink-0" />
              <div className="flex-1 min-w-[260px]">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-20 rounded-pill" />
                  <Skeleton className="h-6 w-20 rounded-pill" />
                  <div className="ml-auto">
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-32" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats cards */}
      <div className="mt-8 grid md:grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-surface-card border border-rule rounded-card p-5 text-center"
          >
            <Skeleton className="h-3 w-28 mx-auto mb-2" />
            <Skeleton className="h-8 w-16 mx-auto" />
          </div>
        ))}
      </div>
    </Shell>
  );
}