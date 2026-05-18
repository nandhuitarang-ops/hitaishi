import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  time,
  smallint,
  integer,
  bigint,
  pgEnum,
  primaryKey,
} from "drizzle-orm/pg-core";
import { users } from "./identity";

export const availabilitySetByEnum = pgEnum("availability_set_by", [
  "mentor",
  "admin",
]);
export const sessionTypeEnum = pgEnum("session_type", ["one_on_one", "group"]);
export const sessionStatusEnum = pgEnum("session_status", [
  "scheduled",
  "live",
  "completed",
  "cancelled",
]);
export const sessionRoleEnum = pgEnum("session_role", [
  "host",
  "participant",
  "observer",
]);
export const recordingStatusEnum = pgEnum("recording_status", [
  "processing",
  "ready",
  "failed",
]);

const ts = () => ({
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const mentorAvailability = pgTable("mentor_availability", {
  id: uuid("id").primaryKey().defaultRandom(),
  mentorId: uuid("mentor_id").references(() => users.id).notNull(),
  dayOfWeek: smallint("day_of_week").notNull(),
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
  slotMinutes: smallint("slot_minutes").notNull().default(30),
  setBy: availabilitySetByEnum("set_by").notNull().default("admin"),
  ...ts(),
});

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  hostId: uuid("host_id").references(() => users.id).notNull(),
  type: sessionTypeEnum("type").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  scheduledAt: timestamp("scheduled_at", { withTimezone: true }).notNull(),
  durationMinutes: smallint("duration_minutes").notNull().default(60),
  hmsRoomId: varchar("hms_room_id", { length: 60 }),
  status: sessionStatusEnum("status").notNull().default("scheduled"),
  startedAt: timestamp("started_at", { withTimezone: true }),
  endedAt: timestamp("ended_at", { withTimezone: true }),
  ...ts(),
});

export const sessionParticipants = pgTable(
  "session_participants",
  {
    sessionId: uuid("session_id")
      .references(() => sessions.id, { onDelete: "cascade" })
      .notNull(),
    userId: uuid("user_id").references(() => users.id).notNull(),
    roleInSession: sessionRoleEnum("role_in_session").notNull(),
    joinedAt: timestamp("joined_at", { withTimezone: true }),
    leftAt: timestamp("left_at", { withTimezone: true }),
    ...ts(),
  },
  (t) => ({ pk: primaryKey({ columns: [t.sessionId, t.userId] }) }),
);

export const recordings = pgTable("recordings", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: uuid("session_id")
    .references(() => sessions.id, { onDelete: "cascade" })
    .unique()
    .notNull(),
  r2Key: text("r2_key").notNull(),
  durationSeconds: integer("duration_seconds"),
  sizeBytes: bigint("size_bytes", { mode: "number" }),
  processingStatus: recordingStatusEnum("processing_status")
    .notNull()
    .default("processing"),
  ...ts(),
});
