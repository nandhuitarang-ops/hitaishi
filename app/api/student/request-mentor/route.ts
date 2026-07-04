import { NextResponse } from "next/server";
import { eq, and, gte, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { mentorRequests } from "@/db/schema";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

/**
 * POST /api/student/request-mentor
 * Creates a mentor request for the current logged-in student.
 */
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "student") {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { message } = body;

    // Rate limit: max 2 requests per hour per student
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentRequests = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(mentorRequests)
      .where(
        and(
          eq(mentorRequests.studentId, user.id),
          gte(mentorRequests.createdAt, oneHourAgo),
        ),
      );

    const recentCount = recentRequests[0]?.count ?? 0;
    if (recentCount >= 2) {
      return NextResponse.json(
        { ok: false, error: "Rate limit: you can only request a mentor 2 times per hour. Please try again later." },
        { status: 429 },
      );
    }

    // Check if there's already a pending request
    const existing = await db
      .select({ id: mentorRequests.id })
      .from(mentorRequests)
      .where(
        and(
          eq(mentorRequests.studentId, user.id),
          eq(mentorRequests.status, "pending"),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { ok: false, error: "You already have a pending mentor request." },
        { status: 409 },
      );
    }

    // Create the request
    const result = await db
      .insert(mentorRequests)
      .values({
        studentId: user.id,
        message: message || null,
        status: "pending",
      })
      .returning({ id: mentorRequests.id });

    return NextResponse.json(
      { ok: true, requestId: result[0].id },
      { headers: { "Cache-Control": "private, max-age=0" } },
    );
  } catch (err: any) {
    console.error("[/api/student/request-mentor] error:", err);
    return NextResponse.json(
      { ok: false, error: err?.message || "Failed to create mentor request." },
      { status: 500 },
    );
  }
}

/**
 * GET /api/student/request-mentor
 * Returns the current student's pending mentor request, if any.
 */
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "student") {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const rows = await db
      .select({
        id: mentorRequests.id,
        status: mentorRequests.status,
        message: mentorRequests.message,
        createdAt: mentorRequests.createdAt,
      })
      .from(mentorRequests)
      .where(eq(mentorRequests.studentId, user.id))
      .orderBy(mentorRequests.createdAt)
      .limit(1);

    return NextResponse.json(
      { ok: true, request: rows[0] || null },
      {
        headers: {
          "Cache-Control": "private, max-age=30, stale-while-revalidate=120",
        },
      },
    );
  } catch (err: any) {
    console.error("[/api/student/request-mentor] GET error:", err);
    return NextResponse.json(
      { ok: false, error: err?.message || "Failed to fetch mentor request." },
      { status: 500 },
    );
  }
}
