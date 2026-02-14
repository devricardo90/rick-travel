import HeroSection from "@/components/hero-section";
import { ReservationsSection } from "@/components/reservations-section";
import dynamic from 'next/dynamic';

const Features = dynamic(() => import('@/components/features-1'));
const IntegrationsSection = dynamic(() => import('@/components/integrations-1'));
const Testimonials = dynamic(() => import('@/components/testimonials'));
const FAQsTwo = dynamic(() => import('@/components/faqs-2'));
const FooterSection = dynamic(() => import('@/components/footer'));

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
