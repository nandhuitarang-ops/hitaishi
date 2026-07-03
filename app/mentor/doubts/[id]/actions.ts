"use server";

import { revalidatePath } from "next/cache";
import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { doubts, doubtAnswers } from "@/db/schema";
import { getCurrentUser } from "@/lib/session";

export async function claimDoubt(doubtId: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== "mentor") throw new Error("Unauthorized");

  const [row] = await db
    .select({ status: doubts.status, claimedBy: doubts.claimedBy })
    .from(doubts)
    .where(eq(doubts.id, doubtId))
    .limit(1);
  if (!row) throw new Error("Doubt not found");
  if (row.status !== "open") throw new Error("Doubt already claimed");

  await db
    .update(doubts)
    .set({
      status: "claimed",
      claimedBy: user.id,
      claimedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(doubts.id, doubtId));

  revalidatePath("/mentor/doubts");
  revalidatePath(`/mentor/doubts/${doubtId}`);
  revalidatePath("/student/doubts");
}

export async function answerDoubt(doubtId: string, body: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== "mentor") throw new Error("Unauthorized");
  if (!body.trim()) throw new Error("Answer cannot be empty");

  const [row] = await db
    .select({ status: doubts.status, claimedBy: doubts.claimedBy })
    .from(doubts)
    .where(eq(doubts.id, doubtId))
    .limit(1);
  if (!row) throw new Error("Doubt not found");
  if (row.claimedBy !== user.id) throw new Error("You have not claimed this doubt");

  await db.insert(doubtAnswers).values({
    doubtId,
    answererId: user.id,
    body: body.trim(),
  });

  await db
    .update(doubts)
    .set({ status: "answered", updatedAt: new Date() })
    .where(eq(doubts.id, doubtId));

  revalidatePath("/mentor/doubts");
  revalidatePath(`/mentor/doubts/${doubtId}`);
  revalidatePath("/student/doubts");
}
