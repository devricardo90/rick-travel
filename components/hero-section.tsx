'use client'
import React from 'react'
import Image from 'next/image'
import { Link } from '@/i18n/routing'
import { Button } from '@/components/ui/button'
import { HeroHeader } from '@/components/header'
import { HeroSearch } from '@/components/hero-search'
import { InfiniteSlider } from '@/components/ui/infinite-slider'
import { ProgressiveBlur } from '@/components/ui/progressive-blur'
import { ChevronRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import {
  EntretenimentosIcon,
  VisitacoesIcon,
  AtividadesEsportivasIcon,
  ToursGuiadosIcon,
  TurismoUrbanoIcon,
} from '@/components/logos/tourism-services'

const HERO_IMAGE = {
  src: '/videos/imagem-praia-ipanema.jpg',
  alt: 'Praia de Ipanema',
} as const

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
   HERO CONTENT
=========================== */

function HeroContent() {
  const t = useTranslations('HomePage.Hero')

  return (
    <div className="relative mx-auto flex max-w-7xl flex-col px-6 lg:px-12">
      <div className="mx-auto max-w-4xl text-center space-y-8">
        <h1 className="mt-8 heading-1 text-balance lg:mt-16 [text-shadow:_0_2px_12px_rgb(0_0_0_/_40%)] dark:[text-shadow:_0_2px_12px_rgb(0_0_0_/_60%)]">
          {t('title')}
        </h1>

        {/* Hero Search Bar */}
        <div className="py-4">
          <HeroSearch />
        </div>

        <p className="mx-auto max-w-2xl body-lg text-balance text-muted-foreground">
          {t('description')}
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild size="lg" className="h-12 min-w-[200px] rounded-full pl-5 pr-3 text-base shadow-lg btn-hover-lift">
            <Link href="#reservas">
              <span>{t('primaryButton')}</span>
              <ChevronRight className="ml-1" />
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-12 min-w-[200px] rounded-full pl-5 pr-3 text-base border-2 shadow-lg btn-hover-lift"
          >
            <Link href="/contato">
              <span>{t('secondaryButton')}</span>
              <ChevronRight className="ml-1" />
            </Link>
          </Button>
        </div>
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
      <Image
        className="size-full object-cover opacity-50 dark:opacity-35 lg:dark:opacity-75"
        src={HERO_IMAGE.src}
        alt={HERO_IMAGE.alt}
        fill
        priority
        sizes="100vw"
        quality={75}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwABmQAAA//9k="
        loading="eager"
      />
      {/* Gradient overlay for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/30 to-background/80" />
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
