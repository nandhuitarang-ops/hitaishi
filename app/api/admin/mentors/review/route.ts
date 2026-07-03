import { NextResponse } from "next/server";
import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/session";
import { users, profiles, mentorVerifications } from "@/db/schema";
import { leads } from "@/db/schema/leads";
import { sendMentorApprovedEmail, sendMentorRejectedEmail } from "@/lib/emails/email-service";

export const dynamic = "force-dynamic";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.hitaishii.com";

export async function POST(request: Request) {
  const admin = await requireRole("admin");

  let body: { id?: string; source?: string; action?: string; reason?: string } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const { id, source, action, reason } = body;
  if (!id || !source || !action) {
    return NextResponse.json({ ok: false, error: "Missing required fields: id, source, action." }, { status: 400 });
  }
  if (action !== "approve" && action !== "reject") {
    return NextResponse.json({ ok: false, error: "Action must be 'approve' or 'reject'." }, { status: 400 });
  }
  if (action === "reject" && !reason?.trim()) {
    return NextResponse.json({ ok: false, error: "A reason is required when rejecting an application." }, { status: 400 });
  }

  try {
    if (source === "lead") {
      return await handleLeadReview(id, action, reason ?? "", admin);
    } else if (source === "verification") {
      return await handleVerificationReview(id, action, reason ?? "", admin);
    } else {
      return NextResponse.json({ ok: false, error: "Invalid source. Must be 'lead' or 'verification'." }, { status: 400 });
    }
  } catch (err: unknown) {
    console.error("[/api/admin/mentors/review] failed:", err);
    const msg = err && typeof err === "object" && "message" in err
      ? (err as Error).message
      : "Internal server error.";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

async function handleLeadReview(
  id: string,
  action: string,
  reason: string,
  admin: { id: string },
) {
  // Fetch the lead
  const [lead] = await db
    .select()
    .from(leads)
    .where(eq(leads.id, id))
    .limit(1);

  if (!lead) {
    return NextResponse.json({ ok: false, error: "Lead not found." }, { status: 404 });
  }
  if (lead.type !== "mentor-application") {
    return NextResponse.json({ ok: false, error: "Lead is not a mentor application." }, { status: 400 });
  }

  const email = lead.email.toLowerCase().trim();
  const formData = (lead.data ?? {}) as Record<string, unknown>;
  const fullName = lead.name || email.split("@")[0];

  if (action === "approve") {
    // Check for existing user
    const [existing] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    let userId: string;

    if (existing) {
      // User exists — update role to mentor
      userId = existing.id;
      await db
        .update(users)
        .set({ role: "mentor", status: "active", updatedAt: new Date() })
        .where(eq(users.id, userId));
    } else {
      // Create new user (no password — mentor will use forgot-password flow)
      const [inserted] = await db
        .insert(users)
        .values({
          email,
          role: "mentor",
          status: "active",
          phone: lead.phone ?? null,
        })
        .returning({ id: users.id });

      if (!inserted) {
        return NextResponse.json({ ok: false, error: "Failed to create user." }, { status: 500 });
      }
      userId = inserted.id;
    }

    // Upsert profile with form data
    const [existingProfile] = await db
      .select({ userId: profiles.userId })
      .from(profiles)
      .where(eq(profiles.userId, userId))
      .limit(1);

    if (existingProfile) {
      await db
        .update(profiles)
        .set({
          fullName,
          institute: (formData.institute as string) ?? null,
          city: (formData.city as string) ?? null,
          gender: (formData.gender as string) ?? null,
          graduationYear: formData.jeeYear ? Number(formData.jeeYear) : null,
          updatedAt: new Date(),
        })
        .where(eq(profiles.userId, userId));
    } else {
      await db
        .insert(profiles)
        .values({
          userId,
          fullName,
          institute: (formData.institute as string) ?? null,
          city: (formData.city as string) ?? null,
          gender: (formData.gender as string) ?? null,
          graduationYear: formData.jeeYear ? Number(formData.jeeYear) : null,
          onboardingStep: 0,
        });
    }

    // Upsert mentor verification record
    // Note: mentorVerifications.userId has an index but NOT a unique constraint,
    // so we cannot use ON CONFLICT. Check-then-upsert manually.
    const [existingVerification] = await db
      .select({ id: mentorVerifications.id })
      .from(mentorVerifications)
      .where(eq(mentorVerifications.userId, userId))
      .limit(1);

    if (existingVerification) {
      await db
        .update(mentorVerifications)
        .set({
          status: "approved",
          reviewedBy: admin.id,
          reviewNotes: null,
          jeeRank: formData.jeeRank ? Number(formData.jeeRank) : null,
          updatedAt: new Date(),
        })
        .where(eq(mentorVerifications.id, existingVerification.id));
    } else {
      await db
        .insert(mentorVerifications)
        .values({
          userId,
          status: "approved",
          reviewedBy: admin.id,
          reviewNotes: null,
          jeeRank: formData.jeeRank ? Number(formData.jeeRank) : null,
        });
    }

    // Send approval email
    const dashboardLink = `${APP_URL}/mentor/dashboard`;
    const emailResult = await sendMentorApprovedEmail(email, fullName, dashboardLink);
    if (!emailResult.ok) {
      console.error("Failed to send mentor approved email:", emailResult.error);
    }

    return NextResponse.json({
      ok: true,
      message: "Mentor approved successfully.",
      emailMocked: "mock" in emailResult ? emailResult.mock : false,
    });
  } else {
    // Reject lead — send rejection email with reason
    const emailResult = await sendMentorRejectedEmail(email, fullName, reason);
    if (!emailResult.ok) {
      console.error("Failed to send mentor rejection email:", emailResult.error);
    }

    // Optionally mark the lead as reviewed — we can add a status field later
    return NextResponse.json({
      ok: true,
      message: "Lead rejected. Rejection email sent.",
      emailMocked: "mock" in emailResult ? emailResult.mock : false,
    });
  }
}

async function handleVerificationReview(
  id: string,
  action: string,
  reason: string,
  admin: { id: string },
) {
  // Fetch the mentor verification entry
  const [verification] = await db
    .select()
    .from(mentorVerifications)
    .where(eq(mentorVerifications.id, id))
    .limit(1);

  if (!verification) {
    return NextResponse.json({ ok: false, error: "Verification record not found." }, { status: 404 });
  }

  const [userRow] = await db
    .select({ id: users.id, email: users.email })
    .from(users)
    .where(and(eq(users.id, verification.userId), isNull(users.deletedAt)))
    .limit(1);

  if (!userRow) {
    return NextResponse.json({ ok: false, error: "User not found." }, { status: 404 });
  }

  const [profileRow] = await db
    .select({ fullName: profiles.fullName })
    .from(profiles)
    .where(eq(profiles.userId, userRow.id))
    .limit(1);

  const fullName = profileRow?.fullName || userRow.email.split("@")[0];

  if (action === "approve") {
    await db
      .update(mentorVerifications)
      .set({
        status: "approved",
        reviewedBy: admin.id,
        reviewNotes: null,
        updatedAt: new Date(),
      })
      .where(eq(mentorVerifications.id, id));

    await db
      .update(users)
      .set({ role: "mentor", status: "active", updatedAt: new Date() })
      .where(eq(users.id, userRow.id));

    // Send approval email
    const dashboardLink = `${APP_URL}/mentor/dashboard`;
    const emailResult = await sendMentorApprovedEmail(userRow.email, fullName, dashboardLink);
    if (!emailResult.ok) {
      console.error("Failed to send mentor approved email:", emailResult.error);
    }

    return NextResponse.json({
      ok: true,
      message: "Mentor approved successfully.",
      emailMocked: "mock" in emailResult ? emailResult.mock : false,
    });
  } else {
    await db
      .update(mentorVerifications)
      .set({
        status: "rejected",
        reviewedBy: admin.id,
        reviewNotes: reason,
        updatedAt: new Date(),
      })
      .where(eq(mentorVerifications.id, id));

    // Send rejection email
    const emailResult = await sendMentorRejectedEmail(userRow.email, fullName, reason);
    if (!emailResult.ok) {
      console.error("Failed to send mentor rejection email:", emailResult.error);
    }

    return NextResponse.json({
      ok: true,
      message: "Mentor rejected.",
      emailMocked: "mock" in emailResult ? emailResult.mock : false,
    });
  }
}
