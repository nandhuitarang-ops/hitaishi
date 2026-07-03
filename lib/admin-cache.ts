import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import { users, profiles, sessions, mentorVerifications, webhookEvents, conversations, assignments } from "@/db/schema";
import { and, count, desc, eq, gte, isNull, lt, sql } from "drizzle-orm";

/* Admin cached queries — cache for 60s to cut repeated Supabase roundtrips */

export const getActiveStudentCount = unstable_cache(
  async () => {
    const [row] = await db
      .select({ c: count() })
      .from(users)
      .where(and(eq(users.role, "student"), eq(users.status, "active"), isNull(users.deletedAt)));
    return Number(row?.c ?? 0);
  },
  ["admin-active-student-count"],
  { revalidate: 60 }
);

export const getActiveMentorCount = unstable_cache(
  async () => {
    const [row] = await db
      .select({ c: count() })
      .from(users)
      .where(and(eq(users.role, "mentor"), eq(users.status, "active"), isNull(users.deletedAt)));
    return Number(row?.c ?? 0);
  },
  ["admin-active-mentor-count"],
  { revalidate: 60 }
);

export const getPendingMentorVerifications = unstable_cache(
  async () => {
    const [row] = await db
      .select({ c: count() })
      .from(mentorVerifications)
      .where(eq(mentorVerifications.status, "pending"));
    return Number(row?.c ?? 0);
  },
  ["admin-pending-verifications"],
  { revalidate: 60 }
);

export const getSessionsTodayCount = unstable_cache(
  async () => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);
    const [row] = await db
      .select({ c: count() })
      .from(sessions)
      .where(and(gte(sessions.scheduledAt, startOfDay), lt(sessions.scheduledAt, endOfDay)));
    return Number(row?.c ?? 0);
  },
  ["admin-sessions-today"],
  { revalidate: 60 }
);

export const getLiveSessionCount = unstable_cache(
  async () => {
    const [row] = await db.select({ c: count() }).from(sessions).where(eq(sessions.status, "live"));
    return Number(row?.c ?? 0);
  },
  ["admin-live-sessions"],
  { revalidate: 30 }
);

export const getFlaggedConversations = unstable_cache(
  async () => {
    const [row] = await db
      .select({ c: count() })
      .from(conversations)
      .where(eq(conversations.flagged, true));
    return Number(row?.c ?? 0);
  },
  ["admin-flagged-conversations"],
  { revalidate: 60 }
);

export const getFailedWebhooks24h = unstable_cache(
  async () => {
    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const [row] = await db
      .select({ c: count() })
      .from(webhookEvents)
      .where(and(isNull(webhookEvents.processedAt), gte(webhookEvents.createdAt, last24h)));
    return Number(row?.c ?? 0);
  },
  ["admin-failed-webhooks-24h"],
  { revalidate: 60 }
);

export const getAllFailedWebhooks = unstable_cache(
  async () => {
    const [row] = await db
      .select({ c: count() })
      .from(webhookEvents)
      .where(isNull(webhookEvents.processedAt));
    return Number(row?.c ?? 0);
  },
  ["admin-all-failed-webhooks"],
  { revalidate: 60 }
);

export type StudentListItem = {
  id: string;
  email: string;
  phone: string | null;
  fullName: string | null;
  lastLoginAt: Date | null;
  mentorName: string | null;
};

export const getStudentsList = unstable_cache(
  async (limit: number): Promise<{ rows: StudentListItem[]; total: number }> => {
    const studentBase = and(eq(users.role, "student"), isNull(users.deletedAt));

    const [[allRow], rawRows] = await Promise.all([
      db.select({ c: count() }).from(users).where(studentBase),
      db
        .select({
          id: users.id,
          email: users.email,
          phone: users.phone,
          fullName: profiles.fullName,
          lastLoginAt: users.lastLoginAt,
          mentorId: assignments.mentorId,
        })
        .from(users)
        .leftJoin(profiles, eq(profiles.userId, users.id))
        .leftJoin(
          assignments,
          and(eq(assignments.studentId, users.id), eq(assignments.status, "active"))
        )
        .where(studentBase)
        .orderBy(desc(users.createdAt))
        .limit(limit) as Promise<{
          id: string; email: string; phone: string | null;
          fullName: string | null; lastLoginAt: Date | null; mentorId: string | null;
        }[]>,
    ]);

    // Resolve mentor names in a single follow-up query (avoids correlated subquery)
    const mentorIds = rawRows
      .map((r) => r.mentorId)
      .filter((id): id is string => id !== null);

    let mentorNames = new Map<string, string>();
    if (mentorIds.length > 0) {
      const mentorProfiles: { userId: string; fullName: string | null }[] = await db
        .select({ userId: profiles.userId, fullName: profiles.fullName })
        .from(profiles)
        .where(sql`${profiles.userId} IN (${sql.join(mentorIds.map((id) => sql`${id}`), sql`, `)})`);

      mentorProfiles.forEach((m) => {
        if (m.fullName) mentorNames.set(m.userId, m.fullName);
      });
    }

    const rows: StudentListItem[] = rawRows.map((r) => ({
      id: r.id,
      email: r.email,
      phone: r.phone,
      fullName: r.fullName,
      lastLoginAt: r.lastLoginAt,
      mentorName: r.mentorId ? (mentorNames.get(r.mentorId) ?? null) : null,
    }));

    return { rows, total: Number(allRow?.c ?? 0) };
  },
  ["admin-students-list"],
  { revalidate: 60 }
);
