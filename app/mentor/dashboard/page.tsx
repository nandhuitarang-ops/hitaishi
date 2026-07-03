import { Shell } from "@/components/Shell";
import { Card, CardBody, CardHeader, LinkButton, Pill } from "@/components/ui";
import { initials } from "@/lib/format";
import { db } from "@/lib/db";
import {
  assignments,
  doubts,
  profiles,
  sessions,
  users,
} from "@/db/schema";
import { and, asc, desc, eq, gte, lt, or, sql } from "drizzle-orm";
import { requireRole } from "@/lib/session";

export const dynamic = "force-dynamic";

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function endOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}
export default async function MentorDashboard() {
  const user = await requireRole("mentor");
  const now = new Date();
  const dayStart = startOfDay(now);
  const dayEnd = endOfDay(now);

  const [
    studentsCountRows,
    sessionsTodayRows,
    doubtsPendingRows,
    attentionRows,
    pendingDoubtRows,
    todayCalendarRows,
  ] = await Promise.all([
    db
      .select({ c: sql<number>`count(*)::int` })
      .from(assignments)
      .where(and(eq(assignments.mentorId, user.id), eq(assignments.status, "active"))),
    db
      .select({ c: sql<number>`count(*)::int` })
      .from(sessions)
      .where(
        and(
          eq(sessions.hostId, user.id),
          gte(sessions.scheduledAt, dayStart),
          lt(sessions.scheduledAt, dayEnd),
        ),
      ),
    db
      .select({ c: sql<number>`count(*)::int` })
      .from(doubts)
      .innerJoin(assignments, eq(assignments.studentId, doubts.studentId))
      .where(
        and(
          eq(assignments.mentorId, user.id),
          eq(assignments.status, "active"),
          or(
            eq(doubts.status, "open"),
            and(eq(doubts.status, "claimed"), eq(doubts.claimedBy, user.id)),
          ),
        ),
      ),
    db
      .select({
        studentId: users.id,
        fullName: profiles.fullName,
        email: users.email,
        lastLoginAt: users.lastLoginAt,
        joinedAt: assignments.startedAt,
      })
      .from(assignments)
      .innerJoin(users, eq(users.id, assignments.studentId))
      .leftJoin(profiles, eq(profiles.userId, users.id))
      .where(and(eq(assignments.mentorId, user.id), eq(assignments.status, "active")))
      .orderBy(sql`${users.lastLoginAt} ASC NULLS LAST`, desc(assignments.startedAt))
      .limit(5),
    db
      .select({
        id: doubts.id,
        subject: doubts.subject,
        topic: doubts.topic,
        body: doubts.body,
        createdAt: doubts.createdAt,
        status: doubts.status,
        studentId: users.id,
        studentName: profiles.fullName,
        studentEmail: users.email,
      })
      .from(doubts)
      .innerJoin(assignments, eq(assignments.studentId, doubts.studentId))
      .innerJoin(users, eq(users.id, doubts.studentId))
      .leftJoin(profiles, eq(profiles.userId, doubts.studentId))
      .where(
        and(
          eq(assignments.mentorId, user.id),
          eq(assignments.status, "active"),
          or(
            eq(doubts.status, "open"),
            and(eq(doubts.status, "claimed"), eq(doubts.claimedBy, user.id)),
          ),
        ),
      )
      .orderBy(asc(doubts.createdAt))
      .limit(8),
    db
      .select({
        id: sessions.id,
        title: sessions.title,
        type: sessions.type,
        scheduledAt: sessions.scheduledAt,
      })
      .from(sessions)
      .where(
        and(
          eq(sessions.hostId, user.id),
          gte(sessions.scheduledAt, dayStart),
          lt(sessions.scheduledAt, dayEnd),
        ),
      )
      .orderBy(asc(sessions.scheduledAt)),
  ]);

  const summary = {
    students: Number(studentsCountRows[0]?.c ?? 0),
    sessionsToday: Number(sessionsTodayRows[0]?.c ?? 0),
    doubtsPending: Number(doubtsPendingRows[0]?.c ?? 0),
    earningsThisMonth: 0,
    status: "Available" as const,
  };

  const needsAttention = (attentionRows as any[]).map((a: any) => {
    const name = a.fullName ?? a.email.split("@")[0];
    return {
      id: a.studentId as string,
      name,
      reason: a.lastLoginAt
        ? `Last seen ${new Date(a.lastLoginAt).toLocaleDateString()}`
        : `Joined ${new Date(a.joinedAt).toLocaleDateString()}`,
      tone: "warn" as const,
    };
  });

  const subjectLabel = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const formatTime = (d: Date) =>
    d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });

  const pendingDoubts = (pendingDoubtRows as any[]).map((d: any) => ({
    id: d.id as string,
    student: d.studentName ?? d.studentEmail.split("@")[0],
    subject: subjectLabel(d.subject),
    title: d.topic || d.body.slice(0, 60),
  }));

  const todayCalendar = (todayCalendarRows as any[]).map((c: any) => {
    const subj = c.type === "group" ? "Group" : c.title.split(" ").slice(-1)[0] || "Session";
    return {
      time: formatTime(c.scheduledAt),
      who: c.title,
      subject: subj,
    };
  });

  return (
    <Shell
      role="mentor"
      active="dashboard"
      pageCode="M.03 — DASHBOARD"
      pageTitle="Who needs you tonight."
      pageSubtitle="Triage queue, today's calendar, and your monthly earnings at a glance."
      actions={
        <div className="flex items-center gap-2">
          <Pill tone="primary">● {summary.status}</Pill>
          <button className="chip-ghost text-xs">Switch to Away</button>
        </div>
      }
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-5">
          <div className="meta">STUDENTS</div>
          <div className="font-serif text-3xl mt-2 text-primary-deep">{summary.students}</div>
        </Card>
        <Card className="p-5">
          <div className="meta">SESSIONS TODAY</div>
          <div className="font-serif text-3xl mt-2 text-primary-deep">{summary.sessionsToday}</div>
        </Card>
        <Card className="p-5">
          <div className="meta">DOUBTS PENDING</div>
          <div className="font-serif text-3xl mt-2 text-secondary">{summary.doubtsPending}</div>
        </Card>
        <Card className="p-5">
          <div className="meta">THIS MONTH</div>
          <div className="font-serif text-3xl mt-2 text-primary-deep">
            ₹{summary.earningsThisMonth.toLocaleString("en-IN")}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-5">
        <div className="flex flex-col gap-5">
          <Card>
            <CardHeader meta="NEEDS YOUR ATTENTION" title="Students to message tonight" />
            {needsAttention.length === 0 ? (
              <CardBody>
                <div className="text-sm text-ink-soft text-center py-4">No students yet.</div>
              </CardBody>
            ) : (
              <ul>
                {needsAttention.map((a) => (
                  <li
                    key={a.id}
                    className="flex items-center gap-4 px-5 py-4 border-t border-rule first:border-t-0"
                  >
                    <div className="avatar !w-10 !h-10 !text-sm">{initials(a.name)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{a.name}</div>
                      <div className="text-xs text-ink-soft mt-1">{a.reason}</div>
                    </div>
                    <Pill tone={a.tone}>flag</Pill>
                    <LinkButton href={`/mentor/students/${a.id}`} size="sm">
                      Open chat
                    </LinkButton>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card>
            <CardHeader
              meta="PENDING DOUBTS"
              title={`${pendingDoubts.length} in your inbox`}
              action={
                <LinkButton href="/mentor/doubts" variant="ghost" size="sm">
                  View all
                </LinkButton>
              }
            />
            {pendingDoubts.length === 0 ? (
              <CardBody>
                <div className="text-sm text-ink-soft text-center py-4">No pending doubts.</div>
              </CardBody>
            ) : (
              <ul>
                {pendingDoubts.map((d) => (
                  <li
                    key={d.id}
                    className="flex items-center justify-between gap-4 px-5 py-3 border-t border-rule first:border-t-0"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Pill tone="primary">{d.subject}</Pill>
                      <div className="min-w-0">
                        <div className="text-sm truncate">{d.title}</div>
                        <div className="meta mt-0.5">from {d.student}</div>
                      </div>
                    </div>
                    <LinkButton href={`/mentor/doubts/${d.id}`} variant="ghost" size="sm">
                      Answer →
                    </LinkButton>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <Card>
          <CardHeader
            meta="TODAY'S CALENDAR"
            title={`${todayCalendar.length} session${todayCalendar.length === 1 ? "" : "s"}`}
          />
          {todayCalendar.length === 0 ? (
            <CardBody>
              <div className="text-sm text-ink-soft text-center py-4">No sessions today.</div>
            </CardBody>
          ) : (
            <ul>
              {todayCalendar.map((c, i) => (
                <li
                  key={i}
                  className="px-5 py-4 border-t border-rule first:border-t-0"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-serif text-lg">{c.time}</div>
                    <Pill tone="primary">{c.subject}</Pill>
                  </div>
                  <div className="text-sm text-ink-soft mt-1">{c.who}</div>
                </li>
              ))}
            </ul>
          )}
          <CardBody>
            <LinkButton href="/mentor/calendar" variant="ghost" size="md" className="w-full">
              Full calendar →
            </LinkButton>
          </CardBody>
        </Card>
      </div>
    </Shell>
  );
}
