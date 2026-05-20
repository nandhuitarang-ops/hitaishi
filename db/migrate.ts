import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

async function main() {
  const url = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL or DIRECT_URL required");
    process.exit(1);
  }
  const client = postgres(url, {
    max: 1,
    ssl: "require",
    prepare: false,
    onnotice: () => {},
  });
  try {
    await migrate(drizzle(client), { migrationsFolder: "db/migrations" });
    console.log("migrations applied");
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
