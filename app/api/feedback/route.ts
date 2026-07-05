import { NextResponse } from "next/server";
import { eq, and, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { mentorFeedbacks, assignments, users, profiles } from "@/db/schema";

export const dynamic = "force-dynamic";

// GET feedbacks list
export async function GET() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  try {
    if (currentUser.role === "student") {
      // Students see their own feedback
      const list = await db
        .select({
          id: mentorFeedbacks.id,
          rating: mentorFeedbacks.rating,
          content: mentorFeedbacks.content,
          createdAt: mentorFeedbacks.createdAt,
          mentorName: profiles.fullName,
        })
        .from(mentorFeedbacks)
        .leftJoin(profiles, eq(mentorFeedbacks.mentorId, profiles.userId))
        .where(eq(mentorFeedbacks.studentId, currentUser.id))
        .orderBy(desc(mentorFeedbacks.createdAt));

      return NextResponse.json({ ok: true, feedbacks: list });
    }

    if (currentUser.role === "mentor") {
      // Mentors see feedback left by their matched students
      const list = await db
        .select({
          id: mentorFeedbacks.id,
          rating: mentorFeedbacks.rating,
          content: mentorFeedbacks.content,
          createdAt: mentorFeedbacks.createdAt,
          studentName: profiles.fullName,
        })
        .from(mentorFeedbacks)
        .leftJoin(profiles, eq(mentorFeedbacks.studentId, profiles.userId))
        .where(eq(mentorFeedbacks.mentorId, currentUser.id))
        .orderBy(desc(mentorFeedbacks.createdAt));

      return NextResponse.json({ ok: true, feedbacks: list });
    }

    if (currentUser.role === "admin") {
      // Admins see all feedbacks
      const list = await db
        .select({
          id: mentorFeedbacks.id,
          rating: mentorFeedbacks.rating,
          content: mentorFeedbacks.content,
          createdAt: mentorFeedbacks.createdAt,
          studentId: mentorFeedbacks.studentId,
          mentorId: mentorFeedbacks.mentorId,
        })
        .from(mentorFeedbacks)
        .orderBy(desc(mentorFeedbacks.createdAt));

      // Resolve user details manually to keep queries simple and fast
      const userList = await db
        .select({ id: users.id, fullName: profiles.fullName })
        .from(users)
        .leftJoin(profiles, eq(users.id, profiles.userId));
      const userMap = new Map(
        (userList as { id: string; fullName: string | null }[]).map(u => [u.id, u.fullName || "Unknown"])
      );

      const enrichedList = (list as any[]).map((item: any) => ({
        ...item,
        studentName: userMap.get(item.studentId) || "Unknown Student",
        mentorName: userMap.get(item.mentorId) || "Unknown Mentor",
      }));

      return NextResponse.json({ ok: true, feedbacks: enrichedList });
    }

    return NextResponse.json({ ok: false, error: "Forbidden." }, { status: 403 });
  } catch (err: any) {
    console.error("[/api/feedback] fetch failed:", err);
    return NextResponse.json({ ok: false, error: "Failed to fetch feedback logs." }, { status: 500 });
  }
}

// POST new feedback (Students only)
export async function POST(request: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  if (currentUser.role !== "student") {
    return NextResponse.json({ ok: false, error: "Only students can submit feedback." }, { status: 403 });
  }

  let body: { rating?: number; content?: string; sessionId?: string } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const rating = Number(body.rating);
  const content = typeof body.content === "string" ? body.content.trim() : "";

  if (isNaN(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ ok: false, error: "Rating must be a number between 1 and 5." }, { status: 400 });
  }

  if (!content) {
    return NextResponse.json({ ok: false, error: "Feedback content is required." }, { status: 400 });
  }

  try {
    // Find active assignment for the student to identify their mentor
    const [assignment] = await db
      .select({ mentorId: assignments.mentorId, status: assignments.status })
      .from(assignments)
      .where(and(eq(assignments.studentId, currentUser.id), eq(assignments.status, "active")))
      .limit(1);

    if (!assignment) {
      return NextResponse.json({
        ok: false,
        error: "You do not have an active mentor assigned yet to provide feedback for.",
      }, { status: 400 });
    }

    const sessionId = typeof body.sessionId === "string" && body.sessionId.trim() ? body.sessionId.trim() : null;

    // Insert feedback record
    const [inserted] = await db
      .insert(mentorFeedbacks)
      .values({
        studentId: currentUser.id,
        mentorId: assignment.mentorId,
        sessionId,
        rating,
        content,
      })
      .returning();

    return NextResponse.json({ ok: true, feedback: inserted });
  } catch (err: any) {
    console.error("[/api/feedback] submit failed:", err);
    return NextResponse.json({ ok: false, error: "Failed to submit feedback. Please try again." }, { status: 500 });
  }
}
