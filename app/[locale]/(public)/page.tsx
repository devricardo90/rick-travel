import HeroSection from "@/components/hero-section";
import { ReservationsSection } from "@/components/reservations-section";
import { FadeInSection } from "@/components/ui/fade-in-section";
import dynamic from 'next/dynamic';

// Code Splitting: Lazy load below-the-fold components
const Features = dynamic(() => import('@/components/features-1'), {
    loading: () => <div className="section-spacing h-96 bg-zinc-50 dark:bg-transparent animate-pulse" />,
});

const Testimonials = dynamic(() => import('@/components/testimonials'), {
    loading: () => <div className="section-spacing h-96 animate-pulse" />,
});

const FAQsTwo = dynamic(() => import('@/components/faqs-2'), {
    loading: () => <div className="section-spacing h-96 animate-pulse" />,
});

const FooterSection = dynamic(() => import('@/components/footer'));

export default function Home() {
    return (
        <main className="flex flex-col">
            <HeroSection />

            {/* Above-the-fold - sem FadeIn para melhor TBT */}
            <ReservationsSection />

            {/* Below-the-fold - lazy load com FadeIn */}
            <FadeInSection delay={0.2}>
                <Features />
            </FadeInSection>

            <FadeInSection delay={0.2}>
                <Testimonials />
            </FadeInSection>

            <FadeInSection delay={0.2}>
                <FAQsTwo />
            </FadeInSection>

            <FooterSection />
        </main>
    );
}
