import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Shell } from "@/components/Shell";
import { Card, CardBody, CardHeader, Pill, LinkButton } from "@/components/ui";
import { initials } from "@/lib/format";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/session";
import { users, profiles, assignments } from "@/db/schema";
import { and, count, desc, eq, isNull, not, inArray, sql } from "drizzle-orm";
import { MatchButton } from "./MatchButton";

export const revalidate = 60;

export default async function AdminMatchMentorPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  await requireRole("admin");

  const { studentId } = await params;

  // Fetch student
  const [studentRow] = await db
    .select()
    .from(users)
    .leftJoin(profiles, eq(profiles.userId, users.id))
    .where(and(eq(users.id, studentId), eq(users.role, "student")))
    .limit(1);

  if (!studentRow) notFound();

  const student = studentRow.users;
  const studentProfile = studentRow.profiles;
  const studentName = studentProfile?.fullName ?? student.email.split("@")[0];

  // Fetch currently assigned mentors to exclude
  const existingAssignments = await db
    .select({ mentorId: assignments.mentorId })
    .from(assignments)
    .where(and(eq(assignments.studentId, studentId), eq(assignments.status, "active")));

  const excludedMentorIds = existingAssignments.map((a: { mentorId: string }) => a.mentorId);

  // Build conditions
  const conditions: any[] = [eq(users.role, "mentor"), eq(users.status, "active"), isNull(users.deletedAt)];
  if (excludedMentorIds.length > 0) {
    conditions.push(not(inArray(users.id, excludedMentorIds)));
  }

  // Fetch available mentors with their active student count
  const mentors: Array<{
    id: string;
    email: string;
    fullName: string | null;
    institute: string | null;
    subjectsFocus: unknown;
    bio: string | null;
    currentStudentCount: number;
  }> = await db
    .select({
      id: users.id,
      email: users.email,
      fullName: profiles.fullName,
      institute: profiles.institute,
      subjectsFocus: profiles.subjectsFocus,
      bio: profiles.bio,
      currentStudentCount: sql<number>`count(${assignments.id})::int`,
    })
    .from(users)
    .leftJoin(profiles, eq(profiles.userId, users.id))
    .leftJoin(
      assignments,
      and(eq(assignments.mentorId, users.id), eq(assignments.status, "active"))
    )
    .where(and(...conditions))
    .groupBy(users.id, profiles.fullName, profiles.institute, profiles.subjectsFocus, profiles.bio, users.email)
    .orderBy(desc(sql`count(${assignments.id})`));

  return (
    <Shell
      role="admin"
      active="students"
      pageCode="A.03 — MATCH MENTOR"
      pageTitle={`Match mentor for ${studentName}`}
      pageSubtitle="Select an available mentor to assign."
      actions={
        <LinkButton href={`/admin/students/${studentId}`} variant="ghost" size="sm">
          ← Back to Profile
        </LinkButton>
      }
    >
      {/* Student Summary */}
      <Card className="mb-5 bg-primary/[0.03] border-primary/20">
        <CardBody className="p-4 flex items-center gap-4">
          <div className="avatar !w-10 !h-10 !text-sm">{initials(studentName)}</div>
          <div>
            <div className="font-medium text-sm">{studentName}</div>
            <div className="meta">{student.email} · {studentProfile?.currentClass ?? "—"} · {studentProfile?.board ?? "—"}</div>
          </div>
        </CardBody>
      </Card>

      {/* Mentors Grid */}
      {mentors.length === 0 ? (
        <Card>
          <CardBody className="py-10 text-center">
            <p className="text-sm text-ink-soft">No available mentors found.</p>
            <p className="text-xs text-ink-faint mt-2">All mentors are already assigned to this student.</p>
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mentors.map((m) => {
            const mentorName = m.fullName ?? m.email.split("@")[0];
            const subjects: string[] = Array.isArray(m.subjectsFocus) ? (m.subjectsFocus as string[]) : [];

            return (
              <Card key={m.id} className="flex flex-col">
                <CardBody className="p-5 flex-1 flex flex-col">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="avatar !w-10 !h-10 !text-sm">{initials(mentorName)}</div>
                    <div className="min-w-0">
                      <div className="font-medium text-sm truncate">{mentorName}</div>
                      <div className="meta truncate">{m.email}</div>
                    </div>
                  </div>

                  {m.institute && (
                    <div className="text-xs text-ink-soft mb-2">{m.institute}</div>
                  )}

                  {subjects.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {subjects.slice(0, 3).map((s) => (
                        <Pill key={s} tone="primary" className="text-[10px] py-0.5 px-2">{s}</Pill>
                      ))}
                      {subjects.length > 3 && (
                        <span className="text-[10px] text-ink-faint">+{subjects.length - 3}</span>
                      )}
                    </div>
                  )}

                  {m.bio && (
                    <p className="text-xs text-ink-soft line-clamp-2 mb-3">{m.bio}</p>
                  )}

                  <div className="mt-auto pt-3 border-t border-rule">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-ink-faint">Active students</span>
                      <span className="text-sm font-medium">{m.currentStudentCount}</span>
                    </div>
                    <MatchButton
                      studentId={studentId}
                      mentorId={m.id}
                      mentorName={mentorName}
                    />
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}
    </Shell>
  );
}
