import { Shell } from "@/components/Shell";
import { Skeleton } from "@/components/ui";

export default function StudentDashboardLoading() {
  return (
    <Shell
      role="student"
      active="dashboard"
      pageCode="S.03 — LOADING"
      pageTitle="Loading..."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-surface-card border border-rule rounded-card p-5">
          <Skeleton className="h-3 w-24 mb-4" />
          <Skeleton className="h-6 w-48 mb-3" />
          <div className="flex gap-4 mt-4">
            <Skeleton className="h-14 w-14 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-40" />
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-3 w-full" />
            </div>
          </div>
        </div>
        <div className="bg-surface-card border border-rule rounded-card p-5">
          <Skeleton className="h-3 w-20 mb-4" />
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-3 w-full mb-4" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5">
        <div className="lg:col-span-2 bg-surface-card border border-rule rounded-card p-5">
          <Skeleton className="h-3 w-32 mb-4" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-t border-rule first:border-t-0">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-6 w-20" />
            </div>
          ))}
        </div>
        <div className="bg-surface-card border border-rule rounded-card p-5">
          <Skeleton className="h-3 w-28 mb-4" />
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full mb-2" />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-surface-card border border-rule rounded-card p-5">
            <Skeleton className="h-3 w-24 mb-3" />
            <Skeleton className="h-8 w-12" />
          </div>
        ))}
      </div>
    </Shell>
  );
}
