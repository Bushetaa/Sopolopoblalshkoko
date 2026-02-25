import Header from "@/components/client/landing/Header";
import HeroSection from "@/components/client/landing/HeroSection";
import ProblemSection from "@/components/client/landing/ProblemSection";
import SolutionSection from "@/components/client/landing/SolutionSection";
import WhySopoSection from "@/components/client/landing/WhySopoSection";
import HowItWorksSection from "@/components/client/landing/HowItWorksSection";
import FeaturesRichSection from "@/components/client/landing/FeaturesRichSection";
import UseCasesSection from "@/components/client/landing/UseCasesSection";
import ArchitectureSection from "@/components/client/landing/ArchitectureSection";
import GettingStartedSection from "@/components/client/landing/GettingStartedSection";
import BackgroundBand from "@/components/client/landing/BackgroundBand";
import CTASection from "@/components/client/landing/CTASection";
import Footer from "@/components/server/landing/Footer";

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <WhySopoSection />
      <HowItWorksSection />
      <FeaturesRichSection />
      <UseCasesSection />
      <BackgroundBand />
      <ArchitectureSection />
      <GettingStartedSection />
      <CTASection />
      <Footer />
    </div>
  );
}
