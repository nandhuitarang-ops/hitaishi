import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type * as schema from "@/db/schema";
import { db } from "@/lib/db";
import { users, profiles } from "@/db/schema";
import { hashPassword } from "@/lib/auth";
import { createSession } from "@/lib/session";
import { studentSignupSchema } from "@/lib/signupSchema";
import { sendWelcomeEmail } from "@/lib/emails/email-service";

type Db = PostgresJsDatabase<typeof schema>;
type Tx = Parameters<NonNullable<Parameters<Db["transaction"]>[0]>>[0];

export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 64 * 1024;

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, error: "Payload too large." }, { status: 413 });
  }

  let body: unknown = null;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) {
      return NextResponse.json({ ok: false, error: "Payload too large." }, { status: 413 });
    }
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }
  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = studentSignupSchema.safeParse(body);
  if (!parsed.success) {
    console.warn("[/api/signup] validation failed", parsed.error.issues);
    return NextResponse.json(
      { ok: false, error: "Please check the form for errors.", fields: parsed.error.issues },
      { status: 400 },
    );
  }

  const data = parsed.data;
  if (data.website && data.website.trim().length > 0) {
    console.info("[/api/signup] honeypot tripped, dropping submission");
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  const email = data.email.toLowerCase().trim();

  try {
    const existing = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    if (existing[0]) {
      return NextResponse.json(
        { ok: false, error: "An account with this email already exists." },
        { status: 409 },
      );
    }

    const passwordHash = await hashPassword(data.password);
    const targetRank =
      data.targetRank && /^\d+$/.test(data.targetRank) ? Number(data.targetRank) : null;
    const targetYear = Number(data.targetYear);

    const userId = await db.transaction(async (tx: Tx) => {
      const inserted = await tx
        .insert(users)
        .values({
          email,
          passwordHash,
          role: "student",
          status: "active",
          phone: data.phone,
        })
        .returning({ id: users.id });
      const id = inserted[0]!.id;

      await tx.insert(profiles).values({
        userId: id,
        fullName: data.fullName,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender || null,
        parentName: data.parentName || null,
        parentPhone: data.parentPhone || null,
        addressLine1: data.addressLine1,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        currentClass: data.currentClass,
        board: data.board,
        targetExam: data.targetExam,
        targetYear,
        targetRank,
        aimText: data.aimText || null,
        subjectsFocus: data.subjectsFocus,
        institute: data.coachingInstitute || null,
        onboardingStep: 0,
      });
      return id;
    });

    await createSession(userId);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.hitaishii.com";
    sendWelcomeEmail(email, data.fullName, `${appUrl}/student-onboarding`).catch((e) => {
      console.error("Failed to send student welcome email:", e);
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err: unknown) {
    // postgres unique_violation — race between check and insert.
    if (err && typeof err === "object" && "code" in err && (err as { code: string }).code === "23505") {
      return NextResponse.json(
        { ok: false, error: "An account with this email already exists." },
        { status: 409 },
      );
    }
    console.error("[/api/signup] persist failed", err);
    return NextResponse.json(
      { ok: false, error: "Could not create your account. Please try again." },
      { status: 500 },
    );
  }
}
