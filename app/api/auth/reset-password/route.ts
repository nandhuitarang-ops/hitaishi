import { NextRequest, NextResponse } from "next/server";
import { and, eq, gt } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { hashPassword } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    if (!token || !password || password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    // Verify token is active and not expired
    const [user] = await db
      .select({ id: users.id })
      .from(users)
      .where(and(eq(users.passwordResetToken, token), gt(users.passwordResetExpires, new Date())))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired password reset link. Please contact the admin." },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);

    // Update user password and clear token
    await db
      .update(users)
      .set({
        passwordHash,
        passwordResetToken: null,
        passwordResetExpires: null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    return NextResponse.json({ success: true, message: "Password updated successfully." });
  } catch (err: any) {
    console.error("[POST /api/auth/reset-password] failed:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error." },
      { status: 500 }
    );
  }
}
