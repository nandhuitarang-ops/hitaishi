import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  integer,
  smallint,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";
import { users } from "./identity";

export const subjectEnum = pgEnum("subject", [
  "physics",
  "chemistry",
  "maths",
  "other",
]);
export const doubtStatusEnum = pgEnum("doubt_status", [
  "open",
  "claimed",
  "answered",
  "abandoned",
]);

const ts = () => ({
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const doubts = pgTable("doubts", {
  id: uuid("id").primaryKey().defaultRandom(),
  studentId: uuid("student_id").references(() => users.id).notNull(),
  subject: subjectEnum("subject").notNull(),
  topic: varchar("topic", { length: 120 }),
  body: text("body").notNull(),
  attachments: jsonb("attachments"),
  claimedBy: uuid("claimed_by").references(() => users.id),
  claimedAt: timestamp("claimed_at", { withTimezone: true }),
  status: doubtStatusEnum("status").notNull().default("open"),
  payoutInr: integer("payout_inr").notNull().default(0),
  ...ts(),
});

export const doubtAnswers = pgTable("doubt_answers", {
  id: uuid("id").primaryKey().defaultRandom(),
  doubtId: uuid("doubt_id")
    .references(() => doubts.id, { onDelete: "cascade" })
    .unique()
    .notNull(),
  answererId: uuid("answerer_id").references(() => users.id).notNull(),
  body: text("body").notNull(),
  attachments: jsonb("attachments"),
  responseSeconds: integer("response_seconds"),
  studentRating: smallint("student_rating"),
  studentFeedback: text("student_feedback"),
  ...ts(),
});
