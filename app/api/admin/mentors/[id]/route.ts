import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/session";
import { users, assignments } from "@/db/schema";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireRole("admin");
  const { id } = await params;

  try {
    // Check if user exists and is a mentor
    const [mentor] = await db
      .select({ id: users.id })
      .from(users)
      .where(and(eq(users.id, id), eq(users.role, "mentor")))
      .limit(1);

    if (!mentor) {
      return NextResponse.json({ error: "Mentor not found" }, { status: 404 });
    }

    const now = new Date();

    // Perform delete and assignment termination in a transaction
    await db.transaction(async (tx: any) => {
      // Soft-delete the user
      await tx
        .update(users)
        .set({ deletedAt: now, status: "suspended", updatedAt: now })
        .where(eq(users.id, id));

      // End active assignments
      await tx
        .update(assignments)
        .set({ status: "ended", endedAt: now, updatedAt: now })
        .where(and(eq(assignments.mentorId, id), eq(assignments.status, "active")));
    });

    return NextResponse.json({ success: true, message: "Mentor deleted successfully." });
  } catch (err: any) {
    console.error(`[DELETE /api/admin/mentors/${id}] failed:`, err);
    return NextResponse.json({ error: err.message || "Failed to delete mentor." }, { status: 500 });
  }
}
