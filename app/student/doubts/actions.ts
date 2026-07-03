"use server";

import { db } from "@/lib/db";
import { doubts } from "@/db/schema";
import { getCurrentUser } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function createDoubt(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || user.role !== "student") {
    throw new Error("Unauthorized");
  }

  const subject = formData.get("subject") as string;
  const topic = formData.get("topic") as string;
  const body = formData.get("body") as string;

  if (!subject || !body) {
    throw new Error("Subject and description are required");
  }

  await db.insert(doubts).values({
    studentId: user.id,
    subject: subject as "physics" | "chemistry" | "maths" | "other",
    topic: topic || null,
    body,
    status: "open",
  });

  revalidatePath("/student/doubts");
}
