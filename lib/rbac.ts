export type Role = "student" | "mentor" | "admin";

export type AccessResult =
  | { allow: true }
  | { allow: false; redirectTo: string };

const PUBLIC_EXACT = new Set<string>([
  "/",
  "/checkout",
  "/login",
  "/api/health",
  "/favicon.ico",
]);

const PUBLIC_PREFIXES = ["/_next/"];

const KNOWN_WEBHOOKS = new Set<string>([
  "/api/webhooks/msg91",
  "/api/webhooks/resend",
  "/api/webhooks/razorpay",
]);

const ROLE_PREFIX: Record<Role, string> = {
  student: "/student",
  mentor: "/mentor",
  admin: "/admin",
};

function isPublic(pathname: string): boolean {
  if (pathname.includes("..")) return false;
  if (PUBLIC_EXACT.has(pathname)) return true;
  if (KNOWN_WEBHOOKS.has(pathname)) return true;
  return PUBLIC_PREFIXES.some((p) => pathname.startsWith(p));
}

function requiredRole(pathname: string): Role | null {
  if (pathname.startsWith("/student")) return "student";
  if (pathname.startsWith("/mentor")) return "mentor";
  if (pathname.startsWith("/admin")) return "admin";
  return null;
}

export function resolveRouteAccess(
  pathname: string,
  role: Role | null,
): AccessResult {
  if (pathname === "/login" && role) {
    return { allow: false, redirectTo: `${ROLE_PREFIX[role]}/dashboard` };
  }

  if (isPublic(pathname)) return { allow: true };

  const needed = requiredRole(pathname);
  if (!needed) {
    // Default-deny: any unmatched path requires a signed-in user.
    // Prevents accidental public exposure of new /api/* or unscoped routes.
    return role
      ? { allow: false, redirectTo: `${ROLE_PREFIX[role]}/dashboard` }
      : { allow: false, redirectTo: "/login" };
  }

  if (!role) return { allow: false, redirectTo: "/login" };
  if (role !== needed) {
    return { allow: false, redirectTo: `${ROLE_PREFIX[role]}/dashboard` };
  }
  return { allow: true };
}
