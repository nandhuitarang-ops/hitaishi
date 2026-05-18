import {
  pgTable,
  uuid,
  varchar,
  integer,
  boolean,
  jsonb,
  timestamp,
  date,
  pgEnum,
  text,
} from "drizzle-orm/pg-core";
import { users } from "./identity";

export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "active",
  "expired",
  "refunded",
  "revoked",
]);
export const paymentStatusEnum = pgEnum("payment_status", [
  "created",
  "success",
  "failed",
  "refunded",
]);
export const paymentMethodEnum = pgEnum("payment_method", [
  "upi",
  "card",
  "netbanking",
  "emi",
]);
export const refundStatusEnum = pgEnum("refund_status", [
  "pending",
  "approved",
  "rejected",
  "processed",
]);
export const payoutStatusEnum = pgEnum("payout_status", [
  "pending",
  "processing",
  "paid",
  "failed",
]);

const ts = () => ({
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const plans = pgTable("plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: varchar("code", { length: 40 }).unique().notNull(),
  name: varchar("name", { length: 120 }).notNull(),
  priceInr: integer("price_inr").notNull(),
  durationDays: integer("duration_days").notNull(),
  features: jsonb("features"),
  isActive: boolean("is_active").notNull().default(true),
  ...ts(),
});

export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  razorpayOrderId: varchar("razorpay_order_id", { length: 40 }).unique().notNull(),
  razorpayPaymentId: varchar("razorpay_payment_id", { length: 40 }),
  amountInr: integer("amount_inr").notNull(),
  status: paymentStatusEnum("status").notNull().default("created"),
  method: paymentMethodEnum("method"),
  webhookPayload: jsonb("webhook_payload"),
  ...ts(),
});

export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  planId: uuid("plan_id").references(() => plans.id).notNull(),
  paymentId: uuid("payment_id").references(() => payments.id),
  startedAt: timestamp("started_at", { withTimezone: true }).notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  status: subscriptionStatusEnum("status").notNull().default("active"),
  ...ts(),
});

export const refunds = pgTable("refunds", {
  id: uuid("id").primaryKey().defaultRandom(),
  paymentId: uuid("payment_id").references(() => payments.id).notNull(),
  requestedBy: uuid("requested_by").references(() => users.id),
  approvedBy: uuid("approved_by").references(() => users.id),
  reason: text("reason"),
  amountInr: integer("amount_inr").notNull(),
  razorpayRefundId: varchar("razorpay_refund_id", { length: 40 }),
  status: refundStatusEnum("status").notNull().default("pending"),
  ...ts(),
});

export const payouts = pgTable("payouts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  periodStart: date("period_start").notNull(),
  periodEnd: date("period_end").notNull(),
  grossInr: integer("gross_inr").notNull(),
  platformFeeInr: integer("platform_fee_inr").notNull(),
  tdsInr: integer("tds_inr").notNull().default(0),
  netInr: integer("net_inr").notNull(),
  razorpayTransferId: varchar("razorpay_transfer_id", { length: 40 }),
  status: payoutStatusEnum("status").notNull().default("pending"),
  ...ts(),
});
