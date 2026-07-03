import { Shell } from "@/components/Shell";
import { Skeleton } from "@/components/ui";

export default function MentorDashboardLoading() {
  return (
    <Shell
      role="mentor"
      active="dashboard"
      pageCode="M.03 — LOADING"
      pageTitle="Loading..."
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-surface-card border border-rule rounded-card p-5">
            <Skeleton className="h-3 w-20 mb-3" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-5">
        <div className="flex flex-col gap-5">
          <div className="bg-surface-card border border-rule rounded-card p-5">
            <Skeleton className="h-4 w-48 mb-4" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 py-3 border-t border-rule first:border-t-0">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
            ))}
          </div>

          <div className="bg-surface-card border border-rule rounded-card p-5">
            <Skeleton className="h-4 w-40 mb-4" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-t border-rule first:border-t-0">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-6 w-20" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="bg-surface-card border border-rule rounded-card p-5">
            <Skeleton className="h-4 w-32 mb-4" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-t border-rule first:border-t-0">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
            <Skeleton className="h-10 w-full mt-4" />
          </div>
        </div>
      </div>
    </Shell>
  );
}
