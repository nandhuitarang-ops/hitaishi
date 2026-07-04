import { NextResponse } from "next/server";
import { and, asc, eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  conversationParticipants,
  conversations,
  sessionParticipants,
  sessions,
} from "@/db/schema";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: sessionId } = await params;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!UUID_RE.test(sessionId)) {
    return NextResponse.json({ error: "invalid session id" }, { status: 400 });
  }

  const sessionRow = await db
    .select({ id: sessions.id, hostId: sessions.hostId, title: sessions.title })
    .from(sessions)
    .where(eq(sessions.id, sessionId))
    .limit(1);
  const session = sessionRow[0];
  if (!session) return NextResponse.json({ error: "session not found" }, { status: 404 });

  const participants = await db
    .select({ userId: sessionParticipants.userId })
    .from(sessionParticipants)
    .where(eq(sessionParticipants.sessionId, sessionId));
  const memberIds = Array.from(new Set([session.hostId, ...(participants as any[]).map((p) => p.userId)]));

  if (user.role !== "admin" && !memberIds.includes(user.id)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  // Session rooms reuse the same conversation model as 1:1 chats.
  // We use the session UUID directly as the conversation id so we get a stable
  // channel name (`messages-conv-<sessionId>`) without a join table.
  const conversationId = sessionId;

  const existingMembers = await db
    .select({ userId: conversationParticipants.userId })
    .from(conversationParticipants)
    .where(eq(conversationParticipants.conversationId, conversationId));
  const existingSet = new Set((existingMembers as any[]).map((m) => m.userId));
  const missing = memberIds.filter((id) => !existingSet.has(id));

  if (missing.length > 0) {
    await db.transaction(async (tx: any) => {
      await tx
        .insert(conversations)
        .values({ id: conversationId, type: "group", title: session.title })
        .onConflictDoNothing();
      await tx
        .insert(conversationParticipants)
        .values(
          missing.map((userId) => ({
            conversationId,
            userId,
          })),
        )
        .onConflictDoNothing();
    });
  } else {
    // Ensure the conversation row exists even if all members were already linked.
    await db
      .insert(conversations)
      .values({ id: conversationId, type: "group", title: session.title })
      .onConflictDoNothing();
  }

  return NextResponse.json(
    {
      conversationId,
      memberIds,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
