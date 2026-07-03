import { Shell } from "@/components/Shell";
import { Skeleton } from "@/components/ui";

export default function AdminMentorsLoading() {
  return (
    <Shell role="admin" active="mentors" pageCode="A.04 — MENTORS MANAGEMENT" pageTitle="Mentors" pageSubtitle="Verification queue and active mentor roster.">
      <div className="bg-surface-card border border-rule rounded-card mb-6">
        <div className="px-5 py-4 border-b border-rule">
          <Skeleton className="h-4 w-48" />
        </div>
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="px-5 py-5 border-t border-rule first:border-t-0">
            <div className="flex flex-wrap items-start gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 min-w-0">
                <Skeleton className="h-5 w-40 mb-2" />
                <Skeleton className="h-3 w-56 mb-1" />
                <Skeleton className="h-3 w-32 mb-3" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-14 rounded-pill" />
                  <Skeleton className="h-5 w-16 rounded-pill" />
                  <Skeleton className="h-5 w-20 rounded-pill" />
                  <Skeleton className="h-5 w-16 rounded-pill" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-surface-card border border-rule rounded-card overflow-x-auto">
        <div className="px-5 py-4 border-b border-rule">
          <Skeleton className="h-4 w-40" />
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-elevated border-b border-rule">
              {Array.from({ length: 7 }).map((_, i) => (
                <th key={i} className="px-4 py-3"><Skeleton className="h-3 w-16" /></th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-b border-rule last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div><Skeleton className="h-4 w-28 mb-1" /><Skeleton className="h-3 w-40" /></div>
                  </div>
                </td>
                {Array.from({ length: 6 }).map((_, j) => (
                  <td key={j} className="px-4 py-3"><Skeleton className="h-3 w-12" /></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Shell>
  );
}
