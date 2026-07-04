import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { conversationParticipants } from "@/db/schema";
import { getCurrentUser } from "@/lib/session";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  if (!UUID_RE.test(id)) {
    return NextResponse.json({ error: "invalid conversation id" }, { status: 400 });
  }

  const participant = await db
    .select({ userId: conversationParticipants.userId })
    .from(conversationParticipants)
    .where(eq(conversationParticipants.conversationId, id));

  const ids = (participant as any[]).map((p) => p.userId);
  if (!ids.includes(user.id)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  await db
    .delete(conversationParticipants)
    .where(
      and(
        eq(conversationParticipants.conversationId, id),
        eq(conversationParticipants.userId, user.id),
      ),
    );

  return NextResponse.json({ success: true });
}
