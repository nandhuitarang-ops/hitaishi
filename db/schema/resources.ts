import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  bigint,
  boolean,
  pgEnum,
  primaryKey,
} from "drizzle-orm/pg-core";
import { users } from "./identity";
import { subjectEnum } from "./doubts";

export const resourceKindEnum = pgEnum("resource_kind", ["file", "link"]);
export const resourceScopeEnum = pgEnum("resource_scope", [
  "private",
  "per_user",
  "mentor_cohort",
  "platform",
]);

const ts = () => ({
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const resources = pgTable("resources", {
  id: uuid("id").primaryKey().defaultRandom(),
  uploaderId: uuid("uploader_id").references(() => users.id).notNull(),
  kind: resourceKindEnum("kind").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  subject: subjectEnum("subject").notNull().default("other"),
  r2Key: text("r2_key"),
  externalUrl: text("external_url"),
  sizeBytes: bigint("size_bytes", { mode: "number" }),
  scope: resourceScopeEnum("scope").notNull().default("private"),
  platformApproved: boolean("platform_approved").notNull().default(false),
  ...ts(),
});

export const resourceShares = pgTable(
  "resource_shares",
  {
    resourceId: uuid("resource_id")
      .references(() => resources.id, { onDelete: "cascade" })
      .notNull(),
    targetUserId: uuid("target_user_id").references(() => users.id).notNull(),
    sharedAt: timestamp("shared_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({ pk: primaryKey({ columns: [t.resourceId, t.targetUserId] }) }),
);
