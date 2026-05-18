import { NextResponse, type NextRequest } from "next/server";
import { resolveRouteAccess, type Role } from "@/lib/rbac";

const ROLE_COOKIE = "mentoriit_role";

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const cookie = req.cookies.get(ROLE_COOKIE)?.value;
  const role: Role | null =
    cookie === "student" || cookie === "mentor" || cookie === "admin"
      ? cookie
      : null;

  const result = resolveRouteAccess(pathname, role);
  if (result.allow) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = result.redirectTo;
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
