'use client'
import React from 'react'
import { Link } from '@/i18n/routing'
import { Button } from '@/components/ui/button'
import { HeroHeader } from '@/components/header'
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
    <div className="relative mx-auto flex max-w-7xl flex-col px-6 lg:block lg:px-12">
      <div className="mx-auto max-w-lg text-center lg:ml-0 lg:max-w-full lg:text-left">
        <h1 className="mt-8 max-w-2xl text-balance text-5xl font-bold tracking-tight md:text-6xl lg:mt-16 xl:text-7xl">
          {t('title')}
        </h1>

        <p className="mt-8 max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground">
          {t('description')}
        </p>

        <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
          <Button asChild size="lg" className="h-12 rounded-full pl-5 pr-3 text-base">
            <Link href="#reservas">
              <span>{t('primaryButton')}</span>
              <ChevronRight className="ml-1" />
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="ghost"
            className="h-12 rounded-full px-5 text-base hover:bg-zinc-950/5 dark:hover:bg-white/5"
          >
            <Link href="/contato">
              {t('secondaryButton')}
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
      <img
        className="size-full object-cover opacity-50 dark:opacity-35 lg:dark:opacity-75"
        src={HERO_IMAGE.src}
        alt={HERO_IMAGE.alt}
      />
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

      {/* Tooltip */}
      <span className="pointer-events-none absolute -bottom-6 text-xs text-muted-foreground opacity-0 transition-opacity duration-200 group-hover:opacity-100">
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
