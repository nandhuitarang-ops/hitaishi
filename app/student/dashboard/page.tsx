import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { and, desc, eq, gte, inArray, ne, or, sql } from "drizzle-orm";
import { Shell } from "@/components/Shell";
import { Card, CardBody, CardHeader, LinkButton, Pill } from "@/components/ui";
import { formatLastSeen, initials } from "@/lib/format";
import { db } from "@/lib/db";
import { StudentDashboardClient } from "./StudentDashboardClient";
import {
  assignments,
  conversationParticipants,
  doubtAnswers,
  doubts,
  messages,
  mentorRequests,
  profiles,
  resourceShares,
  resources,
  sessionParticipants,
  sessions,
  users,
} from "@/db/schema";
import { getCurrentUser } from "@/lib/session";
import { RequestMentorButton } from "./RequestMentorButton";
import {
  getStudentDoubtsAnsweredCount,
  getStudentResourcesReceivedCount,
} from "@/lib/student-cache";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard — Hitaishi Student",
  robots: "noindex, nofollow",
};

function greetingFor(d: Date): string {
  const h = d.getHours();
  if (h < 5) return "Good night";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  if (h < 21) return "Good evening";
  return "Good night";
}

function formatSessionDateLabel(d: Date): string {
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isTomorrow = d.toDateString() === tomorrow.toDateString();
  const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  if (sameDay) return `Today · ${time}`;
  if (isTomorrow) return `Tomorrow · ${time}`;
  return d.toLocaleString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateLabel(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short", day: "2-digit" }).toUpperCase();
}

function formatResourceSize(bytes: number | null | undefined): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

function formatKindLabel(kind: string): string {
  if (kind === "file") return "FILE";
  if (kind === "link") return "LINK";
  return kind.toUpperCase();
}

function subjectLabel(s: string): string {
  if (s === "physics") return "Physics";
  if (s === "chemistry") return "Chemistry";
  if (s === "maths") return "Math";
  return s;
}

function elapsedFrom(d: Date, now: Date = new Date()): string {
  const diff = now.getTime() - d.getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h`;
  const days = Math.floor(h / 24);
  if (days === 1) return "yesterday";
  return `${days}d`;
}

function examTargetLabel(
  targetExam: string | null | undefined,
  targetYear: number | null | undefined,
): string {
  if (!targetExam) return "JEE";
  const examMap: Record<string, string> = {
    jee_main: "JEE Main",
    jee_advanced: "JEE Adv",
    both: "JEE",
  };
  const exam = examMap[targetExam] ?? "JEE";
  return targetYear ? `${exam} ${targetYear}` : exam;
}

export default async function StudentDashboard() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "student") redirect(`/${user.role}/dashboard`);

  const [
    profileRow,
    assignmentRows,
    myParticipations,
    recentAnswers,
    doubtsAnsweredCount,
    resourcesReceivedCount,
    lastMessageRow,
    recentResourcesShared,
    mentorRequestRow,
  ] = await Promise.all([
    db.select().from(profiles).where(eq(profiles.userId, user.id)).limit(1),
    db
      .select({
        mentorId: users.id,
        mentorEmail: users.email,
        mentorName: profiles.fullName,
        mentorInstitute: profiles.institute,
        mentorSubjects: profiles.subjectsFocus,
        mentorLastLogin: users.lastLoginAt,
      })
      .from(assignments)
      .innerJoin(users, eq(users.id, assignments.mentorId))
      .leftJoin(profiles, eq(profiles.userId, assignments.mentorId))
      .where(
        and(
          eq(assignments.studentId, user.id),
          eq(assignments.status, "active"),
        ),
      )
      .orderBy(desc(assignments.startedAt))
      .limit(1),
    db
      .select({ sessionId: sessionParticipants.sessionId })
      .from(sessionParticipants)
      .where(eq(sessionParticipants.userId, user.id)),
    db
      .select({
        id: doubtAnswers.id,
        doubtId: doubts.id,
        topic: doubts.topic,
        body: doubts.body,
        answerBody: doubtAnswers.body,
        answeredAt: doubtAnswers.createdAt,
        subject: doubts.subject,
      })
      .from(doubtAnswers)
      .innerJoin(doubts, eq(doubts.id, doubtAnswers.doubtId))
      .where(and(eq(doubts.studentId, user.id), eq(doubts.status, "answered")))
      .orderBy(desc(doubtAnswers.createdAt))
      .limit(5),
    getStudentDoubtsAnsweredCount(user.id),
    getStudentResourcesReceivedCount(user.id),
    db
      .select({ body: messages.body, createdAt: messages.createdAt })
      .from(messages)
      .innerJoin(
        conversationParticipants,
        eq(conversationParticipants.conversationId, messages.conversationId),
      )
      .where(
        and(
          eq(conversationParticipants.userId, user.id),
          ne(messages.senderId, user.id),
        ),
      )
      .orderBy(desc(messages.createdAt))
      .limit(1),
    db
      .select({
        id: resources.id,
        title: resources.title,
        kind: resources.kind,
        sizeBytes: resources.sizeBytes,
        uploaderName: profiles.fullName,
        uploaderEmail: users.email,
      })
      .from(resourceShares)
      .innerJoin(resources, eq(resources.id, resourceShares.resourceId))
      .leftJoin(profiles, eq(profiles.userId, resources.uploaderId))
      .leftJoin(users, eq(users.id, resources.uploaderId))
      .where(eq(resourceShares.targetUserId, user.id))
      .orderBy(desc(resourceShares.sharedAt))
      .limit(3),
    (async () => {
      try {
        return await db
          .select({
            id: mentorRequests.id,
            status: mentorRequests.status,
            createdAt: mentorRequests.createdAt,
          })
          .from(mentorRequests)
          .where(
            and(
              eq(mentorRequests.studentId, user.id),
              eq(mentorRequests.status, "pending"),
            ),
          )
          .orderBy(desc(mentorRequests.createdAt))
          .limit(1);
      } catch {
        // Table may not exist yet — return empty array
        return [];
      }
    })(),
  ]);

  const profile = profileRow[0] ?? null;
  const firstName =
    (profile?.fullName ?? user.fullName).trim().split(/\s+/)[0] || "there";
  const mentor = assignmentRows[0] ?? null;
  const mentorSubjects: string[] = Array.isArray(mentor?.mentorSubjects)
    ? (mentor!.mentorSubjects as string[])
    : [];

  const mySessionIds = myParticipations.map((p: any) => p.sessionId);

  let nextSession: { id: string; title: string; scheduledAt: Date } | null = null;
  let sessionsCompletedCount = 0;
  if (mySessionIds.length > 0) {
    const [nextRows, completedRow] = await Promise.all([
      db
        .select({
          id: sessions.id,
          title: sessions.title,
          scheduledAt: sessions.scheduledAt,
        })
        .from(sessions)
        .where(
          and(
            inArray(sessions.id, mySessionIds),
            or(eq(sessions.status, "scheduled"), eq(sessions.status, "live")),
            gte(sessions.scheduledAt, new Date(Date.now() - 60 * 60 * 1000)),
          ),
        )
        .orderBy(sessions.scheduledAt)
        .limit(1),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(sessions)
        .where(
          and(
            inArray(sessions.id, mySessionIds),
            eq(sessions.status, "completed"),
          ),
        ),
    ]);
    nextSession = nextRows[0] ?? null;
    sessionsCompletedCount = completedRow[0]?.count ?? 0;
  }

  const lastMessage = lastMessageRow[0] ?? null;

  const greeting = greetingFor(new Date());
  const examTarget = examTargetLabel(profile?.targetExam, profile?.targetYear);

  const subtitle = examTarget;

  const mentorDisplayName = mentor?.mentorName ?? mentor?.mentorEmail ?? "";

  return (
    <StudentDashboardClient studentName={firstName}>
    <Shell
      role="student"
      active="dashboard"
      pageCode="S.03 — DASHBOARD"
      pageTitle={`${greeting}, ${firstName}.`}
      pageSubtitle={subtitle}
      user={user}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {mentor ? (
          <Card className="lg:col-span-2">
            <CardHeader
              meta="YOUR MENTOR"
              title={mentorDisplayName}
              action={<Pill tone="primary">Mentor</Pill>}
            />
            <CardBody className="flex gap-5">
              <div className="avatar !w-14 !h-14 !text-xl">
                {initials(mentorDisplayName)}
              </div>
              <div className="flex-1 min-w-0">
                {mentor.mentorInstitute && (
                  <div className="text-sm text-ink-soft">
                    {mentor.mentorInstitute}
                  </div>
                )}
                {mentorSubjects.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {mentorSubjects.map((s) => (
                      <Pill key={s} tone="primary">
                        {s}
                      </Pill>
                    ))}
                  </div>
                )}
                {lastMessage ? (
                  <p className="text-sm text-ink mt-4 italic">
                    &ldquo;{lastMessage.body}&rdquo;
                  </p>
                ) : (
                  <p className="text-sm text-ink-faint mt-4 italic">
                    No messages yet — say hello to your mentor.
                  </p>
                )}
                <div className="flex items-center gap-4 mt-4">
                  <LinkButton href="/student/chat" size="md">
                    Open chat →
                  </LinkButton>
                  <span className="meta">
                    Active{" "}
                    {lastMessage
                      ? formatLastSeen(lastMessage.createdAt)
                      : mentor.mentorLastLogin
                        ? formatLastSeen(mentor.mentorLastLogin)
                        : "recently"}{" "}
                    ago
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>
        ) : (
          <Card className="lg:col-span-2">
            <CardHeader meta="YOUR MENTOR" title="No mentor assigned" />
            <CardBody>
              <p className="text-sm text-ink-soft">
                You don&apos;t have a mentor assigned yet. Request one and an admin
                will match you with the right IITian mentor.
              </p>
              <RequestMentorButton existingRequest={mentorRequestRow[0] ?? null} />
            </CardBody>
          </Card>
        )}

        <Card>
          <CardHeader
            meta={nextSession ? formatDateLabel(nextSession.scheduledAt) : "UPCOMING"}
            title="Next Session"
          />
          <CardBody>
            {nextSession ? (
              <>
                <div className="font-serif text-2xl">
                  {formatSessionDateLabel(nextSession.scheduledAt)}
                </div>
                <div className="text-sm text-ink-soft mt-2">
                  {nextSession.title}
                </div>
                <LinkButton
                  href="/student/sessions"
                  size="md"
                  className="mt-5 w-full"
                >
                  Join session →
                </LinkButton>
              </>
            ) : (
              <>
                <div className="font-serif text-2xl text-ink-soft">
                  No upcoming sessions
                </div>
                <div className="text-sm text-ink-soft mt-2">
                  Schedule a session with your mentor.
                </div>
                <LinkButton
                  href="/student/sessions"
                  size="md"
                  className="mt-5 w-full"
                >
                  Schedule →
                </LinkButton>
              </>
            )}
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5">
        <Card className="lg:col-span-2">
          <CardHeader
            meta="RECENT RESOURCES"
            title="Shared with you"
            action={
              <LinkButton href="/student/resources" variant="ghost" size="sm">
                View all
              </LinkButton>
            }
          />
          {recentResourcesShared.length === 0 ? (
            <CardBody>
              <p className="text-sm text-ink-soft text-center">
                No resources shared with you yet.
              </p>
            </CardBody>
          ) : (
            <ul>
              {recentResourcesShared.map((r: any) => (
                <li
                  key={r.id}
                  className="flex items-center justify-between px-5 py-3 border-t border-rule first:border-t-0"
                >
                  <div>
                    <div className="font-medium text-sm">{r.title}</div>
                    <div className="meta mt-1">
                      {formatKindLabel(r.kind)}
                      {r.sizeBytes ? ` · ${formatResourceSize(r.sizeBytes)}` : ""}
                    </div>
                  </div>
                  <LinkButton href="/student/resources" variant="ghost" size="sm">
                    Open
                  </LinkButton>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <CardHeader meta="DAILY INSIGHT" title="From your mentor" />
          <CardBody>
            {recentAnswers.length === 0 ? (
              <p className="text-sm text-ink-soft italic">
                Insights from your mentor will appear here after your first
                session.
              </p>
            ) : (
              <ul className="space-y-3">
                {recentAnswers.map((a: any) => (
                  <li
                    key={a.id}
                    className="border-b border-rule last:border-0 pb-3 last:pb-0"
                  >
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <Pill tone="primary">{subjectLabel(a.subject)}</Pill>
                      <span className="meta">{elapsedFrom(a.answeredAt)} ago</span>
                    </div>
                    <p className="text-sm text-ink-soft italic">
                      &ldquo;{a.answerBody}&rdquo;
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-5">
        <Card className="p-5">
          <div className="meta">Doubts resolved</div>
          <div className="font-serif text-3xl text-primary-deep mt-2">
            {doubtsAnsweredCount}
          </div>
        </Card>
        <Card className="p-5">
          <div className="meta">Sessions attended</div>
          <div className="font-serif text-3xl text-primary-deep mt-2">
            {sessionsCompletedCount}
          </div>
        </Card>
        <Card className="p-5">
          <div className="meta">Resources saved</div>
          <div className="font-serif text-3xl text-primary-deep mt-2">
            {resourcesReceivedCount}
          </div>
        </Card>
      </div>

      
    </Shell>
    </StudentDashboardClient>
  );
}
