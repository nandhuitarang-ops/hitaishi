export interface StudentSignal {
  studentId: string;
  fullName: string;
  unreadCount: number;
  lastReplyAt: Date;
  recentScoreDelta: number;
  sessionsAttendedLast7d: number;
}

export interface RankedStudent extends StudentSignal {
  urgency: number;
}

const UNREAD_WEIGHT = 10;
const STALE_HOUR_WEIGHT = 0.5;
const SCORE_DROP_WEIGHT = 2;

export function rankStudents(
  students: readonly StudentSignal[],
  now: Date = new Date(),
): RankedStudent[] {
  return students
    .map((s) => {
      const staleHours = Math.max(
        0,
        (now.getTime() - s.lastReplyAt.getTime()) / 3_600_000,
      );
      const scorePenalty = Math.max(0, -s.recentScoreDelta);
      const urgency =
        s.unreadCount * UNREAD_WEIGHT +
        staleHours * STALE_HOUR_WEIGHT +
        scorePenalty * SCORE_DROP_WEIGHT;
      return { ...s, urgency: Math.max(0, urgency) };
    })
    .sort((a, b) => b.urgency - a.urgency);
}
