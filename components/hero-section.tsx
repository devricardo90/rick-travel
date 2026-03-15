'use client'

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeroSearch } from "@/components/hero-search";
import { HeroHeader } from "@/components/header";
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
      };
    case "es":
      return {
        responseTime: "Atencion por WhatsApp en pocos minutos",
        quoteNote: "Arma tu itinerario con ayuda de nuestro equipo",
      };
    case "sv":
      return {
        responseTime: "WhatsApp-svar inom nagra minuter",
        quoteNote: "Bygg din resplan tillsammans med vart team",
      };
    default:
      return {
        responseTime: "Atendimento no WhatsApp em poucos minutos",
        quoteNote: "Monte seu roteiro com ajuda da nossa equipe",
      };
  }
}

function TrustBar() {
  const badges = [
    { icon: <MapPin className="h-3.5 w-3.5" />, text: "500+ tours realizados" },
    { icon: <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />, text: "4,9 de avaliacao media" },
    { icon: <ShieldCheck className="h-3.5 w-3.5" />, text: "Guias credenciados e operacao segura" },
  ];

  return (
    <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
      {badges.map((badge) => (
        <span
          key={badge.text}
          className="inline-flex h-8 items-center gap-2 rounded-full border border-[#C8A86B]/18 bg-[#071826]/75 px-3 py-1.5 text-[12px] font-semibold text-white/85 backdrop-blur-sm"
        >
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
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="mx-auto max-w-[18ch] text-balance text-3xl font-bold leading-[1.05] tracking-[-0.02em] text-white md:text-5xl lg:text-6xl xl:text-7xl">
          {t("title")}
        </h1>

        <p className="mx-auto mt-5 max-w-3xl text-balance text-sm leading-7 text-white/72 md:text-lg">
          {t("description")}
        </p>

        <div className="mt-6">
          <HeroSearch />
        </div>

        <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="h-12 w-full rounded-2xl px-6 text-[15px] font-semibold text-white shadow-xl transition-all duration-200 hover:-translate-y-px active:translate-y-0 sm:min-w-[230px] sm:w-auto"
            style={{
              background: "linear-gradient(135deg, #0B2E1E 0%, #0F3B27 100%)",
              border: "1px solid rgba(26,77,46,0.5)",
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
            className="h-11 w-full rounded-2xl border border-white/15 bg-white/5 px-6 text-[15px] font-semibold text-white/90 backdrop-blur-md transition-all duration-200 hover:-translate-y-px hover:bg-white/10 hover:text-white active:translate-y-0 sm:h-12 sm:min-w-[230px] sm:w-auto"
          >
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <span>{t("secondaryButton")}</span>
              <ChevronRight className="ml-1 h-4 w-4 opacity-70" />
            </a>
          </Button>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs font-medium text-white/70 md:text-sm">
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

        <TrustBar />
      </div>
    </div>
  );
}

function HeroMedia() {
  return (
    <div className="absolute inset-1 -z-10 aspect-[2/3] overflow-hidden rounded-3xl border border-black/10 lg:aspect-video lg:rounded-[3rem] dark:border-white/5">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover brightness-75"
        src="/videos/video-site-hero.mp4"
        preload="auto"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80" />
      <div className="absolute inset-0 bg-[radial-gradient(1000px_400px_at_50%_0%,rgba(255,255,255,0.08),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(0,0,0,0.4)_100%)]" />
    </div>
  );
}

export default function HeroSection() {
  return (
    <>
      <HeroHeader />
      <main className="overflow-x-hidden">
        <section>
          <div className="relative py-24 md:pb-32 lg:pb-36 lg:pt-72">
            <HeroContent />
            <HeroMedia />
          </div>
        </section>
      </main>
    </>
  );
}
