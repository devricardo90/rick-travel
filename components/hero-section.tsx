'use client'
import React from 'react'
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeroSearch } from "@/components/hero-search";
import { HeroHeader } from '@/components/header'
import { ChevronRight, ShieldCheck, Star, MapPin } from 'lucide-react'
import { useTranslations } from 'next-intl'


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
    <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
      {badges.map((badge, i) => (
        <span key={i} className="inline-flex h-8 items-center gap-2 rounded-full px-3 py-1.5 text-[12px] font-semibold bg-[#071826]/75 text-white/85 border border-[#C8A86B]/18 backdrop-blur-sm">
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
    <div className="relative mx-auto flex max-w-7xl flex-col px-5 lg:px-12">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="mx-auto max-w-[18ch] text-balance text-white text-3xl font-bold tracking-[-0.02em] leading-[1.05] md:text-5xl lg:text-6xl xl:text-7xl">
          {t('title')}
        </h1>

        {/* Hero Search Bar */}
        <div className="mt-5">
          <HeroSearch />
        </div>

        <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="h-12 w-full sm:w-auto sm:min-w-[210px] rounded-2xl px-6 text-[15px] font-semibold text-white shadow-xl transition-all duration-200 hover:-translate-y-px active:translate-y-0" style={{ background: 'linear-gradient(135deg, #0B2E1E 0%, #0F3B27 100%)', border: '1px solid rgba(26,77,46,0.5)' }}>
            <Link href="/tours">
              <span>{t('primaryButton')}</span>
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="ghost"
            className="h-11 w-full sm:w-auto sm:h-12 sm:min-w-[210px] rounded-2xl border border-white/15 bg-white/5 text-white/90 hover:bg-white/10 hover:text-white px-6 text-[15px] font-semibold backdrop-blur-md transition-all duration-200 hover:-translate-y-px active:translate-y-0"
          >
            <a href="https://wa.me/5521971168114?text=Olá! Gostaria de solicitar um orçamento para um passeio no Rio." target="_blank" rel="noopener noreferrer">
              <span>{t('secondaryButton')}</span>
              <ChevronRight className="ml-1 h-4 w-4 opacity-70" />
            </a>
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
      </main>
    </>
  )
}
