import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard — Hitaishi Admin",
  robots: "noindex, nofollow",
};

export default function AdminRootPage() {
  redirect("/admin/dashboard");
}
