import { describe, it, expect } from "vitest";
import { resolveRouteAccess, type Role } from "./rbac";

describe("resolveRouteAccess", () => {
  it("public routes are open to anyone (no session)", () => {
    expect(resolveRouteAccess("/", null).allow).toBe(true);
    expect(resolveRouteAccess("/api/health", null).allow).toBe(true);
    expect(resolveRouteAccess("/api/webhooks/razorpay", null).allow).toBe(true);
  });

  it("student route requires student role", () => {
    const anon = resolveRouteAccess("/student/dashboard", null);
    expect(anon).toEqual({ allow: false, redirectTo: "/login" });
    expect(resolveRouteAccess("/student/dashboard", "student").allow).toBe(true);
    const mentor = resolveRouteAccess("/student/dashboard", "mentor");
    expect(mentor).toEqual({ allow: false, redirectTo: "/mentor/dashboard" });
  });

  it("mentor route requires mentor role", () => {
    expect(resolveRouteAccess("/mentor/students", "student").allow).toBe(false);
    expect(resolveRouteAccess("/mentor/students", "mentor").allow).toBe(true);
  });

  it("admin route requires admin role", () => {
    expect(resolveRouteAccess("/admin/dashboard", "student").allow).toBe(false);
    expect(resolveRouteAccess("/admin/dashboard", "mentor").allow).toBe(false);
    expect(resolveRouteAccess("/admin/dashboard", "admin").allow).toBe(true);
  });

  it("admin can NOT cross into student/mentor portals (one user, one role)", () => {
    expect(resolveRouteAccess("/student/dashboard", "admin").allow).toBe(false);
    expect(resolveRouteAccess("/mentor/dashboard", "admin").allow).toBe(false);
  });

  it("only known webhook providers are public", () => {
    expect(resolveRouteAccess("/api/webhooks/razorpay", null).allow).toBe(true);
    expect(resolveRouteAccess("/api/webhooks/msg91", null).allow).toBe(true);
    expect(resolveRouteAccess("/api/webhooks/resend", null).allow).toBe(true);
  });

  it("unknown webhook paths require auth (no implicit prefix opening)", () => {
    expect(resolveRouteAccess("/api/webhooks/unknown", null)).toEqual({
      allow: false,
      redirectTo: "/login",
    });
    expect(resolveRouteAccess("/api/webhooks", null)).toEqual({
      allow: false,
      redirectTo: "/login",
    });
    expect(resolveRouteAccess("/api/webhooks/razorpay/../admin", null).allow).toBe(
      false,
    );
  });

  it("checkout is public (CTA target)", () => {
    expect(resolveRouteAccess("/checkout", null).allow).toBe(true);
  });

  it("authenticated user hitting /login is bounced to their portal", () => {
    const roles: Role[] = ["student", "mentor", "admin"];
    for (const r of roles) {
      expect(resolveRouteAccess("/login", r)).toEqual({
        allow: false,
        redirectTo: `/${r}/dashboard`,
      });
    }
  });
});
