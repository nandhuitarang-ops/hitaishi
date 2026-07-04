import { pgTable, uuid, varchar, jsonb, timestamp, pgEnum, index } from "drizzle-orm/pg-core";

export const leadTypeEnum = pgEnum("lead_type", [
  "student-inquiry",
  "mentor-application",
  "institution-partner",
  "general",
]);

export const leads = pgTable(
  "leads",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    type: leadTypeEnum("type").notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 50 }),
    data: jsonb("data").$type<Record<string, unknown>>().default({}).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    typeIdx: index("idx_leads_type").on(t.type),
    createdAtIdx: index("idx_leads_created_at").on(t.createdAt),
    leadsEmailIdx: index("idx_leads_email").on(t.email),
  }),
);
