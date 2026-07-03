import { NextRequest } from "next/server";
import { eq, and, not, inArray, sql } from "drizzle-orm";
import { fail, ok } from "@/lib/api";
import { db } from "@/lib/db";
import { users, profiles, assignments } from "@/db/schema";
import { getCurrentUser } from "@/lib/session";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user)
    return Response.json(fail("unauthorized"), { status: 401 });
  if (user.role !== "admin")
    return Response.json(fail("forbidden"), { status: 403 });

  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get("studentId");

  if (!studentId || !UUID_RE.test(studentId)) {
    return Response.json(
      fail("valid studentId query param required"),
      { status: 400 },
    );
  }

  try {
    const existingAssignments = await db
      .select({ mentorId: assignments.mentorId })
      .from(assignments)
      .where(
        and(
          eq(assignments.studentId, studentId),
          eq(assignments.status, "active"),
        ),
      );

    const excludedMentorIds = existingAssignments.map(
      (a: { mentorId: string }) => a.mentorId,
    );

    const conditions = [
      eq(users.role, "mentor"),
      eq(users.status, "active"),
    ] as any[];

    if (excludedMentorIds.length > 0) {
      conditions.push(not(inArray(users.id, excludedMentorIds)));
    }

    const mentors = await db
      .select({
        id: users.id,
        fullName: profiles.fullName,
        email: users.email,
        institute: profiles.institute,
        subjectsFocus: profiles.subjectsFocus,
        bio: profiles.bio,
        currentStudentCount: sql<number>`count(${assignments.id})::int`,
      })
      .from(users)
      .leftJoin(profiles, eq(profiles.userId, users.id))
      .leftJoin(
        assignments,
        and(
          eq(assignments.mentorId, users.id),
          eq(assignments.status, "active"),
        ),
      )
      .where(and(...conditions))
      .groupBy(
        users.id,
        profiles.fullName,
        profiles.institute,
        profiles.subjectsFocus,
        profiles.bio,
        users.email,
      );

    return Response.json(ok(mentors));
  } catch (err) {
    console.error("get available mentors error:", err);
    return Response.json(
      fail("failed to fetch available mentors"),
      { status: 500 },
    );
  }
}
