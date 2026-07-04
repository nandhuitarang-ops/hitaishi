import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { and, eq, gt, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { authSessions, profiles, users } from "@/db/schema";
import { createSessionToken } from "@/lib/auth";
import type { Role } from "@/lib/rbac";

export const SESSION_COOKIE = "hitaishi_session";
const SESSION_DAYS = 7;

export interface CurrentUser {
  id: string;
  email: string;
  role: Role;
  fullName: string;
}

export async function createSession(userId: string): Promise<string> {
  const token = createSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 86400000);
  await db.insert(authSessions).values({ userId, sessionToken: token, expiresAt });

  (await cookies()).set(SESSION_COOKIE, token, {
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
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    await db.delete(authSessions).where(eq(authSessions.sessionToken, token));
  }
  cookieStore.delete(SESSION_COOKIE);
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
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
  } catch {
    // DB unavailable — treat as unauthenticated rather than crashing the page
    return null;
  }
}

export async function requireRole(expected: Role): Promise<CurrentUser> {
  let user: CurrentUser | null = null;
  try {
    user = await getCurrentUser();
  } catch {
    // DB unavailable — redirect to login instead of 500
    redirect("/login");
  }
  if (!user) redirect("/login");
  if (user.role !== expected) redirect(`/${user.role}/dashboard`);
  return user;
}
