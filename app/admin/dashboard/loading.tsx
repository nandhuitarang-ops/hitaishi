import { Shell } from "@/components/Shell";
import { Skeleton } from "@/components/ui";

export default function AdminDashboardLoading() {
  return (
    <Shell
      role="admin"
      active="dashboard"
      pageCode="A.02 — MASTER DASHBOARD"
      pageTitle="Control room"
      pageSubtitle="System health, alerts, and recent admin activity at a glance."
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-surface-card border border-rule rounded-card p-5">
            <Skeleton className="h-3 w-24 mb-3" />
            <Skeleton className="h-9 w-20 mb-2" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5">
        <div className="flex flex-col gap-5">
          <div className="bg-surface-card border border-rule rounded-card">
            <div className="px-5 py-4 border-b border-rule">
              <Skeleton className="h-4 w-36" />
            </div>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-4 border-t border-rule first:border-t-0">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-5 w-12 rounded-pill" />
                  <Skeleton className="h-4 w-56" />
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <div className="bg-surface-card border border-rule rounded-card">
            <div className="px-5 py-4 border-b border-rule">
              <Skeleton className="h-4 w-40" />
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-5 py-3 border-t border-rule first:border-t-0">
                <Skeleton className="h-4 w-48 mb-1" />
                <Skeleton className="h-3 w-24" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}
