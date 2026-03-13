import HeroSection from "@/components/hero-section";
import { ReservationsSection } from "@/components/reservations-section";
import { FadeInSection } from "@/components/ui/fade-in-section";
import dynamic from 'next/dynamic';

// Code Splitting: Lazy load below-the-fold components
const Testimonials = dynamic(() => import('@/components/testimonials'), {
    loading: () => <div className="section-spacing h-96 animate-pulse" />,
});

const FAQsTwo = dynamic(() => import('@/components/faqs-2'), {
    loading: () => <div className="section-spacing h-96 animate-pulse" />,
});

const FooterSection = dynamic(() => import('@/components/footer'));

export default function Home() {
    return (
        <>
            <HeroSection />

            {/* ── Wrapper premium dark (igual ao Quem Somos e Tours) ── */}
            <div
                className="relative bg-[#071A2B] text-white"
                style={{
                    backgroundImage:
                        'radial-gradient(1200px 600px at 50% 0%, rgba(255,255,255,0.07), transparent 55%)',
                }}
            >
                {/* Above-the-fold - sem FadeIn para melhor TBT */}
                <ReservationsSection />

                {/* Below-the-fold - lazy load com FadeIn */}
                <FadeInSection delay={0.2}>
                    <Testimonials />
                </FadeInSection>

                <FadeInSection delay={0.2}>
                    <FAQsTwo />
                </FadeInSection>

                <FooterSection />
            </div>
        </>
    );
}
