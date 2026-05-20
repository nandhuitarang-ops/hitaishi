import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import * as schema from "./schema";
import { hashPassword } from "../lib/auth";

interface DemoUser {
  email: string;
  password: string;
  role: "student" | "mentor" | "admin";
  fullName: string;
  bio: string;
}

const DEMO: DemoUser[] = [
  {
    email: "student@demo.mentoriit.com",
    password: "demo1234",
    role: "student",
    fullName: "Arjun Sharma",
    bio: "Class 12, targeting JEE Main 2026.",
  },
  {
    email: "mentor@demo.mentoriit.com",
    password: "demo1234",
    role: "mentor",
    fullName: "Priya Iyer",
    bio: "IIT Bombay '22, CSE. AIR 312, JEE Advanced.",
  },
  {
    email: "admin@demo.mentoriit.com",
    password: "demo1234",
    role: "admin",
    fullName: "MentorIIT Admin",
    bio: "Internal admin account.",
  },
];

async function main() {
  const url = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL or DIRECT_URL required");
    process.exit(1);
  }
  const client = postgres(url, { max: 1, ssl: "require", prepare: false, onnotice: () => {} });
  const db = drizzle(client, { schema });

  try {
    for (const d of DEMO) {
      const passwordHash = await hashPassword(d.password);
      const existing = await db
        .select({ id: schema.users.id })
        .from(schema.users)
        .where(eq(schema.users.email, d.email))
        .limit(1);

      let userId: string;
      if (existing[0]) {
        userId = existing[0].id;
        await db
          .update(schema.users)
          .set({
            passwordHash,
            role: d.role,
            status: "active",
            deletedAt: null,
          })
          .where(eq(schema.users.id, userId));
      } else {
        const inserted = await db
          .insert(schema.users)
          .values({
            email: d.email,
            passwordHash,
            role: d.role,
            status: "active",
          })
          .returning({ id: schema.users.id });
        userId = inserted[0].id;
      }

      const profileExists = await db
        .select({ userId: schema.profiles.userId })
        .from(schema.profiles)
        .where(eq(schema.profiles.userId, userId))
        .limit(1);

      if (profileExists[0]) {
        await db
          .update(schema.profiles)
          .set({ fullName: d.fullName, bio: d.bio })
          .where(eq(schema.profiles.userId, userId));
      } else {
        await db.insert(schema.profiles).values({
          userId,
          fullName: d.fullName,
          bio: d.bio,
          ...(d.role === "student"
            ? { targetExam: "jee_main" as const, targetYear: 2026 }
            : {}),
          ...(d.role === "mentor"
            ? { institute: "IIT Bombay", graduationYear: 2022 }
            : {}),
        });
      }

      console.log(`✓ ${d.role.padEnd(7)} ${d.email}`);
    }
    console.log("\nseed complete. login with any demo email + password 'demo1234'.");
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
