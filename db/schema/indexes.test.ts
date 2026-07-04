import { describe, it, expect } from "vitest";
import { getTableConfig } from "drizzle-orm/pg-core";
import * as schema from "./index";

function indexedColumns(table: unknown): Set<string> {
  // drizzle's getTableConfig exposes indexes via .indexes
  const cfg = getTableConfig(table as Parameters<typeof getTableConfig>[0]);
  const cols = new Set<string>();
  for (const idx of cfg.indexes) {
    for (const c of idx.config.columns) {
      if (typeof c === "object" && c !== null && "name" in c) {
        cols.add((c as { name: string }).name);
      }
    }
  }
  return cols;
}

describe("Hot-path indexes from design doc (IX tags)", () => {
  it("users: role + phone are indexed", () => {
    const cols = indexedColumns(schema.users);
    expect(cols).toContain("role");
    expect(cols).toContain("phone");
  });

  it("assignments: student_id + mentor_id are indexed", () => {
    const cols = indexedColumns(schema.assignments);
    expect(cols).toContain("student_id");
    expect(cols).toContain("mentor_id");
  });

  it("conversations: type + last_message_at are indexed", () => {
    const cols = indexedColumns(schema.conversations);
    expect(cols).toContain("type");
    expect(cols).toContain("last_message_at");
  });

  it("messages.conversation_id is indexed", () => {
    expect(indexedColumns(schema.messages)).toContain("conversation_id");
  });

  it("mentor_availability.mentor_id is indexed", () => {
    expect(indexedColumns(schema.mentorAvailability)).toContain("mentor_id");
  });

  it("sessions: host_id + scheduled_at are indexed", () => {
    const cols = indexedColumns(schema.sessions);
    expect(cols).toContain("host_id");
    expect(cols).toContain("scheduled_at");
  });

  it("doubts: student_id + subject + status are indexed", () => {
    const cols = indexedColumns(schema.doubts);
    expect(cols).toContain("student_id");
    expect(cols).toContain("subject");
    expect(cols).toContain("status");
  });

  it("resources.uploader_id is indexed", () => {
    expect(indexedColumns(schema.resources)).toContain("uploader_id");
  });

  it("mentor_verifications: user_id + status are indexed", () => {
    const cols = indexedColumns(schema.mentorVerifications);
    expect(cols).toContain("user_id");
    expect(cols).toContain("status");
  });

  it("auth_sessions.user_id is indexed", () => {
    expect(indexedColumns(schema.authSessions)).toContain("user_id");
  });
});
