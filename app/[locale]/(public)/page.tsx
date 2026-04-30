import type { Metadata } from "next";
import HeroSection from "@/components/hero-section";
import { ReservationsSection } from "@/components/reservations-section";
import { FadeInSection } from "@/components/ui/fade-in-section";
import dynamic from "next/dynamic";

const Testimonials = dynamic(() => import("@/components/testimonials"), {
    loading: () => <div className="section-spacing h-96 animate-pulse" />,
});

const FAQsTwo = dynamic(() => import("@/components/faqs-2"), {
    loading: () => <div className="section-spacing h-96 animate-pulse" />,
});

const FooterSection = dynamic(() => import("@/components/footer"));

function getHomeMetadataCopy(locale: string) {
    switch (locale) {
        case "en":
            return {
                title: "Rick Travel | Private Tours in Rio de Janeiro",
                description: "Book guided tours in Rio de Janeiro with a licensed team, fast WhatsApp support and a safer booking flow.",
            };
        case "es":
            return {
                title: "Rick Travel | Tours privados en Rio de Janeiro",
                description: "Reserva tours guiados en Rio de Janeiro con equipo acreditado, soporte rapido por WhatsApp y flujo de reserva mas seguro.",
            };
        case "sv":
            return {
                title: "Rick Travel | Privata turer i Rio de Janeiro",
                description: "Boka guidade turer i Rio de Janeiro med certifierat team, snabb WhatsApp-support och tryggare bokningsflode.",
            };
        default:
            return {
                title: "Rick Travel | Passeios exclusivos no Rio de Janeiro",
                description: "Reserve passeios guiados no Rio com equipe credenciada, suporte rapido no WhatsApp e fluxo de reserva mais seguro.",
            };
    }
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const copy = getHomeMetadataCopy(locale);
    const path = `/${locale}`;

    return {
        title: copy.title,
        description: copy.description,
        alternates: {
            canonical: path,
        },
        openGraph: {
            title: copy.title,
            description: copy.description,
            url: path,
        },
        twitter: {
            title: copy.title,
            description: copy.description,
        },
    };
}

export default function Home() {
    return (
        <>
            <HeroSection />

            <div
                className="relative overflow-hidden bg-[#071826] text-white"
                style={{
                    backgroundImage:
                        "radial-gradient(1200px 560px at 50% 0%, rgba(255,255,255,0.07), transparent 58%), linear-gradient(180deg, #081b2a 0%, #071826 32%, #0a1f30 100%)",
                }}
            >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[linear-gradient(180deg,rgba(200,168,107,0.08),transparent)]" />
                <div className="pointer-events-none absolute inset-x-0 top-[30rem] h-px bg-white/8" />

                <ReservationsSection />

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
