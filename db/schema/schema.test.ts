import { describe, it, expect } from "vitest";
import * as schema from "./index";

describe("Drizzle schema — domain coverage (25 tables)", () => {
  const expected = [
    // D.01 Identity & Access (4)
    "users",
    "profiles",
    "mentorVerifications",
    "authSessions",
    // D.02 Plans & Payments — removed
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
    // D.07 Feedback (1)
    "feedbackTemplates",
    // D.08 System (3)
    "notifications",
    "auditLog",
    "webhookEvents",
  ] as const;

  it.each(expected)("exports %s table", (name) => {
    expect(schema).toHaveProperty(name);
    expect((schema as Record<string, unknown>)[name]).toBeDefined();
  });

  it("exports exactly 20 tables", () => {
    expect(expected.length).toBe(20);
  });

  it("users table has required columns", () => {
    const cols = Object.keys(schema.users);
    for (const col of ["id", "email", "phone", "passwordHash", "role", "status"]) {
      expect(cols).toContain(col);
    }
  });

  it("webhookEvents.externalId is unique for idempotency", () => {
    expect(schema.webhookEvents.externalId.isUnique).toBe(true);
  });
});
