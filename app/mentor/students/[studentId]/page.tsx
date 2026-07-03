import Link from "next/link";
import { redirect } from "next/navigation";
import { Shell } from "@/components/Shell";
import { PrivacyNoticeBanner } from "@/components/PrivacyNoticeBanner";
import { Card, CardBody, CardHeader, LinkButton, Pill, Textarea } from "@/components/ui";
import { initials } from "@/lib/format";
import { db } from "@/lib/db";
import {
  assignments,
  conversations,
  conversationParticipants,
  messages,
  profiles,
  sessionParticipants,
  sessions,
  users,
} from "@/db/schema";
import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { requireRole } from "@/lib/session";

export const dynamic = "force-dynamic";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface PageProps {
  params: Promise<{ studentId: string }>;
}

export default async function MentorStudentDetailPage({ params }: PageProps) {
  const { studentId } = await params;
  const user = await requireRole("mentor");

  if (!UUID_RE.test(studentId)) {
    redirect("/mentor/students");
  }

  const [studentRow] = await db
    .select({
      id: users.id,
      fullName: profiles.fullName,
      email: users.email,
      photoUrl: profiles.photoUrl,
      targetExam: profiles.targetExam,
      targetYear: profiles.targetYear,
      institute: profiles.institute,
      lastLoginAt: users.lastLoginAt,
    })
    .from(users)
    .leftJoin(profiles, eq(profiles.userId, users.id))
    .where(eq(users.id, studentId))
    .limit(1);

  if (!studentRow) {
    redirect("/mentor/students");
  }

  const [assignmentRow] = await db
    .select({ id: assignments.id, startedAt: assignments.startedAt })
    .from(assignments)
    .where(
      and(
        eq(assignments.mentorId, user.id),
        eq(assignments.studentId, studentId),
        eq(assignments.status, "active"),
      ),
    )
    .limit(1);

  if (!assignmentRow) {
    redirect("/mentor/students");
  }

  const mentorConvs = await db
    .select({ id: conversations.id })
    .from(conversations)
    .innerJoin(
      conversationParticipants,
      eq(conversationParticipants.conversationId, conversations.id),
    )
    .where(
      and(
        eq(conversationParticipants.userId, user.id),
        eq(conversations.type, "student_mentor"),
      ),
    );

  let conversationId: string | null = null;
  if (mentorConvs.length) {
    const ids = mentorConvs.map((c: any) => c.id);
    const shared = await db
      .select({ id: conversationParticipants.conversationId })
      .from(conversationParticipants)
      .where(
        and(
          inArray(conversationParticipants.conversationId, ids),
          eq(conversationParticipants.userId, studentId),
        ),
      )
      .limit(1);
    conversationId = shared[0]?.id ?? null;
  }

  const messageRows = conversationId
    ? await db
        .select({
          id: messages.id,
          senderId: messages.senderId,
          body: messages.body,
          attachments: messages.attachments,
          createdAt: messages.createdAt,
        })
        .from(messages)
        .where(eq(messages.conversationId, conversationId))
        .orderBy(desc(messages.createdAt))
        .limit(20)
    : [];

  messageRows.reverse();

  const pastSessionRows = await db
    .select({
      id: sessions.id,
      title: sessions.title,
      endedAt: sessions.endedAt,
      startedAt: sessions.startedAt,
      durationMinutes: sessions.durationMinutes,
    })
    .from(sessions)
    .innerJoin(sessionParticipants, eq(sessionParticipants.sessionId, sessions.id))
    .where(
      and(
        eq(sessionParticipants.userId, studentId),
        eq(sessions.status, "completed"),
      ),
    )
    .orderBy(desc(sessions.endedAt))
    .limit(20);

  const studentName = studentRow.fullName ?? studentRow.email.split("@")[0];
  const targetLabel = studentRow.targetYear
    ? `IIT-JEE ${studentRow.targetYear}`
    : studentRow.institute ?? "Student";

  const messagesView = messageRows.map((m: any) => ({
    id: m.id,
    from: (m.senderId === user.id ? "mentor" : "student") as "mentor" | "student",
    body: m.body,
    at: new Date(m.createdAt).toLocaleString("en-IN", {
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
  }));

  const pastSessionsView = pastSessionRows.map((p: any) => {
    const at = p.endedAt ?? p.startedAt;
    return {
      id: p.id,
      title: p.title,
      at: at ? new Date(at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—",
      duration: `${p.durationMinutes} min`,
    };
  });

  return (
    <Shell
      role="mentor"
      active="students"
      pageCode="M.05 — STUDENT CONVERSATION"
      pageTitle={studentName}
      pageSubtitle={`${targetLabel} · ${studentRow.email}`}
      actions={
        <div className="flex items-center gap-2">
          <Link href="/mentor/students" className="chip-ghost text-xs">
            ← Back to roster
          </Link>
          <LinkButton href={`/session/${studentRow.id}`} size="sm">
            Schedule session
          </LinkButton>
        </div>
      }
    >
      <PrivacyNoticeBanner />
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
        <div className="flex flex-col gap-5">
          <Card className="flex flex-col" style={{ minHeight: "60vh" }}>
            <CardHeader meta="MESSAGES" title="Conversation" />
            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
              {messagesView.length === 0 ? (
                <div className="text-sm text-ink-soft text-center py-6">
                  No messages yet.
                </div>
              ) : (
                messagesView.map((m: any) => (
                  <div
                    key={m.id}
                    className={`flex gap-3 ${m.from === "mentor" ? "flex-row-reverse" : ""}`}
                  >
                    <div className="avatar !w-8 !h-8 !text-xs flex-shrink-0">
                      {m.from === "mentor" ? "M" : initials(studentName)}
                    </div>
                    <div
                      className={`max-w-[70%] flex flex-col ${m.from === "mentor" ? "items-end" : ""}`}
                    >
                      <div
                        className={`rounded-card px-4 py-3 text-sm ${m.from === "mentor" ? "bg-primary text-primary-on" : "bg-surface-elevated text-ink"}`}
                      >
                        {m.body}
                      </div>
                      <span className="meta mt-1">{m.at}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="border-t border-rule p-4 flex items-center gap-3">
              <input
                placeholder={`Reply to ${studentName}…`}
                className="flex-1 rounded-input border border-rule-strong px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
              <button className="chip-cta">Send</button>
            </div>
          </Card>

          <Card>
            <CardHeader meta="PRIVATE NOTES" title="Mentor scratchpad" action={<span className="meta">auto-saves</span>} />
            <CardBody>
              <Textarea
                placeholder="Add private notes about this student…"
                rows={4}
              />
            </CardBody>
          </Card>
        </div>

        <div className="flex flex-col gap-5">
          <Card>
            <CardHeader meta="PROFILE" title="Snapshot" />
            <CardBody>
              <div className="meta">JOINED</div>
              <div className="text-sm">
                {new Date(assignmentRow.startedAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </div>
              <div className="meta mt-3">LAST LOGIN</div>
              <div className="text-sm">
                {studentRow.lastLoginAt
                  ? new Date(studentRow.lastLoginAt).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })
                  : "Never"}
              </div>
              <div className="meta mt-3">EMAIL</div>
              <div className="text-sm font-mono">{studentRow.email}</div>
              {studentRow.targetExam && (
                <>
                  <div className="meta mt-3">TARGET EXAM</div>
                  <div className="text-sm">{studentRow.targetExam}</div>
                </>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader meta="PAST SESSIONS" title="Recordings" />
            {pastSessionsView.length === 0 ? (
              <CardBody>
                <div className="text-sm text-ink-soft text-center py-4">
                  No past sessions yet.
                </div>
              </CardBody>
            ) : (
              <ul>
                {pastSessionsView.map((s: any) => (
                  <li
                    key={s.id}
                    className="flex items-center justify-between gap-3 px-5 py-3 border-t border-rule first:border-t-0"
                  >
                    <div className="min-w-0">
                      <div className="text-sm truncate">{s.title}</div>
                      <div className="meta mt-1">
                        {s.at} · {s.duration}
                      </div>
                    </div>
                    <LinkButton href="/mentor/students" variant="ghost" size="sm">
                      Watch
                    </LinkButton>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card>
            <CardHeader meta="SHARED RESOURCES" title="Recent" />
            <CardBody>
              <div className="text-sm text-ink-soft text-center py-2">
                No shared resources yet.
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </Shell>
  );
}
