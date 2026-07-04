export type DoubtStatus = "open" | "claimed" | "answered" | "abandoned";

export interface DoubtSnapshot {
  id: string;
  status: DoubtStatus;
  claimedBy: string | null;
  claimedAt: Date | null;
}

export type ClaimDecision =
  | { allow: true }
  | { allow: false; reason: "already_claimed" | "already_answered" };

const CLAIM_LOCK_MS = 30 * 60 * 1000;

export function canClaimDoubt(
  doubt: DoubtSnapshot,
  userId: string,
  now: Date = new Date(),
): ClaimDecision {
  if (doubt.status === "answered") {
    return { allow: false, reason: "already_answered" };
  }
  if (doubt.status === "open" || doubt.status === "abandoned") {
    return { allow: true };
  }
  // claimed
  if (doubt.claimedBy === userId) return { allow: true };
  if (
    doubt.claimedAt &&
    now.getTime() - doubt.claimedAt.getTime() > CLAIM_LOCK_MS
  ) {
    return { allow: true };
  }
  return { allow: false, reason: "already_claimed" };
}
