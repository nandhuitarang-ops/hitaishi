import { Shell } from "@/components/Shell";
import { Card, CardHeader, LinkButton, Pill } from "@/components/ui";
import { initials } from "@/lib/format";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/session";
import { users, profiles, mentorVerifications, assignments, doubtAnswers } from "@/db/schema";
import { leads } from "@/db/schema/leads";
import { and, count, desc, eq, isNull, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

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
  const [pending, leadApps, active, [activeCountRow]] = await Promise.all([
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
    // Mentor applications submitted via the public /mentor-onboarding form go to `leads` (type="mentor-application"),
    // not to mentorVerifications (which requires an existing user). Show them in the same queue.
    db
      .select({
        id: leads.id,
        name: leads.name,
        email: leads.email,
        createdAt: leads.createdAt,
      })
      .from(leads)
      .where(eq(leads.type, "mentor-application"))
      .orderBy(desc(leads.createdAt)) as Promise<{
        id: string; name: string; email: string; createdAt: Date | null;
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

  // Normalise both sources into a single display list, newest first
  type QueueItem = {
    id: string;
    displayName: string;
    email: string;
    institute: string;
    cohort: string;
    jeeRank: string | null;
    createdAt: Date | null;
    /** Source discriminator — "verification" entries have documents/linkedin badges */
    source: "verification" | "lead";
    /** Only for "verification" entries */
    documents?: unknown;
    linkedinUrl?: string | null;
  };

  const queue: QueueItem[] = [
    ...pending.map((v) => ({
      id: v.id,
      displayName: v.name ?? v.email.split("@")[0],
      email: v.email,
      institute: v.institute ?? "—",
      cohort: v.graduationYear ? `Class of ${v.graduationYear}` : "—",
      jeeRank: v.jeeRank != null ? String(v.jeeRank) : null,
      createdAt: v.createdAt,
      source: "verification" as const,
      documents: v.documents,
      linkedinUrl: v.linkedinUrl,
    })),
    ...leadApps.map((l) => ({
      id: l.id,
      displayName: l.name ?? l.email.split("@")[0],
      email: l.email,
      institute: "—",
      cohort: "—",
      jeeRank: null,
      createdAt: l.createdAt,
      source: "lead" as const,
    })),
  ].sort((a, b) => {
    const da = a.createdAt?.getTime() ?? 0;
    const db_ = b.createdAt?.getTime() ?? 0;
    return db_ - da;
  });

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
        <CardHeader meta={`VERIFICATION QUEUE · ${queue.length} PENDING`} title="Applications awaiting review" />
        {queue.length === 0 ? (
          <div className="px-5 py-6 text-sm text-ink-soft text-center italic">No data yet</div>
        ) : (
          <ul>
            {queue.map((p) => {
              const docs = p.source === "verification"
                ? docsFromVerification({ documents: p.documents, linkedinUrl: p.linkedinUrl ?? null })
                : null;
              return (
                <li key={p.id} className="px-5 py-5 border-t border-rule first:border-t-0">
                  <div className="flex flex-wrap items-start gap-4">
                    <div className="avatar !w-12 !h-12 !text-base">{initials(p.displayName)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-serif text-lg">{p.displayName}</div>
                      <div className="text-sm text-ink-soft mt-1">
                        {p.institute}{p.cohort !== "—" ? ` · ${p.cohort}` : ""}
                        {p.jeeRank != null ? ` · JEE Adv AIR ${p.jeeRank}` : ""}
                      </div>
                      <div className="meta mt-1">Applied {p.createdAt ? DATE_FMT.format(new Date(p.createdAt)) : "—"}</div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {p.source === "verification" && docs ? (
                          <>
                            <Pill tone={docTone[docs.degree]}>Degree</Pill>
                            <Pill tone={docTone[docs.id]}>ID card</Pill>
                            <Pill tone={docTone[docs.scorecard]}>JEE scorecard</Pill>
                            <Pill tone={docTone[docs.linkedin]}>LinkedIn</Pill>
                          </>
                        ) : (
                          <Pill tone="neutral">Via web form</Pill>
                        )}
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
