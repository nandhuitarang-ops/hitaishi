import { SiteHeader } from "@/components/sections/site-header";
import { SiteFooter } from "@/components/sections/site-footer";
import { MentorHeroSection } from "@/components/sections/mentor/mentor-hero-section";
import { MentorRoleSection } from "@/components/sections/mentor/mentor-role-section";
import { WhyMentorSection } from "@/components/sections/mentor/why-mentor-section";
import { WhoCanMentorSection } from "@/components/sections/mentor/who-can-mentor-section";
import { TestimonialsSection } from "@/components/sections/mentor/testimonials-section";
import { MentorCtaSection } from "@/components/sections/mentor/mentor-cta-section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Become a Mentor — Hitaishi",
  description:
    "Guide JEE aspirants as a mentor on Hitaishi. Share your strategies, help students succeed, and earn on your own schedule. Open to IITians, top rankers, and NIT/IIIT students.",
  openGraph: {
    title: "Become a Mentor — Hitaishi",
    description:
      "Guide JEE aspirants as a mentor on Hitaishi. Share your strategies, help students succeed, and earn on your own schedule.",
    type: "website",
    locale: "en_IN",
  },
};

export default function BecomeMentorPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <MentorHeroSection />
        <MentorRoleSection />
        <WhyMentorSection />
        <WhoCanMentorSection />
        <TestimonialsSection />
        <MentorCtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
