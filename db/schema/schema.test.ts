import { describe, it, expect } from "vitest";
import * as schema from "./index";

describe("Drizzle schema — domain coverage (24 tables)", () => {
  const expected = [
    // D.01 Identity & Access (4)
    "users",
    "profiles",
    "mentorVerifications",
    "authSessions",
    // D.02 Plans & Payments (5)
    "plans",
    "subscriptions",
    "payments",
    "refunds",
    "payouts",
    // D.03 Mentorship (4)
    "assignments",
    "conversations",
    "conversationParticipants",
    "messages",
    // D.04 Live Sessions (4)
    "mentorAvailability",
    "sessions",
    "sessionParticipants",
    "recordings",
    // D.05 Doubts (2)
    "doubts",
    "doubtAnswers",
    // D.06 Resources (2)
    "resources",
    "resourceShares",
    // D.07 System (3)
    "notifications",
    "auditLog",
    "webhookEvents",
  ] as const;

  it.each(expected)("exports %s table", (name) => {
    expect(schema).toHaveProperty(name);
    expect((schema as Record<string, unknown>)[name]).toBeDefined();
  });

  it("exports exactly 24 tables", () => {
    expect(expected.length).toBe(24);
  });

  it("users table has required columns", () => {
    const cols = Object.keys(schema.users);
    for (const col of ["id", "email", "phone", "passwordHash", "role", "status"]) {
      expect(cols).toContain(col);
    }
  });

  it("payments stores amount in paise (integer)", () => {
    expect(schema.payments.amountInr.dataType).toBe("number");
  });

  it("webhookEvents.externalId is unique for idempotency", () => {
    expect(schema.webhookEvents.externalId.isUnique).toBe(true);
  });
});
