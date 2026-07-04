import type { Metadata } from "next";
import { Shell } from "@/components/Shell";
import { Card, LinkButton } from "@/components/ui";
import { initials } from "@/lib/format";
import { requireRole } from "@/lib/session";
import { getStudentsList } from "@/lib/admin-cache";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Students — Hitaishi Admin",
  robots: "noindex, nofollow",
};

const PAGE_SIZE = 25;

export default async function AdminStudentsPage(props: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const user = await requireRole("admin");

  const params = await props.searchParams;
  const page = Math.max(1, parseInt(params.page || "1", 10));
  const search = params.q || "";
  const offset = (page - 1) * PAGE_SIZE;

  const { rows, total } = await getStudentsList(PAGE_SIZE, offset, search || undefined);

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const filters = [{ key: "all", label: "All", count: total }];

  const pageUrl = (p: number) => {
    const sp = new URLSearchParams();
    sp.set("page", String(p));
    if (search) sp.set("q", search);
    return `/admin/students?${sp.toString()}`;
  };

  const startItem = total === 0 ? 0 : offset + 1;
  const endItem = Math.min(offset + rows.length, total);

  return (
    <Shell
      role="admin"
      active="students"
      pageCode="A.03 — STUDENTS MANAGEMENT"
      pageTitle="Students"
      pageSubtitle="Filter, search, and act on the full student roster."
      user={user}
      actions={
        <div className="flex items-center gap-2">
          <form method="GET" action="/admin/students" role="search">
            <input
              name="q"
              defaultValue={search}
              placeholder="Search name, email, phone…"
              className="rounded-input border border-rule-strong px-3 py-2 text-sm w-72 focus:outline-none focus:border-primary"
            />
            <input type="hidden" name="page" value="1" />
          </form>
          <button className="chip-cta">+ Add manually</button>
        </div>
      }
    >
      <div className="flex flex-wrap gap-2 mb-5">
        {filters.map((f, i) => (
          <button
            key={f.key}
            className={`px-4 py-2 rounded-pill text-sm flex items-center gap-2 ${
              i === 0
                ? "bg-primary text-primary-on"
                : "bg-surface-card border border-rule text-ink-soft hover:bg-surface-elevated"
            }`}
          >
            {f.label}
            <span className="font-mono text-xs opacity-70">{f.count}</span>
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="meta">0 selected</div>
        <div className="flex items-center gap-2">
          <button className="chip-ghost text-xs">Message selected</button>
          <button className="chip-ghost text-xs">Export CSV</button>
        </div>
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-elevated border-b border-rule">
              <th className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-wider text-ink-soft">
                <input type="checkbox" />
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-wider text-ink-soft">
                Student
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-wider text-ink-soft hidden lg:table-cell">
                Mentor
              </th>
              <th className="px-4 py-3 text-right text-[11px] font-mono uppercase tracking-wider text-ink-soft">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-ink-faint italic">
                  {search ? "No students match your search" : "No data yet"}
                </td>
              </tr>
            ) : (
              rows.map((s) => {
                const name = s.fullName ?? s.email.split("@")[0];
                return (
                  <tr key={s.id} className="border-b border-rule last:border-0 hover:bg-surface-elevated/60">
                    <td className="px-4 py-3"><input type="checkbox" /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="avatar !w-8 !h-8 !text-xs">{initials(name)}</div>
                        <div>
                          <div className="font-medium">{name}</div>
                          <div className="meta">{s.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-ink-soft">{s.mentorName ?? "—"}</td>
                    <td className="px-4 py-3 text-right">
                      <LinkButton href={`/admin/students/${s.id}`} variant="ghost" size="sm">Open</LinkButton>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </Card>

      <div className="flex items-center justify-between mt-5">
        <div className="meta">
          {total === 0 ? "No results" : `Showing ${startItem}–${endItem} of ${total}`}
        </div>
        <div className="flex items-center gap-2">
          {page > 1 ? (
            <LinkButton href={pageUrl(page - 1)} variant="ghost" size="sm">
              ← Prev
            </LinkButton>
          ) : (
            <span className="chip-ghost opacity-40 cursor-not-allowed">← Prev</span>
          )}
          <span className="meta">Page {page} / {totalPages || 1}</span>
          {page < totalPages ? (
            <LinkButton href={pageUrl(page + 1)} variant="ghost" size="sm">
              Next →
            </LinkButton>
          ) : (
            <span className="chip-ghost opacity-40 cursor-not-allowed">Next →</span>
          )}
        </div>
      </div>
    </Shell>
  );
}
