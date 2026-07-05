import { pgTable, uuid, varchar, jsonb, timestamp, text, smallint } from "drizzle-orm/pg-core";
import { users } from "./identity";
import { sessions } from "./sessions";

const ts = () => ({
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const feedbackTemplates = pgTable("feedback_templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  mentorId: uuid("mentor_id")
    .references(() => users.id)
    .notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  questions: jsonb("questions").notNull(),
  ...ts(),
});

export const mentorFeedbacks = pgTable("mentor_feedbacks", {
  id: uuid("id").primaryKey().defaultRandom(),
  studentId: uuid("student_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  mentorId: uuid("mentor_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  sessionId: uuid("session_id")
    .references(() => sessions.id, { onDelete: "set null" }),
  rating: smallint("rating").notNull(), // rating from 1 to 5
  content: text("content").notNull(), // feedback content
  ...ts(),
});
