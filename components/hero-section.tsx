'use client'
import React from 'react'
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeroSearch } from "@/components/hero-search";
import { HeroHeader } from '@/components/header'
import { InfiniteSlider } from '@/components/ui/infinite-slider'
import { ProgressiveBlur } from '@/components/ui/progressive-blur'
import { ChevronRight, ShieldCheck, Star, MapPin } from 'lucide-react'
import { useTranslations } from 'next-intl'
import {
  EntretenimentosIcon,
  VisitacoesIcon,
  AtividadesEsportivasIcon,
  ToursGuiadosIcon,
  TurismoUrbanoIcon,
} from '@/components/logos/tourism-services'



const LOGOS_LIST = [
  { component: EntretenimentosIcon, alt: 'Entretenimentos', height: 36 },
  { component: VisitacoesIcon, alt: 'Visitações', height: 36 },
  { component: AtividadesEsportivasIcon, alt: 'Atividades Esportivas', height: 36 },
  { component: ToursGuiadosIcon, alt: 'Tours Guiados', height: 36 },
  { component: TurismoUrbanoIcon, alt: 'Turismo Urbano', height: 36 },
]

const SLIDER_CONFIG = {
  speed: 25,
  speedOnHover: 0,
  gap: 96,
}

/* ===========================
   TRUST BAR
=========================== */

function TrustBar() {
  const t = useTranslations('HomePage.Hero')
  const badges = [
    { icon: <MapPin className="h-3.5 w-3.5" />, text: '500+ tours realizados' },
    { icon: <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />, text: '★ 4,9 (143 avaliações)' },
    { icon: <ShieldCheck className="h-3.5 w-3.5" />, text: 'Viagens seguras' },
  ]

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
      {badges.map((badge, i) => (
        <span key={i} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium bg-black/25 text-white/75 border border-white/10 backdrop-blur-sm">
          {badge.icon}
          {badge.text}
        </span>
      ))}
    </div>
  )
}

/* ===========================
   HERO CONTENT
=========================== */

function HeroContent() {
  const t = useTranslations('HomePage.Hero')

  return (
    <div className="relative mx-auto flex max-w-7xl flex-col px-6 lg:px-12">
      <div className="mx-auto max-w-4xl text-center space-y-8">
        <h1 className="mt-8 text-balance lg:mt-16 text-white text-3xl font-bold tracking-[-0.02em] leading-[1.1] md:text-5xl lg:text-6xl xl:text-7xl">
          {t('title')}
        </h1>

        {/* Hero Search Bar */}
        <div className="py-4">
          <HeroSearch />
        </div>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild size="lg" className="h-12 min-w-[210px] rounded-2xl bg-brazil-green-600 hover:bg-brazil-green-700 px-6 text-base font-semibold shadow-xl transition-all duration-200 hover:-translate-y-px active:translate-y-0">
            <Link href="#reservas">
              <span>{t('primaryButton')}</span>
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="ghost"
            className="h-12 min-w-[210px] rounded-2xl border border-white/15 bg-white/5 text-white/90 hover:bg-white/10 hover:text-white px-6 text-base font-semibold backdrop-blur-md transition-all duration-200 hover:-translate-y-px active:translate-y-0"
          >
            <Link href="/contato">
              <span>{t('secondaryButton')}</span>
              <ChevronRight className="ml-1 h-4 w-4 opacity-70" />
            </Link>
          </Button>
        </div>

        {/* Trust Bar */}
        <TrustBar />
      </div>
    </div>
  )
}


/* ===========================
   HERO MEDIA (IMAGE REPLACEMENT)
=========================== */

function HeroMedia() {
  return (
    <div className="absolute inset-1 -z-10 overflow-hidden rounded-3xl border border-black/10 aspect-[2/3] lg:aspect-video lg:rounded-[3rem] dark:border-white/5">
      {/* Vídeo cinematográfico */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover brightness-75"
        src="/videos/video-site-hero.mp4"
        preload="auto"
      />

      {/* Overlay cinematográfico com gradiente do design system */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80" />

      {/* Highlight radial no topo para "depth" */}
      <div className="absolute inset-0 bg-[radial-gradient(1000px_400px_at_50%_0%,rgba(255,255,255,0.08),transparent_70%)]" />

      {/* Vinheta lateral sutil */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(0,0,0,0.4)_100%)]" />
    </div>
  )
}

/* ===========================
   LOGO ITEM
=========================== */

interface LogoItemProps {
  component: React.ComponentType<{ height?: number; className?: string }>
  alt: string
  height: number
}

function LogoItem({ component: IconComponent, alt, height }: LogoItemProps) {
  return (
    <div
      className="group relative flex items-center justify-center transition-transform duration-300 hover:-translate-y-1"
      style={{ height }}
    >
      <IconComponent
        height={height}
        className="opacity-70 transition-all duration-300 group-hover:opacity-100 group-hover:drop-shadow-[0_4px_12px_rgba(0,0,0,0.25)]"
      />

      {/* Tooltip - fixed position to avoid layout shift */}
      <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-muted-foreground opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        {alt}
      </span>
    </div>
  )
}

/* ===========================
   LOGOS SECTION
=========================== */

function LogosSection() {
  const t = useTranslations('HomePage.Logos')

  return (
    <section className="bg-background pb-4">
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center gap-6 md:flex-row">
          <div className="md:max-w-48 md:border-r md:pr-6">
            <p className="text-center text-sm font-medium text-muted-foreground md:text-right">
              {t('title')}
            </p>
          </div>

          <div className="relative w-full overflow-hidden py-6">
            <InfiniteSlider
              speed={SLIDER_CONFIG.speed}
              speedOnHover={SLIDER_CONFIG.speedOnHover}
              gap={SLIDER_CONFIG.gap}
            >
              {LOGOS_LIST.map((logo, index) => (
                <LogoItem
                  key={`${logo.alt}-${index}`}
                  component={logo.component}
                  alt={logo.alt}
                  height={logo.height}
                />
              ))}
            </InfiniteSlider>

            {/* Fade lateral */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />

            {/* Blur progressivo */}
            <ProgressiveBlur className="pointer-events-none absolute left-0 top-0 h-full w-24" direction="left" />
            <ProgressiveBlur className="pointer-events-none absolute right-0 top-0 h-full w-24" direction="right" />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ===========================
   PAGE
=========================== */

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
        <LogosSection />
      </main>
    </>
  )
}
