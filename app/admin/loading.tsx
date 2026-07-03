import { Shell } from "@/components/Shell";
import { Skeleton } from "@/components/ui";

export default function AdminLoading() {
  return (
    <Shell
      role="admin"
      active="dashboard"
      pageCode="A.00 — LOADING"
      pageTitle="Loading..."
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-surface-card border border-rule rounded-card p-5">
            <Skeleton className="h-3 w-20 mb-3" />
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-3 w-28" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5">
        <div className="flex flex-col gap-5">
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
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full mb-2" />
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}
