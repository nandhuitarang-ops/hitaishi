import { describe, it, expect } from "vitest";
import { rankStudents, type StudentSignal } from "./triage";

const now = new Date("2026-05-18T12:00:00Z");

function s(over: Partial<StudentSignal>): StudentSignal {
  return {
    studentId: over.studentId ?? "x",
    fullName: over.fullName ?? "Student X",
    unreadCount: 0,
    lastReplyAt: new Date("2026-05-17T12:00:00Z"),
    recentScoreDelta: 0,
    sessionsAttendedLast7d: 1,
    ...over,
  };
}

describe("rankStudents", () => {
  it("ranks higher when unreadCount is higher", () => {
    const list = [s({ studentId: "a", unreadCount: 1 }), s({ studentId: "b", unreadCount: 5 })];
    const ranked = rankStudents(list, now);
    expect(ranked[0].studentId).toBe("b");
  });

  it("ranks higher when last reply is further in the past", () => {
    const list = [
      s({ studentId: "fresh", lastReplyAt: new Date("2026-05-18T10:00:00Z") }),
      s({ studentId: "stale", lastReplyAt: new Date("2026-05-10T12:00:00Z") }),
    ];
    const ranked = rankStudents(list, now);
    expect(ranked[0].studentId).toBe("stale");
  });

  it("ranks higher on negative score delta (falling behind)", () => {
    const list = [
      s({ studentId: "up", recentScoreDelta: +10 }),
      s({ studentId: "down", recentScoreDelta: -15 }),
    ];
    const ranked = rankStudents(list, now);
    expect(ranked[0].studentId).toBe("down");
  });

  it("never returns a negative urgency score (clamp at 0)", () => {
    const happy = s({ unreadCount: 0, recentScoreDelta: +50, lastReplyAt: now });
    const ranked = rankStudents([happy], now);
    expect(ranked[0].urgency).toBeGreaterThanOrEqual(0);
  });

  it("returns empty array for empty input", () => {
    expect(rankStudents([], now)).toEqual([]);
  });

  it("is a pure function (doesn't mutate input)", () => {
    const list = [s({ studentId: "a", unreadCount: 1 }), s({ studentId: "b", unreadCount: 5 })];
    const snapshot = JSON.stringify(list);
    rankStudents(list, now);
    expect(JSON.stringify(list)).toBe(snapshot);
  });

  it("combines all three signals — heavily unread + stale + falling student tops the list", () => {
    const list = [
      s({ studentId: "calm", unreadCount: 0, recentScoreDelta: +5, lastReplyAt: now }),
      s({
        studentId: "urgent",
        unreadCount: 10,
        recentScoreDelta: -20,
        lastReplyAt: new Date("2026-05-01T12:00:00Z"),
      }),
      s({ studentId: "medium", unreadCount: 2, recentScoreDelta: 0 }),
    ];
    const ranked = rankStudents(list, now);
    expect(ranked[0].studentId).toBe("urgent");
    expect(ranked[ranked.length - 1].studentId).toBe("calm");
  });
});
