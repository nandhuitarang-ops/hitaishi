import { NextRequest } from "next/server";
import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { fail, ok } from "@/lib/api";
import { db } from "@/lib/db";
import {
  assignments,
  auditLog,
  users,
  profiles,
  conversations,
  conversationParticipants,
  mentorRequests,
  notifications,
} from "@/db/schema";
import { getCurrentUser } from "@/lib/session";
import {
  sendMentorAssignedEmail,
  sendStudentAssignedEmail,
} from "@/lib/emails/email-service";

const bodySchema = z.object({
  studentId: z.string().uuid("Invalid student ID"),
  mentorId: z.string().uuid("Invalid mentor ID"),
});

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return Response.json(fail("unauthorized"), { status: 401 });
  if (user.role !== "admin")
    return Response.json(fail("forbidden"), { status: 403 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json(fail("invalid JSON"), { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      fail(parsed.error.issues.map((i) => i.message).join("; ")),
      { status: 400 },
    );
  }

  const { studentId, mentorId } = parsed.data;

  if (studentId === mentorId) {
    return Response.json(
      fail("student and mentor cannot be the same"),
      { status: 400 },
    );
  }

  try {
    const [studentRow, mentorRow] = await Promise.all([
      db
        .select({ id: users.id, email: users.email, role: users.role })
        .from(users)
        .where(
          and(eq(users.id, studentId), eq(users.role, "student")),
        )
        .limit(1),
      db
        .select({ id: users.id, email: users.email, role: users.role })
        .from(users)
        .where(
          and(eq(users.id, mentorId), eq(users.role, "mentor")),
        )
        .limit(1),
    ]);

    if (!studentRow[0]) {
      return Response.json(fail("student not found"), { status: 404 });
    }
    if (!mentorRow[0]) {
      return Response.json(fail("mentor not found"), { status: 404 });
    }

    const [studentProfile, mentorProfile] = await Promise.all([
      db
        .select()
        .from(profiles)
        .where(eq(profiles.userId, studentId))
        .limit(1),
      db
        .select()
        .from(profiles)
        .where(eq(profiles.userId, mentorId))
        .limit(1),
    ]);

    const now = new Date();

    await db.transaction(async (tx: typeof db) => {
      await tx
        .update(assignments)
        .set({ status: "ended", endedAt: now })
        .where(
          and(
            eq(assignments.studentId, studentId),
            eq(assignments.status, "active"),
          ),
        );

      await tx.insert(assignments).values({
        studentId,
        mentorId,
        status: "active",
        startedAt: now,
      });

      const [conv] = await tx
        .insert(conversations)
        .values({
          type: "student_mentor",
          title: "Student-Mentor Chat",
        })
        .returning({ id: conversations.id });

      await tx.insert(conversationParticipants).values([
        { conversationId: conv.id, userId: studentId },
        { conversationId: conv.id, userId: mentorId },
      ]);

      const pendingRequest = await tx
        .select({ id: mentorRequests.id })
        .from(mentorRequests)
        .where(
          and(
            eq(mentorRequests.studentId, studentId),
            eq(mentorRequests.status, "pending"),
          ),
        )
        .limit(1);

      if (pendingRequest.length > 0) {
        await tx
          .update(mentorRequests)
          .set({ status: "approved", reviewedBy: user.id })
          .where(eq(mentorRequests.id, pendingRequest[0].id));
      }

      await tx.insert(auditLog).values({
        actorId: user.id,
        action: "assignment_created",
        targetType: "assignment",
        targetId: studentId,
        metadata: {
          mentorId,
          adminEmail: user.email,
        },
        createdAt: now,
      });
    });

    const studentName =
      studentProfile[0]?.fullName ||
      studentRow[0].email.split("@")[0];
    const mentorName =
      mentorProfile[0]?.fullName || mentorRow[0].email.split("@")[0];
    const studentClass = studentProfile[0]?.currentClass || "";
    const dashboardLink =
      process.env.NEXT_PUBLIC_APP_URL ||
      "https://www.hitaishii.com";

    try {
      await db.insert(notifications).values([
        {
          recipientId: studentId,
          channel: "in_app",
          templateCode: "mentor_assigned",
          payload: { mentorName, mentorId },
          status: "queued",
        },
        {
          recipientId: mentorId,
          channel: "in_app",
          templateCode: "student_assigned",
          payload: { studentName, studentId },
          status: "queued",
        },
      ]);
    } catch (err) {
      console.error("assignment notifications error:", err);
    }

    try {
      await Promise.all([
        sendMentorAssignedEmail(
          studentRow[0].email,
          studentName,
          mentorName,
          dashboardLink,
        ),
        sendStudentAssignedEmail(
          mentorRow[0].email,
          mentorName,
          studentName,
          studentClass,
          dashboardLink,
        ),
      ]);
    } catch (err) {
      console.error("assignment emails error:", err);
    }

    return Response.json(ok(null), { status: 201 });
  } catch (err) {
    console.error("assign mentor error:", err);
    return Response.json(fail("failed to assign mentor"), {
      status: 500,
    });
  }
}
