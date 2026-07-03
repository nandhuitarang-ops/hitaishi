import { Shell } from "@/components/Shell";
import { Card, CardBody, CardHeader, LinkButton, Pill } from "@/components/ui";
import { formatLastSeen } from "@/lib/format";
import { RealtimeRefresher } from "@/components/admin/RealtimeRefresher";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/session";
import {
  users,
  profiles,
  sessions,
  mentorVerifications,
  webhookEvents,
  conversations,
  auditLog,
  mentorRequests,
} from "@/db/schema";
import { and, count, desc, eq, gte, isNull, lt } from "drizzle-orm";

export const dynamic = "force-dynamic";

type Tone = "primary" | "coral" | "warn" | "error" | "neutral";

const sevTone: Record<"high" | "med" | "low", Tone> = {
  high: "error",
  med: "warn",
  low: "neutral",
};

export default async function AdminDashboardPage() {
  await requireRole("admin");

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const [activeStudentsRow] = await db
    .select({ c: count() })
    .from(users)
    .where(
      and(
        eq(users.role, "student"),
        eq(users.status, "active"),
        isNull(users.deletedAt),
      ),
    );

  const [activeMentorsRow] = await db
    .select({ c: count() })
    .from(users)
    .where(
      and(
        eq(users.role, "mentor"),
        eq(users.status, "active"),
        isNull(users.deletedAt),
      ),
    );

  const [sessionsTodayRow] = await db
    .select({ c: count() })
    .from(sessions)
    .where(
      and(
        gte(sessions.scheduledAt, startOfDay),
        lt(sessions.scheduledAt, endOfDay),
      ),
    );

  const [liveRow] = await db
    .select({ c: count() })
    .from(sessions)
    .where(eq(sessions.status, "live"));

  const mrr = 0;

  const [pendingVerifsRow] = await db
    .select({ c: count() })
    .from(mentorVerifications)
    .where(eq(mentorVerifications.status, "pending"));

  const [failedWebhooksRow] = await db
    .select({ c: count() })
    .from(webhookEvents)
    .where(isNull(webhookEvents.processedAt));

  const [flaggedConvsRow] = await db
    .select({ c: count() })
    .from(conversations)
    .where(eq(conversations.flagged, true));

  let pendingMentorRequests: {
    id: string;
    studentName: string | null;
    studentEmail: string | null;
    message: string | null;
    createdAt: Date | null;
  }[] = [];
  try {
    pendingMentorRequests = await db
      .select({
        id: mentorRequests.id,
        studentName: profiles.fullName,
        studentEmail: users.email,
        message: mentorRequests.message,
        createdAt: mentorRequests.createdAt,
      })
      .from(mentorRequests)
      .innerJoin(users, eq(users.id, mentorRequests.studentId))
      .leftJoin(profiles, eq(profiles.userId, mentorRequests.studentId))
      .where(eq(mentorRequests.status, "pending"))
      .orderBy(desc(mentorRequests.createdAt))
      .limit(10);
  } catch {
    // Table may not exist yet — ignore
    console.warn("[admin/dashboard] mentor_requests table not found — skipping");
  }

  const pendingRefunds = 0;

  const auditRows = await db
    .select({
      id: auditLog.id,
      action: auditLog.action,
      targetType: auditLog.targetType,
      targetId: auditLog.targetId,
      createdAt: auditLog.createdAt,
      actorName: profiles.fullName,
      actorEmail: users.email,
    })
    .from(auditLog)
    .leftJoin(users, eq(users.id, auditLog.actorId))
    .leftJoin(profiles, eq(profiles.userId, auditLog.actorId))
    .orderBy(desc(auditLog.createdAt))
    .limit(10);

  const liveSessions = await db
    .select({
      id: sessions.id,
      title: sessions.title,
      startedAt: sessions.startedAt,
    })
    .from(sessions)
    .where(eq(sessions.status, "live"))
    .orderBy(desc(sessions.startedAt))
    .limit(10);

  const [failed24hRow] = await db
    .select({ c: count() })
    .from(webhookEvents)
    .where(
      and(
        isNull(webhookEvents.processedAt),
        gte(webhookEvents.createdAt, last24h),
      ),
    );

  const activeStudents = Number(activeStudentsRow?.c ?? 0);
  const activeMentors = Number(activeMentorsRow?.c ?? 0);
  const sessionsToday = Number(sessionsTodayRow?.c ?? 0);
  const liveCount = Number(liveRow?.c ?? 0);
  const pendingVerifs = Number(pendingVerifsRow?.c ?? 0);
  const failedWebhooks = Number(failedWebhooksRow?.c ?? 0);
  const flaggedConvs = Number(flaggedConvsRow?.c ?? 0);
  const failed24h = Number(failed24hRow?.c ?? 0);

  const kpis = [
    {
      label: "ACTIVE STUDENTS",
      value: activeStudents.toLocaleString("en-IN"),
      delta: `${activeStudents} total`,
    },
    {
      label: "ACTIVE MENTORS",
      value: activeMentors.toLocaleString("en-IN"),
      delta: `${pendingVerifs} pending verification`,
      tone: "warn" as Tone,
    },
    {
      label: "SESSIONS TODAY",
      value: sessionsToday.toLocaleString("en-IN"),
      delta: `${liveCount} live now`,
    },
    {
      label: "MRR",
      value: `₹0`,
      delta: `0 active subscriptions`,
    },
  ];

  type Alert = {
    id: string;
    severity: "high" | "med";
    title: string;
    href: string;
  };
  const alerts: Alert[] = [];
  if (pendingMentorRequests.length > 0) {
    alerts.push({
      id: "a0",
      severity: "high",
      title: `${pendingMentorRequests.length} student${pendingMentorRequests.length === 1 ? "" : "s"} requesting a mentor`,
      href: "/admin/students",
    });
  }
  if (pendingVerifs > 0) {
    alerts.push({
      id: "a1",
      severity: "high",
      title: `${pendingVerifs} mentor application${pendingVerifs === 1 ? "" : "s"} awaiting verification`,
      href: "/admin/mentors",
    });
  }
  if (flaggedConvs > 0) {
    alerts.push({
      id: "a3",
      severity: "med",
      title: `${flaggedConvs} flagged conversation${flaggedConvs === 1 ? "" : "s"} (off-platform mention)`,
      href: "/admin/sessions",
    });
  }
  const health = [
    {
      label: "Webhooks (24h)",
      status: failed24h === 0 ? "Healthy" : `${failed24h} failed`,
      tone: (failed24h === 0 ? "primary" : "error") as Tone,
    },
  ];

  return (
    <Shell
      role="admin"
      active="dashboard"
      pageCode="A.02 — MASTER DASHBOARD"
      pageTitle="Control room"
      pageSubtitle="System health, alerts, and recent admin activity at a glance."
    >
      <RealtimeRefresher />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {kpis.map((k) => (
          <Card key={k.label} className="p-5">
            <div className="meta">{k.label}</div>
            <div className="font-serif text-3xl text-primary-deep mt-2">{k.value}</div>
            <div className="text-xs text-ink-soft mt-1">{k.delta}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5">
        <div className="flex flex-col gap-5">
          <Card>
            <CardHeader
              meta="NEEDS YOUR ATTENTION"
              title={`${alerts.length} open items`}
            />
            {alerts.length === 0 ? (
              <CardBody>
                <div className="text-sm text-ink-soft text-center py-4">
                  No data yet
                </div>
              </CardBody>
            ) : (
              <ul>
                {alerts.map((a) => (
                  <li
                    key={a.id}
                    className="flex items-center justify-between gap-4 px-5 py-4 border-t border-rule first:border-t-0"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Pill tone={sevTone[a.severity]}>{a.severity}</Pill>
                      <span className="text-sm">{a.title}</span>
                    </div>
                    <LinkButton href={a.href} variant="ghost" size="sm">
                      Resolve →
                    </LinkButton>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card>
            <CardHeader
              meta="MENTOR REQUESTS"
              title={`${pendingMentorRequests.length} pending`}
              action={
                <LinkButton href="/admin/students" variant="ghost" size="sm">
                  Assign →
                </LinkButton>
              }
            />
            {pendingMentorRequests.length === 0 ? (
              <CardBody>
                <div className="text-sm text-ink-soft text-center py-4">
                  No mentor requests
                </div>
              </CardBody>
            ) : (
              <ul>
                {pendingMentorRequests.map((r: { id: string; studentName: string | null; studentEmail: string | null; message: string | null; createdAt: Date | null }) => (
                  <li
                    key={r.id}
                    className="flex items-center justify-between gap-3 px-5 py-3 border-t border-rule first:border-t-0"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">
                        {r.studentName ?? r.studentEmail ?? "Unknown student"}
                      </div>
                      {r.message && (
                        <div className="text-xs text-ink-soft truncate mt-0.5">
                          &ldquo;{r.message}&rdquo;
                        </div>
                      )}
                      <div className="meta mt-0.5">
                        requested {r.createdAt ? formatLastSeen(r.createdAt) : "—"} ago
                      </div>
                    </div>
                    <LinkButton
                      href={`/admin/students`}
                      variant="ghost"
                      size="sm"
                    >
                      Match
                    </LinkButton>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card>
            <CardHeader
              meta="LIVE SESSIONS"
              title={`${liveSessions.length} streams active`}
              action={
                <LinkButton href="/admin/sessions" variant="ghost" size="sm">
                  Monitor →
                </LinkButton>
              }
            />
            {liveSessions.length === 0 ? (
              <CardBody>
                <div className="text-sm text-ink-soft text-center py-4">
                  No live sessions
                </div>
              </CardBody>
            ) : (
              <ul>
                {liveSessions.map((s: { id: string; title: string; startedAt: Date | null }) => (
                  <li
                    key={s.id}
                    className="flex items-center justify-between gap-3 px-5 py-3 border-t border-rule first:border-t-0"
                  >
                    <div>
                      <div className="text-sm">{s.title}</div>
                      <div className="meta mt-0.5">
                        started {s.startedAt ? formatLastSeen(s.startedAt) : "—"} ago
                      </div>
                    </div>
                    <LinkButton
                      href={`/admin/sessions/${s.id}`}
                      variant="ghost"
                      size="sm"
                    >
                      Watch silently
                    </LinkButton>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <div className="flex flex-col gap-5">
          <Card>
            <CardHeader
              meta="RECENT ADMIN ACTIONS"
              title="Last actions"
              action={
                <LinkButton href="/admin/audit" variant="ghost" size="sm">
                  All →
                </LinkButton>
              }
            />
            {auditRows.length === 0 ? (
              <CardBody>
                <div className="text-sm text-ink-soft text-center py-4">
                  No data yet
                </div>
              </CardBody>
            ) : (
              <ul>
                {auditRows.map((r: { id: number; action: string; targetType: string | null; targetId: string | null; createdAt: Date | null; actorName: string | null; actorEmail: string | null }) => {
                  const who = r.actorName ?? r.actorEmail ?? "system";
                  const target = r.targetType
                    ? r.targetId
                      ? `${r.targetType} ${String(r.targetId).slice(0, 8)}`
                      : r.targetType
                    : "";
                  return (
                    <li
                      key={r.id}
                      className="px-5 py-3 border-t border-rule first:border-t-0"
                    >
                      <div className="text-sm">
                        <span className="font-medium">{who}</span>{" "}
                        <span className="font-mono text-xs">{r.action}</span>
                        {target ? <span className="text-ink-soft"> · {target}</span> : null}
                      </div>
                      <div className="meta mt-0.5">
                        {r.createdAt ? formatLastSeen(r.createdAt) : ""}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>

          <Card>
            <CardHeader meta="SYSTEM HEALTH" title="Integrations" />
            <ul>
              {health.map((h) => (
                <li
                  key={h.label}
                  className="flex items-center justify-between px-5 py-3 border-t border-rule first:border-t-0"
                >
                  <span className="text-sm">{h.label}</span>
                  <Pill tone={h.tone}>{h.status}</Pill>
                </li>
              ))}
            </ul>
            <CardBody>
              <LinkButton
                href="/admin/settings"
                variant="ghost"
                size="md"
                className="w-full"
              >
                Open settings →
              </LinkButton>
            </CardBody>
          </Card>
        </div>
      </div>
    </Shell>
  );
}
