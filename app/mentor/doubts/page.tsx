import { Shell } from "@/components/Shell";
import { Card, CardBody, LinkButton, Pill } from "@/components/ui";
import { initials } from "@/lib/format";
import { db } from "@/lib/db";
import { assignments, doubtAnswers, doubts, profiles, users } from "@/db/schema";
import { and, asc, desc, eq, gte, sql } from "drizzle-orm";
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

function subjectLabel(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function formatElapsed(d: Date, now: Date = new Date()): string {
  const ms = now.getTime() - d.getTime();
  const minutes = Math.max(0, Math.floor(ms / 60000));
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remMin = minutes % 60;
  return `${hours}h ${remMin}m`;
}

export default async function MentorDoubtsPage() {
  const user = await requireRole("mentor");
  const now = new Date();
  const dayStart = startOfDay(now);
  const dayEnd = endOfDay(now);

  const [waitingRow, claimedRow, answeredRow] = await Promise.all([
    db
      .select({ c: sql<number>`count(*)::int` })
      .from(doubts)
      .innerJoin(assignments, eq(assignments.studentId, doubts.studentId))
      .where(
        and(
          eq(doubts.status, "open"),
          eq(assignments.mentorId, user.id),
          eq(assignments.status, "active"),
        ),
      ),
    db
      .select({ c: sql<number>`count(*)::int` })
      .from(doubts)
      .where(and(eq(doubts.status, "claimed"), eq(doubts.claimedBy, user.id))),
    db
      .select({ c: sql<number>`count(*)::int` })
      .from(doubtAnswers)
      .innerJoin(doubts, eq(doubts.id, doubtAnswers.doubtId))
      .where(
        and(
          eq(doubtAnswers.answererId, user.id),
          gte(doubtAnswers.createdAt, dayStart),
          sql`${doubtAnswers.createdAt} < ${dayEnd.toISOString()}`,
        ),
      ),
  ]);

  const tabs = [
    { key: "pending", label: "Pending", count: Number(waitingRow?.c ?? 0) },
    { key: "claimed", label: "Mine — in progress", count: Number(claimedRow?.c ?? 0) },
    { key: "answered", label: "Answered today", count: Number(answeredRow?.c ?? 0) },
  ];

  const [waitingDoubts, resolvedTodayRow, earnedTodayRow] = await Promise.all([
    db
      .select({
        id: doubts.id,
        subject: doubts.subject,
        body: doubts.body,
        topic: doubts.topic,
        createdAt: doubts.createdAt,
        studentName: profiles.fullName,
        studentEmail: users.email,
      })
      .from(doubts)
      .innerJoin(assignments, eq(assignments.studentId, doubts.studentId))
      .innerJoin(users, eq(users.id, doubts.studentId))
      .leftJoin(profiles, eq(profiles.userId, doubts.studentId))
      .where(
        and(
          eq(doubts.status, "open"),
          eq(assignments.mentorId, user.id),
          eq(assignments.status, "active"),
        ),
      )
      .orderBy(asc(doubts.createdAt))
      .limit(50),
    db
      .select({ c: sql<number>`count(*)::int` })
      .from(doubtAnswers)
      .where(
        and(
          eq(doubtAnswers.answererId, user.id),
          gte(doubtAnswers.createdAt, dayStart),
          sql`${doubtAnswers.createdAt} < ${dayEnd.toISOString()}`,
        ),
      ),
    db
      .select({
        sum: sql<number>`0::int`,
      })
      .from(doubtAnswers)
      .innerJoin(doubts, eq(doubts.id, doubtAnswers.doubtId))
      .where(
        and(
          eq(doubtAnswers.answererId, user.id),
          gte(doubtAnswers.createdAt, dayStart),
          sql`${doubtAnswers.createdAt} < ${dayEnd.toISOString()}`,
        ),
      ),
  ]);

  const formattedDoubts = waitingDoubts.map((d: any) => {
    const name = d.studentName ?? d.studentEmail.split("@")[0];
    const elapsed = formatElapsed(d.createdAt, now);
    const hours = Math.floor((now.getTime() - d.createdAt.getTime()) / 3600000);
    return {
      id: d.id,
      student: name,
      subject: subjectLabel(d.subject),
      snippet: d.topic ? `${d.topic} — ${d.body.slice(0, 80)}` : d.body.slice(0, 120),
      elapsed,
      reward: 0,
      sla: hours >= 4 ? ("warn" as const) : ("primary" as const),
    };
  });

  const resolvedToday = Number(resolvedTodayRow?.c ?? 0);
  const earnedToday = Number(earnedTodayRow?.sum ?? 0);

  return (
    <Shell
      role="mentor"
      active="doubts"
      pageCode="M.06 — DOUBT INBOX"
      pageTitle="Doubt inbox"
      pageSubtitle="Claim a doubt to lock it for 30 minutes while you write the answer."
    >
      <div className="flex flex-wrap gap-2 mb-5">
        {tabs.map((t, i) => (
          <button
            key={t.key}
            className={`px-4 py-2 rounded-pill text-sm flex items-center gap-2 ${
              i === 0
                ? "bg-primary text-primary-on"
                : "bg-surface-card border border-rule text-ink-soft hover:bg-surface-elevated"
            }`}
          >
            {t.label}
            <span className="font-mono text-xs opacity-70">{t.count}</span>
          </button>
        ))}
      </div>

      {formattedDoubts.length === 0 ? (
        <Card>
          <CardBody>
            <div className="text-sm text-ink-soft text-center py-6">
              No open doubts right now.
            </div>
          </CardBody>
        </Card>
      ) : (
        <div className="grid gap-3">
          {formattedDoubts.map((d: any) => (
            <Card key={d.id}>
              <CardBody className="flex flex-wrap items-start gap-4">
                <div className="avatar !w-10 !h-10 !text-sm flex-shrink-0">
                  {initials(d.student)}
                </div>
                <div className="flex-1 min-w-[260px]">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm">{d.student}</span>
                    <Pill tone="primary">{d.subject}</Pill>
                    <Pill tone={d.sla}>⏱ {d.elapsed}</Pill>
                    <span className="meta ml-auto">Earns ₹{d.reward}</span>
                  </div>
                  <p className="text-sm text-ink mt-2 line-clamp-2">{d.snippet}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="chip-ghost text-xs">Voice note</button>
                  <LinkButton href={`/mentor/doubts/${d.id}`} size="sm">
                    Claim & answer →
                  </LinkButton>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-8 grid md:grid-cols-3 gap-3 text-center">
        <Card className="p-5">
          <div className="meta">RESOLVED TODAY</div>
          <div className="font-serif text-3xl text-primary-deep mt-2">{resolvedToday}</div>
        </Card>
        <Card className="p-5">
          <div className="meta">EARNED TODAY</div>
          <div className="font-serif text-3xl text-primary-deep mt-2">
            ₹{earnedToday.toLocaleString("en-IN")}
          </div>
        </Card>
        <Card className="p-5">
          <div className="meta">AVG RESPONSE</div>
          <div className="font-serif text-3xl text-primary-deep mt-2">—</div>
        </Card>
      </div>
    </Shell>
  );
}
