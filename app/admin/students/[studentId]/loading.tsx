import { Shell } from "@/components/Shell";
import { Skeleton } from "@/components/ui";

export default function AdminStudentProfileLoading() {
  return (
    <Shell role="admin" active="students" pageCode="A.03 — STUDENT PROFILE" pageTitle="Loading..." pageSubtitle="">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-1 space-y-5">
          <div className="bg-surface-card border border-rule rounded-card p-6">
            <div className="flex flex-col items-center text-center">
              <Skeleton className="h-20 w-20 rounded-full mb-4" />
              <Skeleton className="h-6 w-32 mb-1" />
              <Skeleton className="h-4 w-48 mb-1" />
              <Skeleton className="h-5 w-16 rounded-pill mt-2" />
            </div>
            <div className="mt-6 pt-6 border-t border-rule space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-surface-card border border-rule rounded-card p-5">
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-3 w-56" />
          </div>
          <div className="bg-surface-card border border-rule rounded-card p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Skeleton className="h-6 w-40 mb-1" />
                <Skeleton className="h-4 w-72 mb-1" />
                <Skeleton className="h-3 w-56" />
              </div>
              <Skeleton className="h-10 w-32 rounded-btn" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-card border border-rule rounded-card p-5">
              <Skeleton className="h-3 w-24 mb-3" />
              <Skeleton className="h-10 w-12" />
            </div>
            <div className="bg-surface-card border border-rule rounded-card p-5">
              <Skeleton className="h-3 w-24 mb-3" />
              <Skeleton className="h-10 w-12" />
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
