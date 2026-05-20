import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { and, eq, gt, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { authSessions, profiles, users } from "@/db/schema";
import { computeExpiry, createSessionToken } from "@/lib/auth";
import type { Role } from "@/lib/rbac";

export const SESSION_COOKIE = "mentoriit_session";
const SESSION_DAYS = 7;

export interface CurrentUser {
  id: string;
  email: string;
  role: Role;
  fullName: string;
}

export async function createSession(userId: string): Promise<string> {
  const token = createSessionToken();
  const expiresAt = computeExpiry(new Date(), SESSION_DAYS);
  await db.insert(authSessions).values({ userId, sessionToken: token, expiresAt });

  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });

  await db.update(users).set({ lastLoginAt: new Date() }).where(eq(users.id, userId));
  return token;
}

export async function destroySession(): Promise<void> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (token) {
    await db.delete(authSessions).where(eq(authSessions.sessionToken, token));
  }
  cookies().delete(SESSION_COOKIE);
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const rows = await db
    .select({
      id: users.id,
      email: users.email,
      role: users.role,
      status: users.status,
      deletedAt: users.deletedAt,
      fullName: profiles.fullName,
    })
    .from(authSessions)
    .innerJoin(users, eq(users.id, authSessions.userId))
    .leftJoin(profiles, eq(profiles.userId, users.id))
    .where(
      and(
        eq(authSessions.sessionToken, token),
        gt(authSessions.expiresAt, new Date()),
        isNull(users.deletedAt),
      ),
    )
    .limit(1);

  const row = rows[0];
  if (!row) return null;
  if (row.status !== "active") return null;

  return {
    id: row.id,
    email: row.email,
    role: row.role as Role,
    fullName: row.fullName ?? row.email.split("@")[0],
  };
}

export async function requireRole(expected: Role): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== expected) redirect(`/${user.role}/dashboard`);
  return user;
}
