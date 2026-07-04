import { SiteHeader } from "@/components/sections/site-header";
import { SiteFooter } from "@/components/sections/site-footer";
import { HeroSection } from "@/components/sections/hero-section";
import { ProblemSection } from "@/components/sections/problem-section";
import { AudienceCardsSection } from "@/components/sections/audience-cards-section";
import { PricingTeaserSection } from "@/components/sections/pricing-teaser-section";
import { FaqSection } from "@/components/sections/faq-section";
import { ClosingCtaSection } from "@/components/sections/closing-cta-section";
import { PullQuote } from "@/components/sections/pull-quote";
import { HERO } from "@/lib/content/hero";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <HeroSection />
        <PullQuote text={HERO.pullQuote} />
        <ProblemSection />
        <AudienceCardsSection />
        <PricingTeaserSection />
        <FaqSection />
        <ClosingCtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
