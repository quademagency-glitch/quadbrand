import Hero from "@/components/marketing/Hero";
import FeatureGrid from "@/components/marketing/FeatureGrid";
import HowItWorks from "@/components/marketing/HowItWorks";
import PricingTable from "@/components/marketing/PricingTable";
import CTASection from "@/components/marketing/CTASection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeatureGrid />
      <HowItWorks />
      <PricingTable />
      <CTASection />
    </>
  );
}
