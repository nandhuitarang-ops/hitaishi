import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";

const BCRYPT_COST = 10;

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
