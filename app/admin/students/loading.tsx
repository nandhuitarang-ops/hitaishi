import { Shell } from "@/components/Shell";
import { Skeleton } from "@/components/ui";

export default function AdminStudentsLoading() {
  return (
    <Shell
      role="admin"
      active="students"
      pageCode="A.03 — STUDENTS MANAGEMENT"
      pageTitle="Students"
      pageSubtitle="Filter, search, and act on the full student roster."
    >
      <div className="flex flex-wrap gap-2 mb-5">
        <Skeleton className="h-9 w-24 rounded-pill" />
      </div>

      <div className="bg-surface-card border border-rule rounded-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-elevated border-b border-rule">
              <th className="px-4 py-3 w-10"><Skeleton className="h-4 w-4" /></th>
              <th className="px-4 py-3"><Skeleton className="h-4 w-20" /></th>
              <th className="px-4 py-3 hidden lg:table-cell"><Skeleton className="h-4 w-20" /></th>
              <th className="px-4 py-3 text-right"><Skeleton className="h-4 w-16 ml-auto" /></th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 8 }).map((_, i) => (
              <tr key={i} className="border-b border-rule last:border-0">
                <td className="px-4 py-3"><Skeleton className="h-4 w-4" /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-32 mb-1" />
                      <Skeleton className="h-3 w-40" />
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell"><Skeleton className="h-4 w-24" /></td>
                <td className="px-4 py-3 text-right"><Skeleton className="h-6 w-16 ml-auto" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Shell>
  );
}
