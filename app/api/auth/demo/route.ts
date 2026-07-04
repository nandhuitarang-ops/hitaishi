import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { verifyPassword } from "@/lib/auth";
import { createSession } from "@/lib/session";
import type { Role } from "@/lib/rbac";

const DEMO_EMAIL: Record<Role, string> = {
  student: "student@demo.hitaishi.app",
  mentor: "mentor@demo.hitaishi.app",
  admin: "admin@demo.hitaishi.app",
};

export async function GET(req: NextRequest) {
  const role = req.nextUrl.searchParams.get("role");

  if (!role || !["student", "mentor", "admin"].includes(role)) {
    return NextResponse.redirect(new URL("/login", req.url), {
      headers: { "Cache-Control": "private, max-age=0" },
    });
  }

  const email = DEMO_EMAIL[role as Role];
  const rows = await db
    .select({ id: users.id, passwordHash: users.passwordHash })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  const u = rows[0];
  if (!u)
    return NextResponse.redirect(new URL("/login", req.url), {
      headers: { "Cache-Control": "private, max-age=0" },
    });

  const ok = await verifyPassword("demo1234", u.passwordHash ?? "");
  if (!ok)
    return NextResponse.redirect(new URL("/login", req.url), {
      headers: { "Cache-Control": "private, max-age=0" },
    });

  await createSession(u.id);
  return NextResponse.redirect(new URL(`/${role}/dashboard`, req.url), {
    headers: { "Cache-Control": "private, max-age=0" },
  });
}
