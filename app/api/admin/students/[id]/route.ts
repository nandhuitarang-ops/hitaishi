import { NextRequest } from "next/server";
import { eq, and } from "drizzle-orm";
import { fail, ok } from "@/lib/api";
import { db } from "@/lib/db";
import {
  users,
  profiles,
  assignments,
  mentorRequests,
} from "@/db/schema";
import { getCurrentUser } from "@/lib/session";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user)
    return Response.json(fail("unauthorized"), { status: 401 });
  if (user.role !== "admin")
    return Response.json(fail("forbidden"), { status: 403 });

  const { id } = await params;

  if (!id || !UUID_RE.test(id)) {
    return Response.json(fail("invalid student id"), { status: 400 });
  }

  try {
    const studentRows = await db
      .select()
      .from(users)
      .leftJoin(profiles, eq(profiles.userId, users.id))
      .where(and(eq(users.id, id), eq(users.role, "student")))
      .limit(1);

    if (studentRows.length === 0) {
      return Response.json(fail("student not found"), { status: 404 });
    }

    const currentMentorRows = await db
      .select({
        assignmentId: assignments.id,
        mentorId: assignments.mentorId,
        startedAt: assignments.startedAt,
        mentorName: profiles.fullName,
        mentorEmail: users.email,
        mentorInstitute: profiles.institute,
      })
      .from(assignments)
      .innerJoin(users, eq(users.id, assignments.mentorId))
      .leftJoin(profiles, eq(profiles.userId, assignments.mentorId))
      .where(
        and(
          eq(assignments.studentId, id),
          eq(assignments.status, "active"),
        ),
      )
      .limit(1);

    const pendingRequestRows = await db
      .select()
      .from(mentorRequests)
      .where(
        and(
          eq(mentorRequests.studentId, id),
          eq(mentorRequests.status, "pending"),
        ),
      )
      .limit(1);

    return Response.json(
      ok({
        student: studentRows[0],
        currentMentor: currentMentorRows[0] ?? null,
        pendingRequest: pendingRequestRows[0] ?? null,
      }),
    );
  } catch (err) {
    console.error("get student error:", err);
    return Response.json(fail("failed to fetch student"), {
      status: 500,
    });
  }
}
