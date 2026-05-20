import { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api";
import { issueHmsToken } from "@/lib/hms";

// TODO(phase-6f): replace stub IDs with a Drizzle lookup against `sessions`
// and the admin's session-derived userId. Currently any cookie-admin can
// pull an observer token for any room, which is OK in dev (the route is
// gated by middleware) but MUST be tightened before pilot.
export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const access = process.env.HMS_ACCESS_KEY;
  const secret = process.env.HMS_SECRET;
  if (!access || !secret) {
    return Response.json(fail("100ms credentials not configured"), {
      status: 503,
      headers: { "Retry-After": "60" },
    });
  }

  const sessionId = params.id;
  if (!sessionId || !/^[a-zA-Z0-9_-]+$/.test(sessionId)) {
    return Response.json(fail("invalid session id"), { status: 400 });
  }

  try {
    const token = issueHmsToken({
      appAccessKey: access,
      appSecret: secret,
      roomId: sessionId, // TODO: lookup sessions.hmsRoomId
      userId: "admin-observer", // TODO: req.session.userId once auth wired
      role: "observer",
      ttlSeconds: 1800, // 30 min observe windows
    });
    return Response.json(ok({ token, roomId: sessionId, role: "observer" }));
  } catch {
    return Response.json(fail("token issuance failed"), { status: 500 });
  }
}
