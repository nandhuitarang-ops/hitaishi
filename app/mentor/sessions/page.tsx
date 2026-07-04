import type { Metadata } from "next";
import { Shell } from "@/components/Shell";
import { PrivacyNoticeBanner } from "@/components/PrivacyNoticeBanner";
import { SessionsClient } from "./SessionsClient";
import { db } from "@/lib/db";
import { assignments, sessions, sessionParticipants, users, profiles } from "@/db/schema";
import { and, asc, desc, eq, gt, inArray, isNull, lt, or, sql } from "drizzle-orm";
import { requireRole } from "@/lib/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sessions — Hitaishi Mentor",
  robots: "noindex, nofollow",
};

type SessionRow = {
  id: string;
  title: string;
  type: "one_on_one" | "group";
  status: "scheduled" | "live" | "completed" | "cancelled";
  scheduledAt: string;
  durationMinutes: number;
  meetLink: string | null;
  startedAt: Date | null;
  endedAt: Date | null;
  attendees: { id: string; name: string }[];
  startedAgoMin: number | null;
  elapsedHms: string | null;
};

type StudentOption = { id: string; name: string; email: string };

function elapsedHms(startedAt: Date | null): string | null {
  if (!startedAt) return null;
  const ms = Date.now() - startedAt.getTime();
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default async function MentorSessionsPage() {
  const user = await requireRole("mentor");
  const now = new Date();

  const rows = await db
    .select({
      id: sessions.id,
      title: sessions.title,
      type: sessions.type,
      status: sessions.status,
      scheduledAt: sessions.scheduledAt,
      durationMinutes: sessions.durationMinutes,
      meetLink: sessions.meetLink,
      startedAt: sessions.startedAt,
      endedAt: sessions.endedAt,
    })
    .from(sessions)
    .where(eq(sessions.hostId, user.id))
    .orderBy(desc(sessions.scheduledAt));

  const sessionIds = rows.map((r: any) => r.id);
  const attendeeMap = new Map<string, { id: string; name: string }[]>();
  if (sessionIds.length) {
    const att = await db
      .select({
        sessionId: sessionParticipants.sessionId,
        userId: users.id,
        fullName: profiles.fullName,
        email: users.email,
      })
      .from(sessionParticipants)
      .innerJoin(users, eq(users.id, sessionParticipants.userId))
      .leftJoin(profiles, eq(profiles.userId, users.id))
      .where(inArray(sessionParticipants.sessionId, sessionIds));
    for (const a of att as any[]) {
      const arr = attendeeMap.get(a.sessionId) ?? [];
      arr.push({ id: a.userId, name: a.fullName ?? a.email.split("@")[0] });
      attendeeMap.set(a.sessionId, arr);
    }
  }

  const mapped: SessionRow[] = (rows as any[]).map((r) => {
    const startedAgoMin = r.startedAt
      ? Math.floor((now.getTime() - new Date(r.startedAt).getTime()) / 60000)
      : null;
    return {
      id: r.id,
      title: r.title,
      type: r.type,
      status: r.status,
      scheduledAt: new Date(r.scheduledAt).toISOString(),
      durationMinutes: r.durationMinutes,
      meetLink: r.meetLink,
      startedAt: r.startedAt ? new Date(r.startedAt) : null,
      endedAt: r.endedAt ? new Date(r.endedAt) : null,
      attendees: attendeeMap.get(r.id) ?? [],
      startedAgoMin,
      elapsedHms: elapsedHms(r.startedAt ? new Date(r.startedAt) : null),
    };
  });

  const live = mapped.filter((r: any) => r.status === "live");
  const upcoming = mapped.filter(
    (r: any) => r.status === "scheduled" && new Date(r.scheduledAt).getTime() >= now.getTime() - 60 * 60 * 1000,
  );
  const past = mapped.filter(
    (r: any) => r.status === "completed" || r.status === "cancelled" || (r.status === "scheduled" && new Date(r.scheduledAt).getTime() < now.getTime() - 60 * 60 * 1000),
  ).slice(0, 50);

  const [studentRows] = await Promise.all([
    db
      .select({
        id: users.id,
        fullName: profiles.fullName,
        email: users.email,
      })
      .from(assignments)
      .innerJoin(users, eq(users.id, assignments.studentId))
      .leftJoin(profiles, eq(profiles.userId, users.id))
      .where(and(eq(assignments.mentorId, user.id), eq(assignments.status, "active")))
      .orderBy(asc(profiles.fullName)),
  ]);
  const students: StudentOption[] = (studentRows as any[]).map((s) => ({
    id: s.id,
    name: s.fullName ?? s.email.split("@")[0],
    email: s.email,
  }));

  return (
    <Shell
      role="mentor"
      active="sessions"
      pageCode="M.10 — SESSIONS"
      pageTitle="Your sessions"
      pageSubtitle="Create, join, and review live mentoring sessions."
      user={user}
    >
      <PrivacyNoticeBanner />
      <SessionsClient live={live} upcoming={upcoming} past={past} students={students} />
    </Shell>
  );
}
