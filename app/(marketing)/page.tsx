import { HeroSection } from "@/components/marketing/hero-section";
import { LogosStrip } from "@/components/marketing/logos-strip";
import { FeaturesSection } from "@/components/marketing/features-section";
import { SplitFeatureSections } from "@/components/marketing/split-feature-sections";
import { TestimonialsSection } from "@/components/marketing/testimonials-section";
import { PricingPreview } from "@/components/marketing/pricing-preview";
import { FaqSection } from "@/components/marketing/faq-section";
import { CtaSection } from "@/components/marketing/cta-section";

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <LogosStrip />
      <FeaturesSection />
      <SplitFeatureSections />
      <TestimonialsSection />
      <PricingPreview />
      <FaqSection />
      <CtaSection />
    </>
  );
}
