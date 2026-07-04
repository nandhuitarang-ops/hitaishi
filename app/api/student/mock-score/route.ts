import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { examResults, notifications, assignments } from "@/db/schema";
import { getCurrentUser } from "@/lib/session";

const schema = z.object({
  examName: z.string().min(1).max(200),
  score: z.coerce.number().min(0),
  totalMarks: z.coerce.number().min(0).optional(),
  feedback: z.string().max(2000).optional(),
});

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "student") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues.map((i) => i.message).join("; ") },
      { status: 400 },
    );
  }

  const { examName, score, totalMarks, feedback } = parsed.data;

  // Save exam result
  const [row] = await db
    .insert(examResults)
    .values({
      userId: user.id,
      examName,
      score: score.toString(),
      totalMarks: totalMarks?.toString() ?? null,
      feedback: feedback ?? null,
    })
    .returning();

  // Find the assigned mentor
  const [assignment] = await db
    .select({ mentorId: assignments.mentorId })
    .from(assignments)
    .where(eq(assignments.studentId, user.id))
    .limit(1);

  // Notify the mentor via in-app notification
  if (assignment) {
    const scoreText = totalMarks
      ? `${score}/${totalMarks}`
      : `${score}`;

    await db.insert(notifications).values({
      recipientId: assignment.mentorId,
      channel: "in_app",
      templateCode: "mock_score_update",
      payload: JSON.stringify({
        studentId: user.id,
        studentName: user.fullName,
        examName,
        score: scoreText,
        feedback: feedback || null,
        examResultId: row.id,
      }),
      status: "queued",
    });
  }

  return NextResponse.json(row, {
    status: 201,
    headers: { "Cache-Control": "private, max-age=0" },
  });
}
