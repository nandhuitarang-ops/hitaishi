import { Shell } from "@/components/Shell";
import { Skeleton } from "@/components/ui";

export default function StudentProfileLoading() {
  return (
    <Shell
      role="student"
      active="profile"
      pageCode="S.09 — PROFILE & PLAN"
      pageTitle="Your profile"
      pageSubtitle="Manage personal details, plan, and notification preferences."
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5">
        {/* Personal info card */}
        <div className="bg-surface-card border border-rule rounded-card">
          <div className="px-5 pt-5 pb-3">
            <Skeleton className="h-3 w-24 mb-1" />
            <Skeleton className="h-5 w-20" />
          </div>
          <div className="px-5 pb-5 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20 rounded-pill" />
              <Skeleton className="h-6 w-20 rounded-pill" />
              <Skeleton className="h-6 w-20 rounded-pill" />
            </div>
            <Skeleton className="h-10 w-28" />
          </div>
        </div>

        {/* Plan card */}
        <div className="bg-surface-card border border-rule rounded-card">
          <div className="px-5 pt-5 pb-3">
            <Skeleton className="h-3 w-24 mb-1" />
            <Skeleton className="h-5 w-28" />
          </div>
          <div className="px-5 pb-5 space-y-2">
            <Skeleton className="h-8 w-36" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-10 w-full mt-4" />
          </div>
        </div>
      </div>

      {/* Notifications card */}
      <div className="bg-surface-card border border-rule rounded-card mt-5">
        <div className="px-5 pt-5 pb-3">
          <Skeleton className="h-3 w-24 mb-1" />
          <Skeleton className="h-5 w-24" />
        </div>
        <div className="px-5 pb-5 space-y-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-3 border-t border-rule first:border-t-0"
            >
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-5 w-10" />
            </div>
          ))}
        </div>
      </div>

      {/* Security card */}
      <div className="bg-surface-card border border-rule rounded-card mt-5">
        <div className="px-5 pt-5 pb-3">
          <Skeleton className="h-3 w-16 mb-1" />
          <Skeleton className="h-5 w-20" />
        </div>
        <div className="px-5 pb-5 flex gap-3">
          <Skeleton className="h-8 w-44" />
          <Skeleton className="h-8 w-36" />
          <Skeleton className="h-8 w-32" />
        </div>
      </div>
    </Shell>
  );
}