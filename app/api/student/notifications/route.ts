import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { profiles, auditLog } from "@/db/schema";
import { getCurrentUser } from "@/lib/session";

const bodySchema = z.object({
  event: z.enum(["payment_completed"]),
});

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (user.role !== "student") {
    return NextResponse.json({ error: "Only students can trigger this" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues.map((i) => i.message).join("; ") },
      { status: 400 },
    );
  }

  const now = new Date();

  await db
    .update(profiles)
    .set({ onboardingCompletedAt: now })
    .where(eq(profiles.userId, user.id));

  await db.insert(auditLog).values({
    actorId: user.id,
    action: "payment_completed",
    targetType: "profile",
    targetId: user.id,
    metadata: { fullName: user.fullName, email: user.email },
    createdAt: now,
  });

  return NextResponse.json(
    { ok: true },
    { headers: { "Cache-Control": "private, max-age=0" } },
  );
}
