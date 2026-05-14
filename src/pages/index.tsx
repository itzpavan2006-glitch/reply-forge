import PageShell from "@/components/layouts/pageshell";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/Howitworks";
import Testimonials from "@/components/landing/testimonials";
import PricingPreview from "@/components/landing/Pricingpreview";
import FinalCTA from "@/components/landing/FinalCTA";

export default function Index() {
  return (
    <PageShell>
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <PricingPreview />
      <FinalCTA />
    </PageShell>
  );
}
