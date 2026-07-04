import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard — Hitaishi Mentor",
  robots: "noindex, nofollow",
};

export default function MentorRootPage() {
  redirect("/become-a-mentor");
}
