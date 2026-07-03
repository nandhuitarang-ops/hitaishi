import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { users, profiles } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function PUT(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }
  if (user.role !== "student") {
    return NextResponse.json({ ok: false, error: "Only students can update their profile." }, { status: 403 });
  }

  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const fullName = typeof body.fullName === "string" ? body.fullName.trim() : null;
  const phone = typeof body.phone === "string" ? body.phone.trim() : null;
  const institute = typeof body.institute === "string" ? body.institute.trim() : null;
  const targetExam = typeof body.targetExam === "string" ? body.targetExam.trim() : null;
  const targetYear = typeof body.targetYear === "string" ? body.targetYear.trim() : null;
  const bio = typeof body.bio === "string" ? body.bio.trim() : null;

  // Validate targetExam
  const validExams = ["jee_main", "jee_advanced", "both"];
  const exam = targetExam && validExams.includes(targetExam) ? targetExam : null;
  const year = targetYear && /^\d{4}$/.test(targetYear) ? Number(targetYear) : null;

  try {
    // Update users table (phone)
    if (phone) {
      await db
        .update(users)
        .set({ phone, updatedAt: new Date() })
        .where(eq(users.id, user.id));
    }

    // Update or insert profile
    const [existingProfile] = await db
      .select({ userId: profiles.userId })
      .from(profiles)
      .where(eq(profiles.userId, user.id))
      .limit(1);

    const profileData: Record<string, unknown> = {
      updatedAt: new Date(),
    };
    if (fullName) profileData.fullName = fullName;
    if (exam) profileData.targetExam = exam;
    if (year) profileData.targetYear = year;
    if (institute) profileData.institute = institute;
    if (bio) profileData.bio = bio;

    if (existingProfile) {
      await db
        .update(profiles)
        .set(profileData)
        .where(eq(profiles.userId, user.id));
    } else {
      await db
        .insert(profiles)
        .values({ userId: user.id, ...profileData, onboardingStep: 0 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    console.error("[/api/student/profile] update failed:", err);
    return NextResponse.json(
      { ok: false, error: "Could not save profile. Please try again." },
      { status: 500 },
    );
  }
}
