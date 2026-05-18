import { describe, it, expect } from "vitest";
import { canClaimDoubt, type DoubtSnapshot } from "./doubts";

const NOW = new Date("2026-05-18T12:00:00Z");

function doubt(over: Partial<DoubtSnapshot> = {}): DoubtSnapshot {
  return {
    id: "d1",
    status: "open",
    claimedBy: null,
    claimedAt: null,
    ...over,
  };
}

describe("canClaimDoubt", () => {
  it("open doubt can be claimed by anyone", () => {
    expect(canClaimDoubt(doubt({ status: "open" }), "user-A", NOW)).toEqual({
      allow: true,
    });
  });

  it("claimed doubt cannot be claimed by someone else", () => {
    const d = doubt({
      status: "claimed",
      claimedBy: "user-A",
      claimedAt: new Date("2026-05-18T11:50:00Z"),
    });
    expect(canClaimDoubt(d, "user-B", NOW)).toEqual({
      allow: false,
      reason: "already_claimed",
    });
  });

  it("the same user can re-claim (idempotent)", () => {
    const d = doubt({
      status: "claimed",
      claimedBy: "user-A",
      claimedAt: new Date("2026-05-18T11:50:00Z"),
    });
    expect(canClaimDoubt(d, "user-A", NOW)).toEqual({ allow: true });
  });

  it("claim lock expires after 30 minutes — another user can claim", () => {
    const d = doubt({
      status: "claimed",
      claimedBy: "user-A",
      claimedAt: new Date("2026-05-18T11:29:00Z"), // 31 min ago
    });
    expect(canClaimDoubt(d, "user-B", NOW)).toEqual({ allow: true });
  });

  it("answered doubts cannot be claimed", () => {
    expect(canClaimDoubt(doubt({ status: "answered" }), "user-B", NOW)).toEqual({
      allow: false,
      reason: "already_answered",
    });
  });

  it("abandoned doubts can be re-claimed by anyone", () => {
    expect(canClaimDoubt(doubt({ status: "abandoned" }), "user-B", NOW)).toEqual({
      allow: true,
    });
  });
});
