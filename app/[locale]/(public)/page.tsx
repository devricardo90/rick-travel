import HeroSection from "@/components/hero-section";
import { ReservationsSection } from "@/components/reservations-section";
import { FadeInSection } from "@/components/ui/fade-in-section";
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

            <FadeInSection>
                <ReservationsSection />
            </FadeInSection>

            <FadeInSection delay={0.1}>
                <Features />
            </FadeInSection>

            <FadeInSection delay={0.1}>
                <IntegrationsSection />
            </FadeInSection>

            <FadeInSection delay={0.1}>
                <Testimonials />
            </FadeInSection>

            <FadeInSection delay={0.1}>
                <FAQsTwo />
            </FadeInSection>

            <FadeInSection delay={0.1}>
                <FooterSection />
            </FadeInSection>
        </div>
    );
}
