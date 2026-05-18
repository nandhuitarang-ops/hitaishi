import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  smallint,
  bigserial,
  jsonb,
  pgEnum,
  inet,
} from "drizzle-orm/pg-core";
import { users } from "./identity";

export const notificationChannelEnum = pgEnum("notification_channel", [
  "email",
  "sms",
  "push",
  "in_app",
]);
export const notificationStatusEnum = pgEnum("notification_status", [
  "queued",
  "sent",
  "delivered",
  "failed",
]);
export const webhookProviderEnum = pgEnum("webhook_provider", [
  "razorpay",
  "hms_100",
  "msg91",
  "resend",
]);

const ts = () => ({
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  recipientId: uuid("recipient_id").references(() => users.id).notNull(),
  channel: notificationChannelEnum("channel").notNull(),
  templateCode: varchar("template_code", { length: 60 }).notNull(),
  payload: jsonb("payload"),
  providerId: varchar("provider_id", { length: 80 }),
  status: notificationStatusEnum("status").notNull().default("queued"),
  ...ts(),
});

export const auditLog = pgTable("audit_log", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  actorId: uuid("actor_id").references(() => users.id),
  action: varchar("action", { length: 60 }).notNull(),
  targetType: varchar("target_type", { length: 40 }),
  targetId: uuid("target_id"),
  metadata: jsonb("metadata"),
  ipAddress: inet("ip_address"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const webhookEvents = pgTable("webhook_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  provider: webhookProviderEnum("provider").notNull(),
  externalId: varchar("external_id", { length: 120 }).unique().notNull(),
  eventType: varchar("event_type", { length: 60 }).notNull(),
  payload: jsonb("payload"),
  processedAt: timestamp("processed_at", { withTimezone: true }),
  processingAttempts: smallint("processing_attempts").notNull().default(0),
  ...ts(),
});
