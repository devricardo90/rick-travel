import FAQsTwo from "@/components/faqs-2";
import Features from "@/components/features-1";
import FooterSection from "@/components/footer";
import HeroSection from "@/components/hero-section";
import IntegrationsSection from "@/components/integrations-1";
import Testimonials from "@/components/testimonials";
import { ReservationsSection } from "@/components/reservations-section";


export default function Home() {
  return (
    <div>
      <HeroSection />
      <ReservationsSection />
      <Features />
      <IntegrationsSection />
      <Testimonials />
      <FAQsTwo />
      <FooterSection />
    </div>
  );
}

