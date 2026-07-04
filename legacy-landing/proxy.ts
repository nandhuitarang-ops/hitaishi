import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const REALM = "Hitaishi Admin";

// Both /admin/* (the dashboard UI) and the read/write side of /api/leads
// (GET, DELETE, PATCH, PUT) are protected. POST is left open so public forms work.
const PUBLIC_API_METHODS = new Set(["POST"]);

function unauthorized() {
  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": `Basic realm="${REALM}", charset="UTF-8"`,
      "Cache-Control": "no-store",
    },
  });
}

// Constant-time string comparison to defeat timing attacks on the password check.
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

function checkBasicAuth(req: NextRequest): boolean {
  const header = req.headers.get("authorization") ?? "";
  if (!header.toLowerCase().startsWith("basic ")) return false;
  const expectedUser = process.env.ADMIN_USER ?? "";
  const expectedPass = process.env.ADMIN_PASSWORD ?? "";
  if (!expectedUser || !expectedPass) return false;
  try {
    const decoded = atob(header.slice(6).trim());
    const idx = decoded.indexOf(":");
    if (idx < 0) return false;
    const user = decoded.slice(0, idx);
    const pass = decoded.slice(idx + 1);
    return safeEqual(user, expectedUser) && safeEqual(pass, expectedPass);
  } catch {
    return false;
  }
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin")) {
    return checkBasicAuth(req) ? NextResponse.next() : unauthorized();
  }

  if (pathname.startsWith("/api/leads")) {
    if (PUBLIC_API_METHODS.has(req.method)) return NextResponse.next();
    return checkBasicAuth(req) ? NextResponse.next() : unauthorized();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/leads", "/api/leads/:path*"],
};
