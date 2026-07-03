import { redirect } from "next/navigation";
import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { Shell } from "@/components/Shell";
import { PrivacyNoticeBanner } from "@/components/PrivacyNoticeBanner";
import { Card, CardBody } from "@/components/ui";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";
import { conversationParticipants, conversations, messages, profiles, users } from "@/db/schema";
import { AdminChatClient, type ConvListItem, type InitialMessage } from "./AdminChatClient";

export const dynamic = "force-dynamic";

export default async function AdminChatPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect(`/${user.role}/dashboard`);

  const myParticipations = await db
    .select({ convId: conversationParticipants.conversationId, lastReadAt: conversationParticipants.lastReadAt })
    .from(conversationParticipants)
    .where(eq(conversationParticipants.userId, user.id));

  if (myParticipations.length === 0) {
    return (
      <Shell role="admin" active="chat" pageCode="A.04 — CHAT" pageTitle="Chat" pageSubtitle="Conversations with users.">
        <PrivacyNoticeBanner />
        <Card>
          <CardBody>
            <p className="text-sm text-ink-soft text-center py-10">No conversations yet.</p>
          </CardBody>
        </Card>
      </Shell>
    );
  }

  const convIds = (myParticipations as any[]).map((c) => c.convId);
  const lastReadMap = new Map<string, Date>((myParticipations as any[]).map((c) => [c.convId, c.lastReadAt]));

  const [convMeta, allParticipants, latestMsgs, messageRows] = await Promise.all([
    db.select().from(conversations).where(inArray(conversations.id, convIds)),
    db
      .select({
        conversationId: conversationParticipants.conversationId,
        userId: users.id,
        fullName: profiles.fullName,
        email: users.email,
        role: users.role,
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
      .where(inArray(messages.conversationId, convIds))
      .orderBy(desc(messages.createdAt)),
    db
      .select({
        id: messages.id,
        conversationId: messages.conversationId,
        senderId: messages.senderId,
        body: messages.body,
        createdAt: messages.createdAt,
      })
      .from(messages)
      .where(inArray(messages.conversationId, convIds))
      .orderBy(asc(messages.createdAt)),
  ]);

  const initialConvs: ConvListItem[] = (convMeta as any[]).map((c) => {
    const others = (allParticipants as any[]).filter((p) => p.conversationId === c.id && p.userId !== user.id);
    const other = others[0];
    const lastReadAt = lastReadMap.get(c.id);
    const unread = (latestMsgs as any[]).filter(
      (m) => m.conversationId === c.id && m.senderId !== user.id && (!lastReadAt || new Date(m.createdAt) > lastReadAt),
    ).length;
    const latest = (latestMsgs as any[]).find((m) => m.conversationId === c.id);
    return {
      id: c.id,
      otherId: other?.userId ?? null,
      otherName: other?.fullName ?? other?.email?.split("@")[0] ?? "Unknown",
      otherEmail: other?.email ?? "",
      otherRole: other?.role ?? null,
      otherInstitute: other?.institute ?? null,
      otherLastLogin: other?.lastLoginAt ? new Date(other.lastLoginAt).toISOString() : null,
      lastMessageAt: c.lastMessageAt ? new Date(c.lastMessageAt).toISOString() : null,
      lastMessagePreview: latest?.body ?? "",
      lastMessageSenderId: latest?.senderId ?? null,
      unread,
    };
  });

  initialConvs.sort((a, b) => {
    const at = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
    const bt = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
    return bt - at;
  });

  const activeId = initialConvs[0]?.id ?? null;
  const initialMessages: InitialMessage[] = activeId
    ? (messageRows as any[])
        .filter((m) => m.conversationId === activeId)
        .slice(-100)
        .map((m) => ({ id: m.id, senderId: m.senderId, body: m.body, createdAt: new Date(m.createdAt).toISOString() }))
    : [];

  return (
    <Shell role="admin" active="chat" pageCode="A.04 — CHAT" pageTitle="Chat" pageSubtitle="Conversations with students and mentors">
      <PrivacyNoticeBanner />
      <AdminChatClient
        userId={user.id}
        userName={user.fullName}
        initialConvs={initialConvs}
        initialActiveId={activeId}
        initialMessages={initialMessages}
      />
    </Shell>
  );
}
