import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/db/schema";

const globalForDb = globalThis as unknown as {
  __hitaishi_pg?: ReturnType<typeof postgres>;
  __hitaishi_db?: any;
};

function getDb() {
  if (globalForDb.__hitaishi_db) return globalForDb.__hitaishi_db;

  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is required");
  }

  let client = globalForDb.__hitaishi_pg;
  if (!client) {
    client = postgres(url, {
      max: 15,
      max_lifetime: 60 * 30,
      idle_timeout: 30,
      ssl: "require",
      prepare: false,
      onnotice: () => {},
    });
    globalForDb.__hitaishi_pg = client;
  }

  const dbInstance = globalForDb.__hitaishi_db ?? drizzle(client, { schema });
  globalForDb.__hitaishi_db = dbInstance;
  return dbInstance;
}

const dbInstance = getDb();
export { dbInstance as db };

export { schema };

