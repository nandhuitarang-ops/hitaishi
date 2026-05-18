export type Role = "student" | "mentor" | "admin";

export type AccessResult =
  | { allow: true }
  | { allow: false; redirectTo: string };

const PUBLIC_PREFIXES = [
  "/",
  "/checkout",
  "/login",
  "/api/health",
  "/api/webhooks",
  "/_next",
  "/favicon.ico",
];

const ROLE_PREFIX: Record<Role, string> = {
  student: "/student",
  mentor: "/mentor",
  admin: "/admin",
};

function isPublic(pathname: string): boolean {
  if (pathname === "/") return true;
  return PUBLIC_PREFIXES.some(
    (p) => p !== "/" && (pathname === p || pathname.startsWith(p + "/")),
  );
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
  if (!needed) return { allow: true };

  if (!role) return { allow: false, redirectTo: "/login" };
  if (role !== needed) {
    return { allow: false, redirectTo: `${ROLE_PREFIX[role]}/dashboard` };
  }
  return { allow: true };
}
