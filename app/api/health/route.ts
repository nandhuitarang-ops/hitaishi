import { ok } from "@/lib/api";

export async function GET() {
  return Response.json(ok({ ts: Date.now() }));
}
