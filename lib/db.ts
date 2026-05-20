import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/db/schema";

const globalForDb = globalThis as unknown as {
  __mentoriit_pg?: ReturnType<typeof postgres>;
};

function getClient() {
  if (globalForDb.__mentoriit_pg) return globalForDb.__mentoriit_pg;
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is required");
  const client = postgres(url, {
    max: 10,
    ssl: "require",
    prepare: false,
    onnotice: () => {},
  });
  if (process.env.NODE_ENV !== "production") {
    globalForDb.__mentoriit_pg = client;
  }
  return client;
}

export const db = drizzle(getClient(), { schema });
export { schema };
