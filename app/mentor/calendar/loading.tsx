import { Shell } from "@/components/Shell";
import { Skeleton } from "@/components/ui";

export default function Loading() {
  return (
    <Shell role="mentor" active="calendar" pageCode="M.07" pageTitle="Loading...">
      <div className="bg-surface-card border border-rule rounded-card p-6">
        <Skeleton className="h-4 w-48 mb-4" />
        <div className="grid grid-cols-3 gap-4 mb-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <Skeleton className="h-48" />
      </div>
    </Shell>
  );
}