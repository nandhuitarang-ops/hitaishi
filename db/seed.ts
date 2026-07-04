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
    email: "student@demo.hitaishi.app",
    password: "demo1234",
    role: "student",
    fullName: "Arjun Sharma",
    bio: "Class 12, targeting JEE Main 2026.",
  },
  {
    email: "mentor@demo.hitaishi.app",
    password: "demo1234",
    role: "mentor",
    fullName: "Priya Iyer",
    bio: "IIT Bombay '22, CSE. AIR 312, JEE Advanced.",
  },
  {
    email: "admin@demo.hitaishi.app",
    password: "demo1234",
    role: "admin",
    fullName: "Hitaishi Admin",
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

    const studentId = (
      await db.select({ id: schema.users.id }).from(schema.users).where(eq(schema.users.email, "student@demo.hitaishi.app")).limit(1)
    )[0]?.id;
    const mentorId = (
      await db.select({ id: schema.users.id }).from(schema.users).where(eq(schema.users.email, "mentor@demo.hitaishi.app")).limit(1)
    )[0]?.id;

    if (studentId && mentorId) {
      let convId: string;
      const existing = await db.select({ id: schema.conversations.id })
        .from(schema.conversations)
        .innerJoin(schema.conversationParticipants, eq(schema.conversationParticipants.conversationId, schema.conversations.id))
        .where(eq(schema.conversationParticipants.userId, studentId))
        .limit(1);

      if (existing[0]) {
        convId = existing[0].id;
      } else {
        const inserted = await db.insert(schema.conversations)
          .values({ type: "student_mentor", lastMessageAt: new Date() })
          .returning({ id: schema.conversations.id });
        convId = inserted[0]!.id;
        await db.insert(schema.conversationParticipants).values([
          { conversationId: convId, userId: studentId },
          { conversationId: convId, userId: mentorId },
        ]);

        await db.insert(schema.messages).values([
          {
            conversationId: convId,
            senderId: mentorId,
            body: "Hi Arjun! Welcome to Hitaishi. I'm Priya, your mentor for JEE Main prep. How are you finding the study material so far?",
          },
          {
            conversationId: convId,
            senderId: studentId,
            body: "Hi ma'am, thanks! The Physics module is going well but I'm stuck on a few Organic Chemistry problems. Can we schedule a session this week?",
          },
          {
            conversationId: convId,
            senderId: mentorId,
            body: "Absolutely. I've opened Tuesday 6pm and Thursday 7pm slots for you. Pick whichever works best, and bring the problems to the session.",
          },
        ]);
        await db.update(schema.conversations).set({ lastMessageAt: new Date() }).where(eq(schema.conversations.id, convId));
        console.log(`✓ created demo conversation (id: ${convId}) with 3 welcome messages`);
      }
    }

    const adminId = (
      await db.select({ id: schema.users.id }).from(schema.users).where(eq(schema.users.email, "admin@demo.hitaishi.app")).limit(1)
    )[0]?.id;

    async function seedAdminConversation(demoUserId: string | undefined, otherName: string, otherEmail: string, type: "student" | "mentor") {
      if (!adminId || !demoUserId) return;
      const cp = schema.conversationParticipants;
      const adminConvs = await db.select({ convId: cp.conversationId }).from(cp).where(eq(cp.userId, adminId));
      const demoConvs = await db.select({ convId: cp.conversationId }).from(cp).where(eq(cp.userId, demoUserId));
      const adminConvIds = new Set(adminConvs.map((r: any) => r.convId));
      const shared = demoConvs.filter((r: any) => adminConvIds.has(r.convId));
      if (shared.length > 0) return;

      const inserted = await db.insert(schema.conversations)
        .values({ type: "student_mentor", lastMessageAt: new Date() })
        .returning({ id: schema.conversations.id });
      const cid = inserted[0]!.id;
      await db.insert(schema.conversationParticipants).values([
        { conversationId: cid, userId: adminId },
        { conversationId: cid, userId: demoUserId },
      ]);

      const welcome = type === "student"
        ? `Hi Arjun! This is the Hitaishi admin team. We're here to support you throughout your JEE prep journey with Priya. Feel free to reach out anytime if you need help.`
        : `Hi Priya! This is the Hitaishi admin team. We're monitoring the platform and here to support you and your students. Let us know if you need anything.`;

      await db.insert(schema.messages).values([
        { conversationId: cid, senderId: adminId, body: welcome },
      ]);
      await db.update(schema.conversations).set({ lastMessageAt: new Date() }).where(eq(schema.conversations.id, cid));
      console.log(`✓ created admin-${type} conversation (id: ${cid})`);
    }

    await seedAdminConversation(studentId, "Arjun Sharma", "student@demo.hitaishi.app", "student");
    await seedAdminConversation(mentorId, "Priya Iyer", "mentor@demo.hitaishi.app", "mentor");

    console.log("\nseed complete. login with any demo email + password 'demo1234'.");
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
