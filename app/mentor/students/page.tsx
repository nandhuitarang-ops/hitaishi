import Link from "next/link";
import { Shell } from "@/components/Shell";
import { Card, LinkButton, Pill } from "@/components/ui";
import { initials } from "@/lib/format";
import { db } from "@/lib/db";
import {
  assignments,
  doubts,
  profiles,
  sessionParticipants,
  sessions,
  users,
} from "@/db/schema";
import { and, desc, eq, sql } from "drizzle-orm";
import { requireRole } from "@/lib/session";

export const revalidate = 60;

const statusTone = {
  on_track: "primary",
  needs_attention: "warn",
  at_risk: "error",
} as const;
const statusLabel = {
  on_track: "On track",
  needs_attention: "Attention",
  at_risk: "At risk",
} as const;

type StudentStatus = keyof typeof statusTone;

function deriveStatus(
  lastLoginAt: Date | null,
  doubtCount: number,
  joinedAt: Date,
): StudentStatus {
  if (!lastLoginAt) {
    const daysSinceJoin = (Date.now() - joinedAt.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceJoin < 14 && doubtCount === 0) return "on_track";
  }
  if (lastLoginAt) {
    const daysSinceLogin = (Date.now() - lastLoginAt.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceLogin > 5) return "at_risk";
  }
  if (doubtCount > 5) return "needs_attention";
  return "on_track";
}

function formatLastLogin(d: Date | null): string {
  if (!d) return "never";
  const ms = Date.now() - d.getTime();
  const m = Math.floor(ms / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  if (days === 1) return "yesterday";
  if (days < 14) return `${days}d ago`;
  return new Date(d).toLocaleDateString();
}

function formatJoined(d: Date): string {
  return new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function MentorStudentsPage() {
  const user = await requireRole("mentor");

  const studentRows = await db
    .select({
      id: users.id,
      fullName: profiles.fullName,
      email: users.email,
      targetExam: profiles.targetExam,
      targetYear: profiles.targetYear,
      lastLoginAt: users.lastLoginAt,
      joinedAt: assignments.startedAt,
    })
    .from(assignments)
    .innerJoin(users, eq(users.id, assignments.studentId))
    .leftJoin(profiles, eq(profiles.userId, users.id))
    .where(and(eq(assignments.mentorId, user.id), eq(assignments.status, "active")))
    .orderBy(sql`${users.lastLoginAt} ASC NULLS LAST`, desc(assignments.startedAt));

  const studentIds = studentRows.map((s: any) => s.id);

  const doubtCounts = new Map<string, number>();
  const sessionCounts = new Map<string, number>();
  if (studentIds.length) {
    const [dRows, sRows] = await Promise.all([
      db
        .select({
          studentId: doubts.studentId,
          c: sql<number>`count(*)::int`,
        })
        .from(doubts)
        .where(sql`${doubts.studentId} = ANY(${studentIds})`)
        .groupBy(doubts.studentId),
      db
        .select({
          studentId: sessionParticipants.userId,
          c: sql<number>`count(*)::int`,
        })
        .from(sessionParticipants)
        .innerJoin(sessions, eq(sessions.id, sessionParticipants.sessionId))
        .where(
          and(
            sql`${sessionParticipants.userId} = ANY(${studentIds})`,
            eq(sessions.status, "completed"),
          ),
        )
        .groupBy(sessionParticipants.userId),
    ]);
    for (const r of dRows) doubtCounts.set(r.studentId, Number(r.c));
    for (const r of sRows) sessionCounts.set(r.studentId, Number(r.c));
  }

  const roster = studentRows.map((s: any) => {
    const name = s.fullName ?? s.email.split("@")[0];
    const dc = doubtCounts.get(s.id) ?? 0;
    const sc = sessionCounts.get(s.id) ?? 0;
    return {
      id: s.id,
      name,
      cohort: s.targetYear ? `IIT-JEE ${s.targetYear}` : "Unassigned",
      joined: formatJoined(s.joinedAt),
      lastActive: formatLastLogin(s.lastLoginAt),
      sessions: sc,
      doubts: dc,
      status: deriveStatus(s.lastLoginAt, dc, s.joinedAt),
    };
  }) as Array<{
    id: string;
    name: string;
    cohort: string;
    joined: string;
    lastActive: string;
    sessions: number;
    doubts: number;
    status: StudentStatus;
  }>;

  const allCount = roster.length;
  const attentionCount = roster.filter(
    (r: any) => r.status === "needs_attention" || r.status === "at_risk",
  ).length;
  const onTrackCount = roster.filter((r: any) => r.status === "on_track").length;
  const atRiskCount = roster.filter((r: any) => r.status === "at_risk").length;
  const twoWeeksMs = 14 * 24 * 60 * 60 * 1000;
  const newCount = roster.filter(
    (r: any) => Date.now() - new Date(r.joined).getTime() < twoWeeksMs,
  ).length;

  const FILTERS = [
    { key: "all", label: "All", count: allCount },
    { key: "attention", label: "Needs attention", count: attentionCount },
    { key: "on_track", label: "On track", count: onTrackCount },
    { key: "at_risk", label: "At risk", count: atRiskCount },
    { key: "new", label: "New (<2 wks)", count: newCount },
  ];

  return (
    <Shell
      role="mentor"
      active="students"
      pageCode="M.04 — MY STUDENTS"
      pageTitle="Student roster"
      pageSubtitle="Triage and track individual performance across your cohort."
      actions={
        <input
          placeholder="Search students…"
          className="rounded-input border border-rule-strong px-3 py-2 text-sm w-64 focus:outline-none focus:border-primary"
        />
      }
    >
      <div className="flex flex-wrap gap-2 mb-5">
        {FILTERS.map((f, i) => (
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

      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-elevated border-b border-rule">
              <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-wider text-ink-soft">
                <input type="checkbox" />
              </th>
              <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-wider text-ink-soft">
                Student
              </th>
              <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-wider text-ink-soft hidden md:table-cell">
                Cohort
              </th>
              <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-wider text-ink-soft hidden lg:table-cell">
                Joined
              </th>
              <th className="px-4 py-3 text-right font-mono text-[11px] uppercase tracking-wider text-ink-soft">
                Sessions
              </th>
              <th className="px-4 py-3 text-right font-mono text-[11px] uppercase tracking-wider text-ink-soft">
                Doubts
              </th>
              <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-wider text-ink-soft">
                Status
              </th>
              <th className="px-4 py-3 text-right font-mono text-[11px] uppercase tracking-wider text-ink-soft">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {roster.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-sm text-ink-soft">
                  No students assigned yet.
                </td>
              </tr>
            ) : (
              roster.map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-rule last:border-0 hover:bg-surface-elevated/60"
                >
                  <td className="px-4 py-3">
                    <input type="checkbox" />
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/mentor/students/${s.id}`}
                      className="flex items-center gap-3 hover:text-primary-deep"
                    >
                      <div className="avatar !w-8 !h-8 !text-xs">
                        {initials(s.name)}
                      </div>
                      <div>
                        <div className="font-medium">{s.name}</div>
                        <div className="meta">last active {s.lastActive}</div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-ink-soft">
                    {s.cohort}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell font-mono text-xs text-ink-faint">
                    {s.joined}
                  </td>
                  <td className="px-4 py-3 text-right font-mono">{s.sessions}</td>
                  <td className="px-4 py-3 text-right font-mono">{s.doubts}</td>
                  <td className="px-4 py-3">
                    <Pill tone={statusTone[s.status]}>{statusLabel[s.status]}</Pill>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <LinkButton href={`/mentor/students/${s.id}`} variant="ghost" size="sm">
                      Open
                    </LinkButton>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>

      <div className="flex items-center justify-between mt-5">
        <div className="meta">
          {roster.length === 0
            ? "Showing 0 of 0"
            : `Showing 1–${roster.length} of ${roster.length}`}
        </div>
        <div className="flex items-center gap-2">
          <button className="chip-ghost">← Prev</button>
          <button className="chip-ghost">Next →</button>
        </div>
      </div>
    </Shell>
  );
}
