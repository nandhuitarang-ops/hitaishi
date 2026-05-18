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
  SOKETI_HOST: "realtime.mentoriit.com",
  SOKETI_KEY: "app-key",
  SOKETI_SECRET: "app-secret",
  RESEND_API_KEY: "re_xxx",
  RESEND_FROM: "noreply@mentoriit.com",
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

  it("in production, missing SOKETI_KEY fails the boot (H1)", () => {
    const { SOKETI_KEY, ...without } = valid;
    void SOKETI_KEY;
    const r = validateEnv(without);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.some((e) => e.includes("SOKETI_KEY"))).toBe(true);
  });

  it("in production, missing RESEND_API_KEY fails the boot (H1)", () => {
    const { RESEND_API_KEY, ...without } = valid;
    void RESEND_API_KEY;
    expect(validateEnv(without).ok).toBe(false);
  });

  it("in production, RESEND_FROM must be a valid email (H1)", () => {
    const r = validateEnv({ ...valid, RESEND_FROM: "not-an-email" });
    expect(r.ok).toBe(false);
  });

  it("rejects obvious default AUTH_SECRET values (M7)", () => {
    expect(validateEnv({ ...valid, AUTH_SECRET: "change-me-" + "x".repeat(25) }).ok).toBe(
      false,
    );
    expect(validateEnv({ ...valid, AUTH_SECRET: "test-secret-" + "x".repeat(24) }).ok).toBe(
      false,
    );
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
