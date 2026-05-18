import { describe, it, expect } from "vitest";
import { validateEnv } from "./env";

const valid = {
  NODE_ENV: "production",
  DATABASE_URL: "postgres://u:p@host:5432/db",
  AUTH_SECRET: "a".repeat(32),
  RAZORPAY_KEY_ID: "rzp_live_x",
  RAZORPAY_KEY_SECRET: "secret",
  RAZORPAY_WEBHOOK_SECRET: "whsec",
  HMS_ACCESS_KEY: "key",
  HMS_SECRET: "h".repeat(32),
  R2_ACCOUNT_ID: "x",
  R2_ACCESS_KEY_ID: "k",
  R2_SECRET_ACCESS_KEY: "s",
  R2_BUCKET: "b",
  REDIS_URL: "redis://localhost:6379",
};

describe("validateEnv", () => {
  it("accepts a full valid env in production", () => {
    const r = validateEnv(valid);
    expect(r.ok).toBe(true);
  });

  it("rejects when DATABASE_URL is missing", () => {
    const broken = { ...valid, DATABASE_URL: undefined as unknown as string };
    const r = validateEnv(broken);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.some((e) => e.includes("DATABASE_URL"))).toBe(true);
  });

  it("rejects short AUTH_SECRET (<32 chars)", () => {
    const r = validateEnv({ ...valid, AUTH_SECRET: "too-short" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.some((e) => e.includes("AUTH_SECRET"))).toBe(true);
  });

  it("rejects short HMS_SECRET (<32 chars)", () => {
    const r = validateEnv({ ...valid, HMS_SECRET: "short" });
    expect(r.ok).toBe(false);
  });

  it("in development, missing optional vars are OK", () => {
    const dev = {
      NODE_ENV: "development",
      DATABASE_URL: valid.DATABASE_URL,
      AUTH_SECRET: valid.AUTH_SECRET,
    };
    expect(validateEnv(dev).ok).toBe(true);
  });

  it("in production, ALL critical vars are required", () => {
    const dev = {
      NODE_ENV: "production",
      DATABASE_URL: valid.DATABASE_URL,
      AUTH_SECRET: valid.AUTH_SECRET,
    };
    const r = validateEnv(dev);
    expect(r.ok).toBe(false);
  });
});
