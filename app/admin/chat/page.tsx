import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Chat Monitor — Hitaishi Admin",
  robots: "noindex, nofollow",
};

export default async function AdminChatPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect(`/${user.role}/dashboard`);

  const allConvs = await db.select().from(conversations);

  if (allConvs.length === 0) {
    return (
      <Shell role="admin" active="chat" pageCode="A.04 — CHAT" pageTitle="Chat Monitor" pageSubtitle="No conversations have been started yet." user={user}>
        <PrivacyNoticeBanner />
        <Card>
          <CardBody>
            <p className="text-sm text-ink-soft text-center py-10">No conversations logged yet on the platform.</p>
          </CardBody>
        </Card>
      </Shell>
    );
  }

  const convIds = (allConvs as any[]).map((c: any) => c.id);

  const myParticipations = await db
    .select({ convId: conversationParticipants.conversationId, lastReadAt: conversationParticipants.lastReadAt })
    .from(conversationParticipants)
    .where(eq(conversationParticipants.userId, user.id));

  const lastReadMap = new Map<string, Date>((myParticipations as any[]).map((c) => [c.convId, c.lastReadAt]));

  const [allParticipants, latestMsgs, messageRows] = await Promise.all([
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
      .orderBy(desc(messages.createdAt))
      .limit(50),
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
      .orderBy(asc(messages.createdAt))
      .limit(50),
  ]);

  const initialConvs: ConvListItem[] = (allConvs as any[]).map((c: any) => {
    const participantsList = (allParticipants as any[]).filter((p) => p.conversationId === c.id);
    const student = participantsList.find((p) => p.role === "student");
    const mentor = participantsList.find((p) => p.role === "mentor");
    const other = student || mentor || participantsList[0];

    let otherName = "Empty Chat";
    if (student && mentor) {
      otherName = `${student.fullName || student.email.split("@")[0]} & ${mentor.fullName || mentor.email.split("@")[0]}`;
    } else if (participantsList.length > 0) {
      otherName = participantsList.map(p => p.fullName || p.email.split("@")[0]).join(", ");
    }

    const lastReadAt = lastReadMap.get(c.id);
    const unread = (latestMsgs as any[]).filter(
      (m) => m.conversationId === c.id && m.senderId !== user.id && (!lastReadAt || new Date(m.createdAt) > lastReadAt),
    ).length;
    const latest = (latestMsgs as any[]).find((m) => m.conversationId === c.id);
    return {
      id: c.id,
      otherId: other?.userId ?? null,
      otherName,
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
    <Shell role="admin" active="chat" pageCode="A.04 — CHAT" pageTitle="Chat" pageSubtitle="Conversations with students and mentors" user={user}>
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
