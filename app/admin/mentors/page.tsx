import { Shell } from "@/components/Shell";
import { Card, CardHeader, LinkButton, Pill } from "@/components/ui";
import { initials } from "@/lib/format";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/session";
import { users, profiles, mentorVerifications, assignments, doubtAnswers } from "@/db/schema";
import { and, count, desc, eq, isNull, sql } from "drizzle-orm";

export const revalidate = 60;

type Tone = "primary" | "coral" | "warn" | "error" | "neutral";

const docTone: Record<"ok" | "pending" | "missing", Tone> = {
  ok: "primary",
  pending: "warn",
  missing: "error",
};

const statusTone: Record<"pending" | "active" | "suspended" | "banned", Tone> = {
  active: "primary",
  pending: "warn",
  suspended: "error",
  banned: "error",
};

const statusLabel: Record<"pending" | "active" | "suspended" | "banned", string> = {
  active: "Active",
  pending: "Pending",
  suspended: "Suspended",
  banned: "Banned",
};

const DATE_FMT = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

type DocState = "ok" | "pending" | "missing";

function docsFromVerification(
  row: { documents: unknown; linkedinUrl: string | null },
): { degree: DocState; id: DocState; scorecard: DocState; linkedin: DocState } {
  const docs = (row.documents ?? {}) as Record<string, string | null | undefined>;
  const pick = (v: string | null | undefined): DocState =>
    v === "ok" || v === "verified" || v === "present"
      ? "ok"
      : v === "missing" || v === "absent" || v === "rejected"
        ? "missing"
        : "pending";
  return {
    degree: pick(docs.degree),
    id: pick(docs.id ?? docs.id_card ?? docs.idCard),
    scorecard: pick(docs.scorecard ?? docs.jee_scorecard),
    linkedin: row.linkedinUrl ? "ok" : "pending",
  };
}

export default async function AdminMentorsPage() {
  await requireRole("admin");

  // Run queries in parallel
  const [pending, active, [activeCountRow]] = await Promise.all([
    db
      .select({
        id: mentorVerifications.id,
        userId: mentorVerifications.userId,
        documents: mentorVerifications.documents,
        linkedinUrl: mentorVerifications.linkedinUrl,
        jeeRank: mentorVerifications.jeeRank,
        createdAt: mentorVerifications.createdAt,
        name: profiles.fullName,
        email: users.email,
        institute: profiles.institute,
        graduationYear: profiles.graduationYear,
      })
      .from(mentorVerifications)
      .innerJoin(users, eq(users.id, mentorVerifications.userId))
      .leftJoin(profiles, eq(profiles.userId, mentorVerifications.userId))
      .where(eq(mentorVerifications.status, "pending"))
      .orderBy(desc(mentorVerifications.createdAt)) as Promise<{
        id: string; userId: string; documents: unknown; linkedinUrl: string | null;
        jeeRank: number | null; createdAt: Date | null; name: string | null;
        email: string; institute: string | null; graduationYear: number | null;
      }[]>,
    db
      .select({
        id: users.id,
        name: profiles.fullName,
        email: users.email,
        institute: profiles.institute,
        graduationYear: profiles.graduationYear,
        createdAt: users.createdAt,
        status: users.status,
      })
      .from(users)
      .leftJoin(profiles, eq(profiles.userId, users.id))
      .where(and(eq(users.role, "mentor"), eq(users.status, "active"), isNull(users.deletedAt)))
      .orderBy(desc(users.createdAt)) as Promise<{
        id: string; name: string | null; email: string; institute: string | null;
        graduationYear: number | null; createdAt: Date | null; status: "pending" | "active" | "suspended" | "banned";
      }[]>,
    db
      .select({ c: count() })
      .from(users)
      .where(and(eq(users.role, "mentor"), eq(users.status, "active"), isNull(users.deletedAt))),
  ]);

  const activeIds = active.map((m) => m.id);

  const studentCountByMentor = new Map<string, number>();
  const doubtCountByMentor = new Map<string, number>();

  if (activeIds.length) {
    const [studentRows, doubtRows] = await Promise.all([
      db
        .select({ mentorId: assignments.mentorId, c: sql<number>`count(*)::int` })
        .from(assignments)
        .where(eq(assignments.status, "active"))
        .groupBy(assignments.mentorId),
      db
        .select({ answererId: doubtAnswers.answererId, c: sql<number>`count(*)::int` })
        .from(doubtAnswers)
        .groupBy(doubtAnswers.answererId),
    ]);

    for (const r of studentRows) {
      if (activeIds.includes(r.mentorId)) {
        studentCountByMentor.set(r.mentorId, Number(r.c));
      }
    }
    for (const r of doubtRows) {
      doubtCountByMentor.set(r.answererId, Number(r.c));
    }
  }

  return (
    <Shell role="admin" active="mentors" pageCode="A.04 — MENTORS MANAGEMENT" pageTitle="Mentors" pageSubtitle="Verification queue and active mentor roster.">
      <Card className="mb-6">
        <CardHeader meta={`VERIFICATION QUEUE · ${pending.length} PENDING`} title="Applications awaiting review" />
        {pending.length === 0 ? (
          <div className="px-5 py-6 text-sm text-ink-soft text-center italic">No data yet</div>
        ) : (
          <ul>
            {pending.map((p) => {
              const docs = docsFromVerification({ documents: p.documents, linkedinUrl: p.linkedinUrl });
              const displayName = p.name ?? p.email.split("@")[0];
              const institute = p.institute ?? "—";
              const cohort = p.graduationYear ? `Class of ${p.graduationYear}` : "—";
              return (
                <li key={p.id} className="px-5 py-5 border-t border-rule first:border-t-0">
                  <div className="flex flex-wrap items-start gap-4">
                    <div className="avatar !w-12 !h-12 !text-base">{initials(displayName)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-serif text-lg">{displayName}</div>
                      <div className="text-sm text-ink-soft mt-1">
                        {institute} · {cohort}
                        {p.jeeRank != null ? ` · JEE Adv AIR ${p.jeeRank}` : ""}
                      </div>
                      <div className="meta mt-1">Applied {p.createdAt ? DATE_FMT.format(new Date(p.createdAt)) : "—"}</div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <Pill tone={docTone[docs.degree]}>Degree</Pill>
                        <Pill tone={docTone[docs.id]}>ID card</Pill>
                        <Pill tone={docTone[docs.scorecard]}>JEE scorecard</Pill>
                        <Pill tone={docTone[docs.linkedin]}>LinkedIn</Pill>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="chip-ghost">Reject</button>
                      <button className="chip-cta">Approve →</button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      <Card className="overflow-x-auto">
        <CardHeader meta={`ACTIVE MENTORS · ${Number(activeCountRow?.c ?? 0)}`} title="Roster, performance, and payouts" action={<button className="chip-ghost text-xs">Export CSV</button>} />
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-elevated border-b border-rule">
              <th className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-wider text-ink-soft">Mentor</th>
              <th className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-wider text-ink-soft hidden md:table-cell">Joined</th>
              <th className="px-4 py-3 text-right text-[11px] font-mono uppercase tracking-wider text-ink-soft">Students</th>
              <th className="px-4 py-3 text-right text-[11px] font-mono uppercase tracking-wider text-ink-soft hidden md:table-cell">Doubts</th>
              <th className="px-4 py-3 text-right text-[11px] font-mono uppercase tracking-wider text-ink-soft hidden lg:table-cell">Earnings</th>
              <th className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-wider text-ink-soft">Status</th>
              <th className="px-4 py-3 text-right text-[11px] font-mono uppercase tracking-wider text-ink-soft" />
            </tr>
          </thead>
          <tbody>
            {active.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-ink-faint italic">No data yet</td>
              </tr>
            ) : (
              active.map((m) => {
                const displayName = m.name ?? m.email.split("@")[0];
                const institute = m.institute ?? "—";
                const cohort = m.graduationYear ? `Class of ${m.graduationYear}` : "—";
                const studentsN = studentCountByMentor.get(m.id) ?? 0;
                const doubtsN = doubtCountByMentor.get(m.id) ?? 0;
                return (
                  <tr key={m.id} className="border-b border-rule last:border-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="avatar !w-8 !h-8 !text-xs">{initials(displayName)}</div>
                        <div>
                          <div className="font-medium">{displayName}</div>
                          <div className="meta">{institute} · {cohort}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-ink-soft font-mono text-xs">
                      {m.createdAt ? DATE_FMT.format(new Date(m.createdAt)) : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">{studentsN}</td>
                    <td className="px-4 py-3 text-right hidden md:table-cell">{doubtsN.toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3 text-right hidden lg:table-cell font-mono text-xs">—</td>
                    <td className="px-4 py-3"><Pill tone={statusTone[m.status]}>{statusLabel[m.status]}</Pill></td>
                    <td className="px-4 py-3 text-right">
                      <LinkButton href={`/admin/mentors/${m.id}`} variant="ghost" size="sm">Open</LinkButton>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </Card>

      <div className="meta text-center mt-5">Showing 1–{active.length} of {Number(activeCountRow?.c ?? 0)} mentors</div>
    </Shell>
  );
}
