import { describe, it, expect } from "vitest";
import {
  hashPassword,
  verifyPassword,
  createSessionToken,
  hashWebhookId,
  computeExpiry,
} from "./auth";

describe("hashPassword / verifyPassword", () => {
  it("hash is not the plaintext", async () => {
    const h = await hashPassword("hunter2");
    expect(h).not.toBe("hunter2");
    expect(h.length).toBeGreaterThan(20);
  });

  it("verifies a correct password", async () => {
    const h = await hashPassword("S3cret!");
    expect(await verifyPassword("S3cret!", h)).toBe(true);
  });

  it("rejects an incorrect password", async () => {
    const h = await hashPassword("S3cret!");
    expect(await verifyPassword("wrong", h)).toBe(false);
  });

  it("rejects empty passwords up front", async () => {
    await expect(hashPassword("")).rejects.toThrow();
  });
});

describe("createSessionToken", () => {
  it("returns a 64-char hex token", () => {
    const t = createSessionToken();
    expect(t).toMatch(/^[a-f0-9]{64}$/);
  });

  it("returns a unique token on each call", () => {
    const a = createSessionToken();
    const b = createSessionToken();
    expect(a).not.toBe(b);
  });
});

describe("hashWebhookId (idempotency)", () => {
  it("is deterministic for the same input", () => {
    expect(hashWebhookId("evt_abc")).toBe(hashWebhookId("evt_abc"));
  });

  it("differs for different inputs", () => {
    expect(hashWebhookId("evt_a")).not.toBe(hashWebhookId("evt_b"));
  });
});

describe("computeExpiry", () => {
  it("adds duration_days to a given start date", () => {
    const start = new Date("2026-01-01T00:00:00Z");
    const out = computeExpiry(start, 180);
    expect(out.toISOString()).toBe("2026-06-30T00:00:00.000Z");
  });

  it("throws for non-positive duration", () => {
    expect(() => computeExpiry(new Date(), 0)).toThrow();
    expect(() => computeExpiry(new Date(), -5)).toThrow();
  });
});
