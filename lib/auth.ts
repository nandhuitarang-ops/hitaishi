import bcrypt from "bcryptjs";
import { randomBytes, createHash } from "node:crypto";

const BCRYPT_COST = 12;

export async function hashPassword(plain: string): Promise<string> {
  if (!plain || plain.length < 1) {
    throw new Error("password must be non-empty");
  }
  return bcrypt.hash(plain, BCRYPT_COST);
}

export async function verifyPassword(
  plain: string,
  hash: string,
): Promise<boolean> {
  if (!plain || !hash) return false;
  return bcrypt.compare(plain, hash);
}

export function createSessionToken(): string {
  return randomBytes(32).toString("hex");
}

export function hashWebhookId(externalId: string): string {
  return createHash("sha256").update(externalId).digest("hex");
}

export function computeExpiry(start: Date, durationDays: number): Date {
  if (durationDays <= 0) {
    throw new Error("durationDays must be positive");
  }
  const ms = durationDays * 24 * 60 * 60 * 1000;
  return new Date(start.getTime() + ms);
}
