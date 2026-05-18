import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  pgEnum,
  jsonb,
  integer,
  inet,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["student", "mentor", "admin"]);
export const userStatusEnum = pgEnum("user_status", [
  "pending",
  "active",
  "suspended",
  "banned",
]);
export const targetExamEnum = pgEnum("target_exam", [
  "jee_main",
  "jee_advanced",
  "both",
]);
export const verificationStatusEnum = pgEnum("verification_status", [
  "pending",
  "approved",
  "rejected",
]);

const ts = () => ({
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  phone: varchar("phone", { length: 15 }),
  passwordHash: varchar("password_hash", { length: 255 }),
  role: userRoleEnum("role").notNull(),
  status: userStatusEnum("status").notNull().default("pending"),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  ...ts(),
});

export const profiles = pgTable("profiles", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  fullName: varchar("full_name", { length: 120 }),
  photoUrl: text("photo_url"),
  bio: text("bio"),
  targetExam: targetExamEnum("target_exam"),
  targetYear: integer("target_year"),
  subjectsFocus: jsonb("subjects_focus"),
  institute: varchar("institute", { length: 120 }),
  graduationYear: integer("graduation_year"),
  ...ts(),
});

export const mentorVerifications = pgTable("mentor_verifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  documents: jsonb("documents"),
  linkedinUrl: text("linkedin_url"),
  jeeRank: integer("jee_rank"),
  status: verificationStatusEnum("status").notNull().default("pending"),
  reviewedBy: uuid("reviewed_by").references(() => users.id),
  reviewNotes: text("review_notes"),
  ...ts(),
});

export const authSessions = pgTable("auth_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  sessionToken: varchar("session_token", { length: 255 }).unique().notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  userAgent: text("user_agent"),
  ipAddress: inet("ip_address"),
  ...ts(),
});
