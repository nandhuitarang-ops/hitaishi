import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { conversationParticipants } from "@/db/schema";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  await db
    .update(conversationParticipants)
    .set({ lastReadAt: new Date() })
    .where(
      and(
        eq(conversationParticipants.conversationId, id),
        eq(conversationParticipants.userId, user.id),
      ),
    );

  return NextResponse.json({ ok: true });
}
