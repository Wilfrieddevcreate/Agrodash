import type { Metadata } from "next";
import { PricingPageClient } from "@/components/marketing/pricing-page-client";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple, transparent pricing for AgroDash. Start free, scale when you're ready, cancel anytime.",
};

export default function PricingPage() {
  return <PricingPageClient />;
}
