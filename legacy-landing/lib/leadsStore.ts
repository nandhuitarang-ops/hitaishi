import { randomUUID } from "node:crypto";
import { Redis } from "@upstash/redis";
import type { Lead, LeadInput } from "./leadTypes";

const KEY = "leads:list";

let _redis: Redis | null = null;
function getRedis(): Redis {
  if (!_redis) _redis = Redis.fromEnv();
  return _redis;
}

function isConfigured(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

function assertConfigured(op: string): void {
  if (process.env.NODE_ENV === "production" && !isConfigured()) {
    throw new Error(
      `[leadsStore] Upstash Redis env vars missing in production; cannot ${op}. ` +
        "Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.",
    );
  }
}

/** Backfill `type: 'general'` on any legacy leads written before the discriminator existed. */
function migrate(raw: unknown): Lead | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (!o.id || !o.createdAt) return null;
  if (!o.type) {
    return {
      id: String(o.id),
      createdAt: String(o.createdAt),
      type: "general",
      name: String(o.name ?? "Unknown"),
      email: String(o.email ?? ""),
      phone: o.phone ? String(o.phone) : undefined,
      role: "Other",
      message: String(o.message ?? ""),
    };
  }
  return raw as Lead;
}

export async function readLeads(): Promise<Lead[]> {
  assertConfigured("read leads");
  if (!isConfigured()) return [];
  const items = await getRedis().lrange<unknown>(KEY, 0, -1);
  return items.map(migrate).filter((l): l is Lead => l !== null);
}

export async function appendLead(input: LeadInput): Promise<Lead> {
  assertConfigured("append lead");
  const lead: Lead = {
    ...input,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
  };
  if (isConfigured()) {
    await getRedis().lpush(KEY, lead);
  }
  return lead;
}

export async function clearLeads(): Promise<void> {
  assertConfigured("clear leads");
  if (!isConfigured()) return;
  await getRedis().del(KEY);
}
