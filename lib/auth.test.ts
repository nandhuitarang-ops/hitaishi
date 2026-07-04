import { describe, it, expect } from "vitest";
import {
  hashPassword,
  verifyPassword,
  createSessionToken,
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


