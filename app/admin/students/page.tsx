import { Shell } from "@/components/Shell";
import { Card, LinkButton } from "@/components/ui";
import { initials } from "@/lib/format";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/session";
import {
  users,
  profiles,
  assignments,
} from "@/db/schema";
import { and, count, desc, eq, isNull, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

const STUDENT_LIMIT = 50;

export default async function AdminStudentsPage() {
  await requireRole("admin");

  const studentBase = and(eq(users.role, "student"), isNull(users.deletedAt));

  const [[allRow], rows] = await Promise.all([
    db
      .select({ c: count() })
      .from(users)
      .where(studentBase),
    db
      .select({
        id: users.id,
        email: users.email,
        phone: users.phone,
        fullName: profiles.fullName,
        lastLoginAt: users.lastLoginAt,
        mentorName: sql<string | null>`(
          SELECT pf.full_name FROM profiles pf
           INNER JOIN assignments ON assignments.mentor_id = pf.user_id
           WHERE assignments.student_id = ${users.id}
             AND assignments.status = 'active'
           ORDER BY assignments.started_at DESC
           LIMIT 1
        )`,
      })
      .from(users)
      .leftJoin(profiles, eq(profiles.userId, users.id))
      .where(studentBase)
      .orderBy(desc(users.createdAt))
      .limit(STUDENT_LIMIT),
  ]);

  const filters = [
    { key: "all", label: "All", count: Number(allRow?.c ?? 0) },
  ];

  return (
    <Shell
      role="admin"
      active="students"
      pageCode="A.03 — STUDENTS MANAGEMENT"
      pageTitle="Students"
      pageSubtitle="Filter, search, and act on the full student roster."
      actions={
        <div className="flex items-center gap-2">
          <input
            placeholder="Search name, email, phone…"
            className="rounded-input border border-rule-strong px-3 py-2 text-sm w-72 focus:outline-none focus:border-primary"
          />
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
                <td
                  colSpan={4}
                  className="px-4 py-10 text-center text-ink-faint italic"
                >
                  No data yet
                </td>
              </tr>
            ) : (
              rows.map((s: {
                id: string;
                email: string;
                fullName: string | null;
                lastLoginAt: Date | null;
                mentorName: string | null;
              }) => {
                const name = s.fullName ?? s.email.split("@")[0];
                return (
                  <tr
                    key={s.id}
                    className="border-b border-rule last:border-0 hover:bg-surface-elevated/60"
                  >
                    <td className="px-4 py-3">
                      <input type="checkbox" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="avatar !w-8 !h-8 !text-xs">
                          {initials(name)}
                        </div>
                        <div>
                          <div className="font-medium">{name}</div>
                          <div className="meta">{s.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-ink-soft">
                      {s.mentorName ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <LinkButton
                        href={`/admin/students/${s.id}`}
                        variant="ghost"
                        size="sm"
                      >
                        Open
                      </LinkButton>
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
          Showing 1–{rows.length} of {Number(allRow?.c ?? 0)}
        </div>
        <div className="flex items-center gap-2">
          <button className="chip-ghost">← Prev</button>
          <span className="meta">Page 1 / 1</span>
          <button className="chip-ghost">Next →</button>
        </div>
      </div>
    </Shell>
  );
}
