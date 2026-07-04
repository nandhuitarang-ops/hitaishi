import { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { sessions } from "@/db/schema";
import { getCurrentUser } from "@/lib/session";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: sessionId } = await params;
  if (!sessionId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(sessionId)) {
    return Response.json(fail("invalid session id"), { status: 400 });
  }

  const user = await getCurrentUser();
  if (!user) {
    return Response.json(fail("unauthorized"), { status: 401 });
  }
  if (user.role !== "admin") {
    return Response.json(fail("forbidden"), { status: 403 });
  }

  try {
    const rows = await db
      .select({ meetLink: sessions.meetLink, title: sessions.title })
      .from(sessions)
      .where(eq(sessions.id, sessionId))
      .limit(1);

    const session = rows[0] ?? null;

    if (!session) {
      return Response.json(fail("session not found"), { status: 404 });
    }

    if (!session.meetLink) {
      return Response.json(fail("no meet link generated yet for this session"), {
        status: 404,
      });
    }

    return Response.json(ok({
      meetLink: session.meetLink,
      sessionId,
      role: "observer",
    }));
  } catch (err) {
    console.error("observe route error:", err);
    return Response.json(fail("failed to retrieve session"), { status: 500 });
  }
}
