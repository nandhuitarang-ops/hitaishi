import { Shell } from "@/components/Shell";
import { Skeleton } from "@/components/ui";

export default function AdminMatchLoading() {
  return (
    <Shell role="admin" active="students" pageCode="A.03 — MATCH MENTOR" pageTitle="Match mentor" pageSubtitle="Loading available mentors...">
      <div className="bg-surface-card border border-rule rounded-card mb-5 p-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div><Skeleton className="h-4 w-32 mb-1" /><Skeleton className="h-3 w-48" /></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-surface-card border border-rule rounded-card p-5">
            <div className="flex items-start gap-3 mb-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="min-w-0">
                <Skeleton className="h-4 w-28 mb-1" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
            <Skeleton className="h-3 w-48 mb-3" />
            <div className="flex flex-wrap gap-1.5 mb-3">
              <Skeleton className="h-4 w-12 rounded-pill" />
              <Skeleton className="h-4 w-14 rounded-pill" />
            </div>
            <div className="mt-auto pt-3 border-t border-rule">
              <div className="flex items-center justify-between mb-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-6" />
              </div>
              <Skeleton className="h-9 w-full rounded-btn" />
            </div>
          </div>
        ))}
      </div>
    </Shell>
  );
}
