import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sessions } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const rows = await db
      .select({ status: sessions.status, startedAt: sessions.startedAt })
      .from(sessions)
      .where(eq(sessions.id, id))
      .limit(1);

    const row = rows[0];
    if (!row) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    let currentStatus = row.status;
    let secondsRemaining = 0;
    const REDIRECT_DELAY_MS = 60000; // 60 seconds delay

    if (row.status === "live" && row.startedAt) {
      const elapsedMs = Date.now() - new Date(row.startedAt).getTime();
      if (elapsedMs < REDIRECT_DELAY_MS) {
        currentStatus = "starting";
        secondsRemaining = Math.max(0, Math.ceil((REDIRECT_DELAY_MS - elapsedMs) / 1000));
      }
    }

    return NextResponse.json({ status: currentStatus, secondsRemaining });
  } catch (err: any) {
    console.error("GET session status error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
