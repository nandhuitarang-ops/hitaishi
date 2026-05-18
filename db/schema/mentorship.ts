import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  pgEnum,
  jsonb,
  primaryKey,
} from "drizzle-orm/pg-core";
import { users } from "./identity";

export const assignmentStatusEnum = pgEnum("assignment_status", [
  "active",
  "reassigned",
  "ended",
]);
export const conversationTypeEnum = pgEnum("conversation_type", [
  "student_mentor",
  "doubt_thread",
  "group",
]);

const ts = () => ({
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const assignments = pgTable("assignments", {
  id: uuid("id").primaryKey().defaultRandom(),
  studentId: uuid("student_id").references(() => users.id).notNull(),
  mentorId: uuid("mentor_id").references(() => users.id).notNull(),
  startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
  endedAt: timestamp("ended_at", { withTimezone: true }),
  status: assignmentStatusEnum("status").notNull().default("active"),
  mentorNotes: text("mentor_notes"),
  ...ts(),
});

export const conversations = pgTable("conversations", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: conversationTypeEnum("type").notNull(),
  title: varchar("title", { length: 200 }),
  lastMessageAt: timestamp("last_message_at", { withTimezone: true }),
  flagged: boolean("flagged").notNull().default(false),
  ...ts(),
});

export const conversationParticipants = pgTable(
  "conversation_participants",
  {
    conversationId: uuid("conversation_id")
      .references(() => conversations.id, { onDelete: "cascade" })
      .notNull(),
    userId: uuid("user_id").references(() => users.id).notNull(),
    lastReadAt: timestamp("last_read_at", { withTimezone: true }),
    muted: boolean("muted").notNull().default(false),
    ...ts(),
  },
  (t) => ({ pk: primaryKey({ columns: [t.conversationId, t.userId] }) }),
);

export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  conversationId: uuid("conversation_id")
    .references(() => conversations.id, { onDelete: "cascade" })
    .notNull(),
  senderId: uuid("sender_id").references(() => users.id).notNull(),
  body: text("body").notNull(),
  attachments: jsonb("attachments"),
  editedAt: timestamp("edited_at", { withTimezone: true }),
  ...ts(),
});
