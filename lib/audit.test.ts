import { describe, it, expect } from "vitest";
import { buildAuditEntry } from "./audit";

describe("buildAuditEntry", () => {
  it("captures actor, action, target, and metadata", () => {
    const entry = buildAuditEntry({
      actorId: "admin-1",
      action: "mentor.approved",
      targetType: "user",
      targetId: "mentor-9",
      ipAddress: "203.0.113.1",
    });
    expect(entry.actorId).toBe("admin-1");
    expect(entry.action).toBe("mentor.approved");
    expect(entry.targetType).toBe("user");
    expect(entry.targetId).toBe("mentor-9");
    expect(entry.ipAddress).toBe("203.0.113.1");
    expect(entry.createdAt).toBeInstanceOf(Date);
  });

  it("redacts sensitive metadata keys", () => {
    const entry = buildAuditEntry({
      actorId: "admin-1",
      action: "user.updated",
      metadata: {
        password: "hunter2",
        api_key: "sk-xxxx",
        passwordHash: "$2b$12$...",
        normal_field: "kept",
      },
    });
    expect(entry.metadata).toEqual({
      password: "[REDACTED]",
      api_key: "[REDACTED]",
      passwordHash: "[REDACTED]",
      normal_field: "kept",
    });
  });

  it("rejects empty action", () => {
    expect(() =>
      buildAuditEntry({ actorId: "x", action: "" as never }),
    ).toThrow();
  });
});
