import { pgTable, uuid, varchar, numeric, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./identity";

export const examResults = pgTable("exam_results", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  examName: varchar("exam_name", { length: 200 }).notNull(),
  subject: varchar("subject", { length: 100 }),
  score: numeric("score", { precision: 10, scale: 2 }).notNull(),
  totalMarks: numeric("total_marks", { precision: 10, scale: 2 }),
  feedback: text("feedback"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
