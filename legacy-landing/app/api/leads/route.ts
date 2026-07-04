import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { appendLead, clearLeads, readLeads } from "@/lib/leadsStore";
import { leadSchema } from "@/lib/leadSchemas";
import type { InstitutionPartner, LeadInput } from "@/lib/leadTypes";

export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 32 * 1024; // 32 KB hard cap on lead payloads

// Sliding-window limiter: 5 POSTs per minute per IP. Falls back to a no-op
// if Upstash isn't configured so local dev never breaks.
function isConfigured(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

let _ratelimit: Ratelimit | null = null;
function getRateLimit(): Ratelimit | null {
  if (!isConfigured()) return null;
  if (!_ratelimit) {
    _ratelimit = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(5, "1 m"),
      analytics: false,
      prefix: "hitaishi:rl:leads",
    });
  }
  return _ratelimit;
}

function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export async function GET() {
  // Auth enforced by middleware (Basic Auth). This handler only runs for
  // authenticated requests.
  const leads = await readLeads();
  leads.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return NextResponse.json({ leads });
}

export async function POST(request: Request) {
  // 1. Body size cap — reject oversized payloads before parsing JSON.
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, error: "Payload too large." }, { status: 413 });
  }

  // 2. Rate limit per IP.
  const limiter = getRateLimit();
  if (limiter) {
    const ip = clientIp(request);
    const { success, reset } = await limiter.limit(ip);
    if (!success) {
      return NextResponse.json(
        { ok: false, error: "Too many requests. Please try again in a minute." },
        {
          status: 429,
          headers: { "Retry-After": String(Math.max(1, Math.ceil((reset - Date.now()) / 1000))) },
        },
      );
    }
  }

  // 3. Parse + validate.
  let body: unknown = null;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) {
      return NextResponse.json({ ok: false, error: "Payload too large." }, { status: 413 });
    }
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }
  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    // Log details server-side, return only a generic message to the client.
    console.warn("[/api/leads] validation failed", parsed.error.issues);
    return NextResponse.json({ ok: false, error: "Validation failed." }, { status: 400 });
  }

  // 4. Honeypot trap — bots that fill the hidden `website` field get a
  //    silent 200 (no DB write, no error feedback that would help them adapt).
  const data = parsed.data;
  if (data.website && data.website.trim().length > 0) {
    console.info("[/api/leads] honeypot tripped, dropping submission");
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  // 5. Strip honeypot before persisting + synthesise the institution `name`.
  const clean = { ...data } as Record<string, unknown>;
  delete clean.website;
  let input: LeadInput = clean as unknown as LeadInput;
  if (input.type === "institution-partner") {
    const ip = input as Omit<InstitutionPartner, "name">;
    input = { ...ip, name: ip.contactPerson } as InstitutionPartner;
  }

  // 6. Persist with explicit error handling — don't leak internals to the client.
  try {
    const lead = await appendLead(input);
    return NextResponse.json({ ok: true, lead }, { status: 201 });
  } catch (err) {
    console.error("[/api/leads] persist failed", err);
    return NextResponse.json(
      { ok: false, error: "Could not save your message. Please try again." },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  // Auth enforced by middleware.
  try {
    await clearLeads();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[/api/leads] DELETE failed", err);
    return NextResponse.json({ ok: false, error: "Operation failed." }, { status: 500 });
  }
}
