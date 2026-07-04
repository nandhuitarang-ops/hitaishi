import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import { and, eq } from "drizzle-orm";
import { doubts, resourceShares } from "@/db/schema";
import { sql } from "drizzle-orm";

/* Student dashboard cached queries — revalidate every 30s to cut repeated DB roundtrips */

export const getStudentDoubtsAnsweredCount = unstable_cache(
  async (studentId: string) => {
    const [row] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(doubts)
      .where(and(eq(doubts.studentId, studentId), eq(doubts.status, "answered")));
    return row?.count ?? 0;
  },
  ["student-doubts-answered-count"],
  { revalidate: 30 }
);

export const getStudentResourcesReceivedCount = unstable_cache(
  async (studentId: string) => {
    const [row] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(resourceShares)
      .where(eq(resourceShares.targetUserId, studentId));
    return row?.count ?? 0;
  },
  ["student-resources-count"],
  { revalidate: 30 }
);
