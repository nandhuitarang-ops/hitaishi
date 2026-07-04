import { NextResponse } from "next/server";
import { z } from "zod";
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { examResults } from "@/db/schema";
import { getCurrentUser } from "@/lib/session";

const createSchema = z.object({
  examName: z.string().min(1, "Exam name is required").max(200),
  subject: z.string().max(100).optional(),
  score: z.coerce.number().min(0, "Score must be 0 or more"),
  totalMarks: z.coerce.number().min(0).optional(),
  feedback: z.string().max(2000).optional(),
});

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await db
    .select()
    .from(examResults)
    .where(eq(examResults.userId, user.id))
    .orderBy(desc(examResults.createdAt));

  return NextResponse.json(rows, {
    headers: {
      "Cache-Control": "private, max-age=30, stale-while-revalidate=120",
    },
  });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues.map((i) => i.message).join("; ") },
      { status: 400 },
    );
  }

  const { examName, subject, score, totalMarks, feedback } = parsed.data;

  const [row] = await db
    .insert(examResults)
    .values({
      userId: user.id,
      examName,
      subject: subject ?? null,
      score: score.toString(),
      totalMarks: totalMarks?.toString() ?? null,
      feedback: feedback ?? null,
    })
    .returning();

  return NextResponse.json(row, {
    status: 201,
    headers: { "Cache-Control": "private, max-age=0" },
  });
}
