"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { verifyPassword } from "@/lib/auth";
import { createSession, destroySession } from "@/lib/session";
import type { Role } from "@/lib/rbac";

const credSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type LoginState = { error?: string } | undefined;

const DEMO_EMAIL: Record<Role, string> = {
  student: "student@demo.mentoriit.com",
  mentor: "mentor@demo.mentoriit.com",
  admin: "admin@demo.mentoriit.com",
};

async function signIn(email: string, password: string): Promise<{ role: Role } | { error: string }> {
  const rows = await db
    .select({
      id: users.id,
      passwordHash: users.passwordHash,
      role: users.role,
      status: users.status,
    })
    .from(users)
    .where(eq(users.email, email.toLowerCase().trim()))
    .limit(1);

  const u = rows[0];
  // Constant-ish: always run bcrypt to avoid trivial timing leak between
  // "no such email" and "wrong password".
  const hash = u?.passwordHash ?? "$2a$12$0000000000000000000000000000000000000000000000000000";
  const ok = await verifyPassword(password, hash);

  if (!u || !ok) return { error: "Invalid email or password." };
  if (u.status !== "active") return { error: "Account is not active." };

  await createSession(u.id);
  return { role: u.role as Role };
}

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = credSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: "Enter a valid email and password." };

  const result = await signIn(parsed.data.email, parsed.data.password);
  if ("error" in result) return { error: result.error };
  redirect(`/${result.role}/dashboard`);
}

export async function demoLoginAction(formData: FormData): Promise<void> {
  const role = formData.get("role");
  if (role !== "student" && role !== "mentor" && role !== "admin") {
    redirect("/login");
  }
  const result = await signIn(DEMO_EMAIL[role as Role], "demo1234");
  if ("error" in result) redirect("/login");
  redirect(`/${(result as { role: Role }).role}/dashboard`);
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/login");
}
