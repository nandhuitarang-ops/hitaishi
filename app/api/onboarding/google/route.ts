import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users, profiles } from "@/db/schema";
import { createSession } from "@/lib/session";
import { sendWelcomeEmail } from "@/lib/emails/email-service";

export const dynamic = "force-dynamic";

/**
 * POST /api/onboarding/google
 * Receives the Google user info (email, name) after a successful Supabase OAuth popup
 * and creates/finds the local user + session.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, fullName, avatarUrl, supabaseAccessToken } = body;

    if (!email) {
      return NextResponse.json({ ok: false, error: "No email received from Google." }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if user already exists
    let existing: { id: string; role: string }[] = [];
    try {
      existing = await db
        .select({ id: users.id, role: users.role })
        .from(users)
        .where(eq(users.email, cleanEmail))
        .limit(1);
    } catch (dbErr: any) {
      console.error("[/api/onboarding/google] DB lookup error:", dbErr);
      return NextResponse.json(
        { ok: false, error: "Database connection failed. Please check DATABASE_URL is set." },
        { status: 500 }
      );
    }

    let userId: string;
    let role: string;

    if (existing[0]) {
      // Existing user — just sign them in
      userId = existing[0].id;
      role = existing[0].role;
    } else {
      // New user — create account (no password needed for OAuth)
      try {
        const result = await db.transaction(async (tx: any) => {
          const inserted = await tx
            .insert(users)
            .values({
              email: cleanEmail,
              passwordHash: "__oauth_google__", // sentinel: no password login allowed
              role: "student",
              status: "active",
            })
            .returning({ id: users.id });

          const id = inserted[0]!.id;

          await tx.insert(profiles).values({
            userId: id,
            fullName: (fullName || cleanEmail.split("@")[0]).trim(),
            onboardingStep: 1,
          });

          return id;
        });

        userId = result;
        role = "student";
      } catch (txErr: any) {
        console.error("[/api/onboarding/google] Transaction error:", txErr);
        return NextResponse.json(
          { ok: false, error: `Failed to create user account: ${txErr.message}` },
          { status: 500 }
        );
      }

      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.hitaishii.com";
      sendWelcomeEmail(cleanEmail, fullName || cleanEmail.split("@")[0], `${appUrl}/student-onboarding`).catch((e) => {
        console.error("Failed to send student welcome email (Google OAuth):", e);
      });
    }

    // Create local session cookie
    try {
      await createSession(userId);
    } catch (sessionErr: any) {
      console.error("[/api/onboarding/google] Session creation error:", sessionErr);
      return NextResponse.json(
        { ok: false, error: `Session creation failed: ${sessionErr.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, role, isNew: !existing[0] });
  } catch (err: any) {
    console.error("[/api/onboarding/google] top-level error:", err);
    return NextResponse.json(
      { ok: false, error: err?.message || "Google sign-in failed." },
      { status: 500 }
    );
  }
}
