import { randomUUID } from "node:crypto";
import { db } from "@/lib/db";
import { leads } from "@/db/schema/leads";
import { desc } from "drizzle-orm";
import type { Lead, LeadInput } from "./leadTypes";

type LeadRow = typeof leads.$inferSelect;

export async function readLeads(): Promise<Lead[]> {
  const rows = await db
    .select()
    .from(leads)
    .orderBy(desc(leads.createdAt));
  return rows.map((row: LeadRow) => {
    const base = {
      id: row.id,
      createdAt: row.createdAt.toISOString(),
      type: row.type as Lead["type"],
      name: row.name,
      email: row.email,
      phone: row.phone ?? undefined,
    };
    return { ...base, ...(row.data as Record<string, unknown>) } as Lead;
  });
}

export async function appendLead(input: LeadInput): Promise<Lead> {
  const { type, name, email, phone, ...rest } = input;
  const id = randomUUID();
  const now = new Date();
  await db.insert(leads).values({
    id,
    type,
    name,
    email,
    phone: phone ?? null,
    data: rest as Record<string, unknown>,
    createdAt: now,
    updatedAt: now,
  });
  return {
    ...input,
    id,
    createdAt: now.toISOString(),
  };
}

export async function clearLeads(): Promise<void> {
  await db.delete(leads);
}
