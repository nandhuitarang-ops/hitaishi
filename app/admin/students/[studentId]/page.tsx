import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Shell } from "@/components/Shell";
import { Card, CardBody, CardHeader, LinkButton, Pill, Button } from "@/components/ui";
import { initials, formatLastSeen } from "@/lib/format";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/session";
import { users, profiles, assignments, mentorRequests } from "@/db/schema";
import { and, desc, eq, sql } from "drizzle-orm";

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
              <div className="font-serif text-3xl text-primary-deep mt-2">—</div>
            </Card>
            <Card className="p-5">
              <div className="meta">Doubts resolved</div>
              <div className="font-serif text-3xl text-primary-deep mt-2">—</div>
            </Card>
          </div>
        </div>
      </div>
    </Shell>
  );
}

function ProfileField({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex justify-between items-center">
      <span className="text-xs font-mono uppercase tracking-wider text-ink-soft">{label}</span>
      <span className="text-sm font-medium text-ink">{value}</span>
    </div>
  );
}
