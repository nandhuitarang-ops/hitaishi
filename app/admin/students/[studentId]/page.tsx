import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Shell } from "@/components/Shell";
import { Card, CardBody, CardHeader, LinkButton, Pill, Button } from "@/components/ui";
import { initials, formatLastSeen } from "@/lib/format";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/session";
import { users, profiles, assignments, mentorRequests, sessions, sessionParticipants } from "@/db/schema";
import { and, desc, eq, sql, inArray } from "drizzle-orm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Student Details — Hitaishi Admin",
  robots: "noindex, nofollow",
};

export default async function AdminStudentProfilePage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const user = await requireRole("admin");

  const { studentId } = await params;

  // Fetch student with profile
  const [studentRow] = await db
    .select()
    .from(users)
    .leftJoin(profiles, eq(profiles.userId, users.id))
    .where(and(eq(users.id, studentId), eq(users.role, "student")))
    .limit(1);

  if (!studentRow) notFound();

  const student = studentRow.users;
  const profile = studentRow.profiles;
  const name = profile?.fullName ?? student.email.split("@")[0];

  // Fetch current active mentor and pending mentor request in parallel
  const [mentorRow, requestRow] = await Promise.all([
    db
      .select({
        mentorId: assignments.mentorId,
        mentorName: profiles.fullName,
        mentorEmail: users.email,
        mentorInstitute: profiles.institute,
        mentorSubjects: profiles.subjectsFocus,
        mentorBio: profiles.bio,
        startedAt: assignments.startedAt,
      })
      .from(assignments)
      .innerJoin(users, eq(users.id, assignments.mentorId))
      .leftJoin(profiles, eq(profiles.userId, assignments.mentorId))
      .where(and(eq(assignments.studentId, studentId), eq(assignments.status, "active")))
      .orderBy(desc(assignments.startedAt))
      .limit(1),
    db
      .select()
      .from(mentorRequests)
      .where(and(eq(mentorRequests.studentId, studentId), eq(mentorRequests.status, "pending")))
      .limit(1)
      .catch(() => [] as any[]),
  ]);

  const mentor = mentorRow[0] ?? null;
  const request = requestRow[0] ?? null;
  const hasMentor = !!mentor;
  const hasPendingRequest = !!request;

  // Fetch sessions student is a participant of
  const studentSessionMappings = await db
    .select({
      sessionId: sessionParticipants.sessionId,
    })
    .from(sessionParticipants)
    .where(eq(sessionParticipants.userId, studentId));
  
  const studentSessionIds = studentSessionMappings.map((sm: any) => sm.sessionId);
  
  let studentSessions: any[] = [];
  const studentSessionParticipantsMap = new Map<string, any[]>();
  
  if (studentSessionIds.length) {
    studentSessions = await db
      .select({
        id: sessions.id,
        title: sessions.title,
        type: sessions.type,
        status: sessions.status,
        scheduledAt: sessions.scheduledAt,
        durationMinutes: sessions.durationMinutes,
        meetLink: sessions.meetLink,
        startedAt: sessions.startedAt,
        endedAt: sessions.endedAt,
        hostName: profiles.fullName,
        hostEmail: users.email,
      })
      .from(sessions)
      .innerJoin(users, eq(users.id, sessions.hostId))
      .leftJoin(profiles, eq(profiles.userId, sessions.hostId))
      .where(inArray(sessions.id, studentSessionIds))
      .orderBy(desc(sessions.scheduledAt));

    const participants = await db
      .select({
        sessionId: sessionParticipants.sessionId,
        userId: users.id,
        fullName: profiles.fullName,
        email: users.email,
        roleInSession: sessionParticipants.roleInSession,
        joinedAt: sessionParticipants.joinedAt,
        leftAt: sessionParticipants.leftAt,
      })
      .from(sessionParticipants)
      .innerJoin(users, eq(users.id, sessionParticipants.userId))
      .leftJoin(profiles, eq(profiles.userId, users.id))
      .where(inArray(sessionParticipants.sessionId, studentSessionIds));
    for (const p of participants) {
      const arr = studentSessionParticipantsMap.get(p.sessionId) ?? [];
      arr.push(p);
      studentSessionParticipantsMap.set(p.sessionId, arr);
    }
  }

  // Count of completed sessions attended by the student
  const completedSessionsCount = studentSessions.filter((s: any) => s.status === "completed").length;

  return (
    <Shell
      role="admin"
      active="students"
      pageCode="A.03 — STUDENT PROFILE"
      pageTitle={name}
      pageSubtitle={student.email}
      user={user}
      actions={
        <LinkButton href="/admin/students" variant="ghost" size="sm">
          ← Back to Students
        </LinkButton>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* LEFT: Student Info */}
        <div className="lg:col-span-1 space-y-5">
          <Card>
            <CardBody className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="avatar !w-20 !h-20 !text-2xl mb-4">
                  {initials(name)}
                </div>
                <h2 className="font-serif text-xl font-semibold">{name}</h2>
                <p className="meta mt-1">{student.email}</p>
                {student.phone && <p className="text-sm text-ink-soft mt-1">{student.phone}</p>}
                <div className="mt-4">
                  <Pill tone="primary">{student.status}</Pill>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-rule space-y-3">
                <ProfileField label="Class" value={profile?.currentClass} />
                <ProfileField label="Board" value={profile?.board} />
                <ProfileField label="Target Exam" value={profile?.targetExam} />
                <ProfileField label="Target Year" value={profile?.targetYear?.toString()} />
                <ProfileField label="City" value={profile?.city} />
                <ProfileField label="Last Login" value={student.lastLoginAt ? formatLastSeen(student.lastLoginAt) + " ago" : "Never"} />
              </div>
            </CardBody>
          </Card>

          {hasPendingRequest && (
            <Card className="border-amber-200 bg-amber-50">
              <CardHeader meta="PENDING REQUEST" title="Mentor Requested" />
              <CardBody>
                <p className="text-sm text-ink-soft">
                  {request.message || "This student has requested a mentor."}
                </p>
                <p className="text-xs text-ink-faint mt-2">
                  Requested {formatLastSeen(request.createdAt)} ago
                </p>
              </CardBody>
            </Card>
          )}
        </div>

        {/* RIGHT: Mentor + Actions */}
        <div className="lg:col-span-2 space-y-5">
          {hasMentor ? (
            <Card>
              <CardHeader
                meta="CURRENT MENTOR"
                title={mentor.mentorName ?? mentor.mentorEmail}
                action={<Pill tone="primary">Active</Pill>}
              />
              <CardBody className="flex gap-5">
                <div className="avatar !w-14 !h-14 !text-xl">
                  {initials(mentor.mentorName ?? mentor.mentorEmail ?? "")}
                </div>
                <div className="flex-1 min-w-0">
                  {mentor.mentorInstitute && (
                    <p className="text-sm text-ink-soft">{mentor.mentorInstitute}</p>
                  )}
                  {mentor.mentorSubjects && Array.isArray(mentor.mentorSubjects) && (
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {(mentor.mentorSubjects as string[]).map((s) => (
                        <Pill key={s} tone="primary">{s}</Pill>
                      ))}
                    </div>
                  )}
                  {mentor.mentorBio && (
                    <p className="text-sm text-ink-soft mt-3 italic">&ldquo;{mentor.mentorBio}&rdquo;</p>
                  )}
                  <p className="text-xs text-ink-faint mt-3">
                    Assigned {mentor.startedAt ? formatLastSeen(mentor.startedAt) + " ago" : "recently"}
                  </p>
                </div>
              </CardBody>
            </Card>
          ) : (
            <Card className="border-dashed border-2">
              <CardHeader meta="MENTORSHIP" title="No mentor assigned" />
              <CardBody>
                <p className="text-sm text-ink-soft">
                  This student does not have a mentor yet.
                  {hasPendingRequest
                    ? " They have a pending request — match them now."
                    : " You can assign one manually."}
                </p>
              </CardBody>
            </Card>
          )}

          {/* Action Card */}
          <Card className="bg-primary/[0.03] border-primary/20">
            <CardBody className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-serif text-lg font-semibold text-ink">
                    {hasMentor ? "Reassign Mentor" : "Match with Mentor"}
                  </h3>
                  <p className="text-sm text-ink-soft mt-1 max-w-md">
                    {hasMentor
                      ? "Replace the current mentor with a new one. The old assignment will be ended."
                      : "Browse available mentors and assign the best match for this student."}
                  </p>
                </div>
                <LinkButton
                  href={`/admin/students/${studentId}/match`}
                  size="lg"
                >
                  {hasMentor ? "Change Mentor →" : "Match Mentor →"}
                </LinkButton>
              </div>
            </CardBody>
          </Card>

          {/* Stats / Activity placeholder */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-5">
              <div className="meta">Sessions attended</div>
              <div className="font-serif text-3xl text-primary-deep mt-2">{completedSessionsCount}</div>
            </Card>
            <Card className="p-5">
              <div className="meta">Doubts resolved</div>
              <div className="font-serif text-3xl text-primary-deep mt-2">—</div>
            </Card>
          </div>

          {/* Session History & Logs Card */}
          <Card>
            <CardHeader
              meta="SESSION HISTORY & LOGS"
              title={`Scheduled Sessions (${studentSessions.length})`}
            />
            {studentSessions.length === 0 ? (
              <CardBody>
                <p className="text-sm text-ink-soft text-center py-6">
                  No sessions have been scheduled for this student yet.
                </p>
              </CardBody>
            ) : (
              <div className="divide-y divide-rule">
                {studentSessions.map((s: any) => {
                  const attendees = studentSessionParticipantsMap.get(s.id) ?? [];
                  const studentLog = attendees.find((att: any) => att.userId === studentId);
                  const hostName = s.hostName ?? s.hostEmail.split("@")[0];
                  return (
                    <div key={s.id} className="p-5 space-y-4">
                      {/* Session Header */}
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <h4 className="font-serif text-base font-semibold text-ink">{s.title}</h4>
                          <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-ink-soft">
                            <span className="font-mono">{formatSessionTime(s.scheduledAt)}</span>
                            <span>•</span>
                            <span>{s.durationMinutes} mins</span>
                            <span>•</span>
                            <span>Host: {hostName}</span>
                            <span>•</span>
                            <Pill tone={s.status === "completed" ? "primary" : s.status === "live" ? "coral" : s.status === "cancelled" ? "error" : "warn"}>
                              {s.status.toUpperCase()}
                            </Pill>
                          </div>
                        </div>
                        {s.meetLink && s.status !== "completed" && s.status !== "cancelled" && (
                          <a
                            href={s.meetLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-button bg-primary text-white px-3 py-1.5 text-xs hover:bg-primary-deep transition-colors"
                          >
                            Join Call
                          </a>
                        )}
                      </div>

                      {/* Participant Logs */}
                      {studentLog && (
                        <div className="bg-surface-elevated/40 rounded-card border border-rule p-3 flex flex-wrap items-center justify-between text-xs gap-3">
                          <div className="font-medium text-ink">Your Attendance Log</div>
                          <div className="flex items-center gap-4 text-ink-soft font-mono">
                            <div>
                              <span className="text-[10px] text-ink-faint mr-1">IN:</span>
                              <span>{formatLogTime(studentLog.joinedAt)}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-ink-faint mr-1">OUT:</span>
                              <span>{formatLogTime(studentLog.leftAt)}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </div>
    </Shell>
  );
}

const formatSessionTime = (d: Date | string) => {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(d));
};

const formatLogTime = (d: Date | string | null) => {
  if (!d) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(new Date(d));
};

function ProfileField({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex justify-between items-center">
      <span className="text-xs font-mono uppercase tracking-wider text-ink-soft">{label}</span>
      <span className="text-sm font-medium text-ink">{value}</span>
    </div>
  );
}
