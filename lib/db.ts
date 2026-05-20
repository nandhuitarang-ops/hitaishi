import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/db/schema";

const globalForDb = globalThis as unknown as {
  __mentoriit_pg?: ReturnType<typeof postgres>;
  __mentoriit_db?: any;
};

function getDb() {
  if (globalForDb.__mentoriit_db) return globalForDb.__mentoriit_db;

  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is required");
  }

  let client = globalForDb.__mentoriit_pg;
  if (!client) {
    client = postgres(url, {
      max: 10,
      ssl: "require",
      prepare: false,
      onnotice: () => {},
    });
    if (process.env.NODE_ENV !== "production") {
      globalForDb.__mentoriit_pg = client;
    }
  }

  const dbInstance = drizzle(client, { schema });
  if (process.env.NODE_ENV !== "production") {
    globalForDb.__mentoriit_db = dbInstance;
  }
  return dbInstance;
}

export const db = new Proxy({} as any, {
  get(target, prop, receiver) {
    const instance = getDb();
    const value = Reflect.get(instance, prop, receiver);
    if (typeof value === "function") {
      return value.bind(instance);
    }
    return value;
  },
});

export { schema };

