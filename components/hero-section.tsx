'use client'

import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { HeroSearch } from "@/components/hero-search";
import {
  ChevronRight,
  ShieldCheck,
  Star,
  MapPin,
  MessageCircleMore,
  Clock3,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { buildWhatsAppQuoteUrl } from "@/lib/whatsapp";

function getHeroSupportCopy(locale: string) {
  switch (locale) {
    case "en":
      return {
        responseTime: "WhatsApp support replies within minutes",
        quoteNote: "Build your itinerary with our team",
        trustBadges: [
          "500+ curated experiences delivered",
          "4.9 average guest rating",
          "Licensed guides and secure operation",
        ],
        highlights: [
          { value: "24/7", label: "concierge support" },
          { value: "100%", label: "private planning" },
          { value: "Rio", label: "local specialists" },
        ],
      };
    case "es":
      return {
        responseTime: "Atencion por WhatsApp en pocos minutos",
        quoteNote: "Arma tu itinerario con ayuda de nuestro equipo",
        trustBadges: [
          "500+ tours realizados",
          "4,9 de valoracion media",
          "Guias acreditados y operacion segura",
        ],
        highlights: [
          { value: "24/7", label: "soporte directo" },
          { value: "100%", label: "ruta privada" },
          { value: "Rio", label: "equipo local" },
        ],
      };
    case "sv":
      return {
        responseTime: "WhatsApp-svar inom nagra minuter",
        quoteNote: "Bygg din resplan tillsammans med vart team",
        trustBadges: [
          "500+ genomforda turer",
          "4,9 i genomsnittligt betyg",
          "Certifierade guider och trygg drift",
        ],
        highlights: [
          { value: "24/7", label: "direkt support" },
          { value: "100%", label: "privat planering" },
          { value: "Rio", label: "lokala experter" },
        ],
      };
    default:
      return {
        responseTime: "Atendimento no WhatsApp em poucos minutos",
        quoteNote: "Monte seu roteiro com ajuda da nossa equipe",
        trustBadges: [
          "500+ tours realizados",
          "4,9 de avaliacao media",
          "Guias credenciados e operacao segura",
        ],
        highlights: [
          { value: "24/7", label: "suporte humano" },
          { value: "100%", label: "roteiro privado" },
          { value: "Rio", label: "time local" },
        ],
      };
  }
}

function TrustBar({ badges }: { badges: string[] }) {
  const items = [
    { icon: <MapPin className="h-3.5 w-3.5" />, text: badges[0] },
    { icon: <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />, text: badges[1] },
    { icon: <ShieldCheck className="h-3.5 w-3.5" />, text: badges[2] },
  ];

  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
      {items.map((badge) => (
        <span key={badge.text} className="chip-dark min-h-9 px-3.5 text-[12px]">
          {badge.icon}
          {badge.text}
        </span>
      ))}
    </div>
  );
}

function HeroContent() {
  const t = useTranslations("HomePage.Hero");
  const locale = useLocale();
  const supportCopy = getHeroSupportCopy(locale);
  const whatsappUrl = buildWhatsAppQuoteUrl({
    locale,
    source: "home",
    city: "Rio de Janeiro",
  });

  return (
    <div className="relative mx-auto flex max-w-7xl flex-col px-5 lg:px-12">
      <div className="mx-auto max-w-5xl text-center">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.05] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#d8c18f] backdrop-blur-md">
          <ShieldCheck className="h-3.5 w-3.5" />
          Guia credenciado e operação local
        </div>

        <h1 className="mx-auto mt-7 max-w-[15ch] text-balance text-4xl font-semibold leading-[0.98] tracking-[-0.045em] text-white md:text-6xl lg:text-[5rem]">
          {t("title")}
        </h1>

        <p className="mx-auto mt-6 max-w-3xl text-balance text-[15px] leading-7 text-white/72 md:text-lg md:leading-8">
          {t("description")}
        </p>

        <div className="mt-8">
          <HeroSearch />
        </div>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="h-12 w-full rounded-2xl px-6 text-[15px] font-semibold text-white shadow-[0_18px_40px_rgba(18,58,40,0.32)] transition-all duration-200 hover:-translate-y-px active:translate-y-0 sm:min-w-[230px] sm:w-auto"
            style={{
              background: "linear-gradient(135deg, #123A28 0%, #184731 100%)",
              border: "1px solid rgba(56, 122, 91, 0.4)",
            }}
          >
            <Link href="/tours">
              <span>{t("primaryButton")}</span>
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="ghost"
            className="h-11 w-full rounded-2xl border border-white/14 bg-white/[0.05] px-6 text-[15px] font-semibold text-white/90 backdrop-blur-md transition-all duration-200 hover:-translate-y-px hover:bg-white/[0.09] hover:text-white active:translate-y-0 sm:h-12 sm:min-w-[230px] sm:w-auto"
          >
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <span>{t("secondaryButton")}</span>
              <ChevronRight className="ml-1 h-4 w-4 opacity-70" />
            </a>
          </Button>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-xs font-medium text-white/70 md:text-sm">
          <span className="inline-flex items-center gap-2">
            <Clock3 className="h-4 w-4 text-[#C8A86B]" />
            {supportCopy.responseTime}
          </span>
          <span className="hidden h-1 w-1 rounded-full bg-white/30 sm:inline-flex" />
          <span className="inline-flex items-center gap-2">
            <MessageCircleMore className="h-4 w-4 text-[#C8A86B]" />
            {supportCopy.quoteNote}
          </span>
        </div>

        <TrustBar badges={supportCopy.trustBadges} />

        <div className="mx-auto mt-10 grid max-w-4xl gap-3 sm:grid-cols-3">
          {supportCopy.highlights.map((item) => (
            <div
              key={item.label}
              className="rounded-[22px] border border-white/10 bg-white/[0.06] px-5 py-4 text-left shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur-md"
            >
              <div className="text-xl font-semibold text-white">{item.value}</div>
              <div className="mt-1 text-sm leading-6 text-white/66">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HeroMedia() {
  return (
    <div className="absolute inset-1 -z-10 aspect-[2/3] overflow-hidden rounded-[2rem] border border-white/6 lg:aspect-video lg:rounded-[3rem]">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover brightness-[0.62] saturate-[0.9]"
        src="/videos/newhero.mp4"
        poster="/videos/imagem-rio-perfil.jpg"
        preload="auto"
      />

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,14,24,0.08),rgba(4,14,24,0.22)_32%,rgba(4,14,24,0.82)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(900px_360px_at_50%_0%,rgba(255,255,255,0.08),transparent_68%)]" />
      <div className="absolute inset-x-8 bottom-8 hidden rounded-[26px] border border-white/10 bg-[#0a1d2b]/56 px-6 py-5 text-white/78 backdrop-blur-xl lg:block">
        <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#C8A86B]">Rio de Janeiro curated travel</div>
        <div className="mt-2 max-w-xl text-sm leading-6">
          Private tours, local guidance and flexible planning for travelers who want a cleaner booking flow.
        </div>
      </div>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="overflow-x-hidden bg-[#071826]">
      <div className="relative py-24 md:pb-32 lg:pb-36 lg:pt-56">
        <HeroContent />
        <HeroMedia />
      </div>
    </section>
  );
}
