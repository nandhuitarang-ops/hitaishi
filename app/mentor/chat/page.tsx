import { redirect } from "next/navigation";
import { and, asc, desc, eq, inArray, gt } from "drizzle-orm";
import { Shell } from "@/components/Shell";
import { PrivacyNoticeBanner } from "@/components/PrivacyNoticeBanner";
import { Card, CardBody, LinkButton, Pill } from "@/components/ui";
import { initials } from "@/lib/format";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";
import { conversationParticipants, conversations, messages, profiles, sessionParticipants, sessions, users } from "@/db/schema";
import { MentorChatClient, type ConvListItem, type InitialMessage, type RightPanelData } from "./MentorChatClient";

export default async function MentorChatPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "mentor") redirect(`/${user.role}/dashboard`);

  const myParticipations = await db
    .select({ convId: conversationParticipants.conversationId, lastReadAt: conversationParticipants.lastReadAt })
    .from(conversationParticipants)
    .where(eq(conversationParticipants.userId, user.id));

  if (myParticipations.length === 0) {
    return (
      <Shell role="mentor" active="chat" pageCode="M.04 — STUDENT CHAT" pageTitle="Chat" pageSubtitle="Talk to your students.">
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

  const [convMeta, allParticipants, latestMsgs, nextSessionRows] = await Promise.all([
    db.select().from(conversations).where(inArray(conversations.id, convIds)),
    db
      .select({
        conversationId: conversationParticipants.conversationId,
        userId: users.id,
        fullName: profiles.fullName,
        email: users.email,
        lastLoginAt: users.lastLoginAt,
        institute: profiles.institute,
        targetExam: profiles.targetExam,
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
        id: sessions.id,
        title: sessions.title,
        scheduledAt: sessions.scheduledAt,
        durationMinutes: sessions.durationMinutes,
        meetLink: sessions.meetLink,
      })
      .from(sessions)
      .where(and(eq(sessions.hostId, user.id), gt(sessions.scheduledAt, new Date(Date.now() - 60 * 60 * 1000))))
      .orderBy(sessions.scheduledAt)
      .limit(1),
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
  const initialMessages: InitialMessage[] = [];
  const next = nextSessionRows[0] as any;
  const otherParticipant = (allParticipants as any[]).find(
    (p) => p.conversationId === activeId && p.userId !== user.id,
  );
  const rightPanelData: RightPanelData = {
    participant: {
      name: otherParticipant?.fullName ?? otherParticipant?.email?.split("@")[0] ?? "Student",
      email: otherParticipant?.email ?? "",
      institute: otherParticipant?.institute ?? null,
      targetExam: otherParticipant?.targetExam ?? null,
    },
    upcomingSession: next
      ? {
          id: next.id,
          title: next.title,
          scheduledAt: new Date(next.scheduledAt).toISOString(),
          durationMinutes: next.durationMinutes,
          meetLink: next.meetLink,
        }
      : null,
  };

  return (
    <Shell role="mentor" active="chat" pageCode="M.04 — STUDENT CHAT" pageTitle="Chat" pageSubtitle="Real-time conversations with your students">
      <PrivacyNoticeBanner />
      <MentorChatClient
        userId={user.id}
        userName={user.fullName}
        initialConvs={initialConvs}
        initialActiveId={activeId}
        initialMessages={initialMessages}
        rightPanelData={rightPanelData}
      />
    </Shell>
  );
}
