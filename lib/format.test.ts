import { describe, it, expect } from "vitest";
import {
  formatDayCounter,
  formatTimeUntil,
  formatLastSeen,
  initials,
} from "./format";

describe("formatDayCounter", () => {
  it("returns 'Day 47 of 180' for normal usage", () => {
    expect(formatDayCounter(47, 180)).toBe("Day 47 of 180");
  });
  it("clamps to total when day exceeds it", () => {
    expect(formatDayCounter(200, 180)).toBe("Day 180 of 180");
  });
  it("uses Day 1 minimum", () => {
    expect(formatDayCounter(0, 180)).toBe("Day 1 of 180");
  });
});

describe("formatTimeUntil", () => {
  const now = new Date("2026-05-18T12:00:00Z");
  it("'in 18 min' for 18 minutes future", () => {
    expect(formatTimeUntil(new Date("2026-05-18T12:18:00Z"), now)).toBe("in 18 min");
  });
  it("'in 2 hrs' for 2 hours future", () => {
    expect(formatTimeUntil(new Date("2026-05-18T14:00:00Z"), now)).toBe("in 2 hrs");
  });
  it("'tomorrow' for 23h+", () => {
    expect(formatTimeUntil(new Date("2026-05-19T12:00:00Z"), now)).toBe("tomorrow");
  });
  it("'live now' for already-started but <duration", () => {
    expect(formatTimeUntil(new Date("2026-05-18T11:59:00Z"), now)).toBe("live now");
  });
  it("'ended' for past", () => {
    expect(formatTimeUntil(new Date("2026-05-17T12:00:00Z"), now)).toBe("ended");
  });
});

describe("formatLastSeen", () => {
  const now = new Date("2026-05-18T12:00:00Z");
  it("'just now' under 60s", () => {
    expect(formatLastSeen(new Date("2026-05-18T11:59:30Z"), now)).toBe("just now");
  });
  it("'5m ago'", () => {
    expect(formatLastSeen(new Date("2026-05-18T11:55:00Z"), now)).toBe("5m ago");
  });
  it("'2h ago'", () => {
    expect(formatLastSeen(new Date("2026-05-18T10:00:00Z"), now)).toBe("2h ago");
  });
  it("'yesterday' for 24-48h", () => {
    expect(formatLastSeen(new Date("2026-05-17T11:00:00Z"), now)).toBe("yesterday");
  });
  it("'3d ago'", () => {
    expect(formatLastSeen(new Date("2026-05-15T12:00:00Z"), now)).toBe("3d ago");
  });
});

describe("initials", () => {
  it("returns first letter of first and last name", () => {
    expect(initials("Rohan Kapoor")).toBe("RK");
  });
  it("uppercases", () => {
    expect(initials("aarav sharma")).toBe("AS");
  });
  it("handles single name", () => {
    expect(initials("Aarav")).toBe("A");
  });
  it("handles empty string safely", () => {
    expect(initials("")).toBe("?");
  });
});
