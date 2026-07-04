import { NextRequest, NextResponse } from "next/server";
import { and, desc, eq, gt, inArray, isNull, lt, ne, or, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { conversationParticipants, conversations, messages, profiles, users } from "@/db/schema";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const myConvs = await db
    .select({ convId: conversationParticipants.conversationId, lastReadAt: conversationParticipants.lastReadAt })
    .from(conversationParticipants)
    .where(eq(conversationParticipants.userId, user.id));

  if (myConvs.length === 0)
    return NextResponse.json(
      { items: [] },
      { headers: { "Cache-Control": "no-store" } },
    );

  const convIds = (myConvs as any[]).map((c) => c.convId);
  const lastReadMap = new Map<string, Date>((myConvs as any[]).map((c) => [c.convId, c.lastReadAt]));

  const { searchParams } = req.nextUrl;
  const cursorParam = searchParams.get("cursor");
  const cursor = cursorParam ? new Date(cursorParam) : null;

  const [convMeta, allParticipants, latestMsgs] = await Promise.all([
    db.select().from(conversations).where(inArray(conversations.id, convIds)),
    db
      .select({
        conversationId: conversationParticipants.conversationId,
        userId: users.id,
        fullName: profiles.fullName,
        email: users.email,
        lastLoginAt: users.lastLoginAt,
        institute: profiles.institute,
      })
      .from(conversationParticipants)
      .innerJoin(users, eq(users.id, conversationParticipants.userId))
      .leftJoin(profiles, eq(profiles.userId, users.id))
      .where(inArray(conversationParticipants.conversationId, convIds)),
    db
      .select({
        id: messages.id,
        conversationId: messages.conversationId,
        body: messages.body,
        senderId: messages.senderId,
        createdAt: messages.createdAt,
      })
      .from(messages)
      .where(
        and(
          inArray(messages.conversationId, convIds),
          cursor ? lt(messages.createdAt, cursor) : undefined,
        ),
      )
      .orderBy(desc(messages.createdAt))
      .limit(100),
  ]);

  const hasMore = latestMsgs.length === 100;
  const nextCursor =
    hasMore && latestMsgs.length > 0
      ? (latestMsgs[latestMsgs.length - 1] as any).createdAt.toISOString()
      : null;

  const result = (convMeta as any[]).map((c) => {
    const others = (allParticipants as any[]).filter((p) => p.conversationId === c.id && p.userId !== user.id);
    const other = others[0];
    const lastReadAt = lastReadMap.get(c.id);
    const unread = (latestMsgs as any[]).filter(
      (m) => m.conversationId === c.id && m.senderId !== user.id && (!lastReadAt || new Date(m.createdAt) > lastReadAt),
    ).length;
    const latest = (latestMsgs as any[]).find((m) => m.conversationId === c.id);
    return {
      id: c.id,
      type: c.type,
      otherId: other?.userId ?? null,
      otherName: other?.fullName ?? other?.email?.split("@")[0] ?? "Unknown",
      otherEmail: other?.email ?? "",
      otherInstitute: other?.institute ?? null,
      otherLastLogin: other?.lastLoginAt ?? null,
      lastMessageAt: c.lastMessageAt,
      lastMessagePreview: latest?.body ?? "",
      lastMessageSenderId: latest?.senderId ?? null,
      unread,
    };
  });

  result.sort((a, b) => {
    const at = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
    const bt = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
    return bt - at;
  });

  return NextResponse.json(
    { items: result, nextCursor },
    { headers: { "Cache-Control": "no-store" } },
  );
}
