import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Onboarding — Hitaishi Mentor",
  robots: "noindex, nofollow",
};

export default function MentorOnboardingPage() {
  redirect("/mentor-onboarding");
}
