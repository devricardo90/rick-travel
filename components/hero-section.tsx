import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { HeroHeader } from '@/components/header'
import { InfiniteSlider } from '@/components/ui/infinite-slider'
import { ProgressiveBlur } from '@/components/ui/progressive-blur'
import { ChevronRight } from 'lucide-react'
import {
    EntretenimentosIcon,
    VisitacoesIcon,
    AtividadesEsportivasIcon,
    ToursGuiadosIcon,
    TurismoUrbanoIcon,
} from '@/components/logos/tourism-services'

// Constantes de configuração
const HERO_CONTENT = {
    title: 'City Tour no Rio de Janeiro com Guia Credenciado',
    description: 'Descubra as maravilhas do Rio de Janeiro em passeios exclusivos, guiados por especialistas credenciados. Segurança e experiências personalizadas para brasileiros e estrangeiros.',
    primaryButton: {
        text: 'Reserve agora seu passeio exclusivo',
        href: '#reservas',
    },
    secondaryButton: {
        text: 'Solicitar orçamento',
        href: '#contato',
    },
} as const

const VIDEO_CONFIG = {
    src: '/videos/rio-de-janeiro-hero.mp4',
    autoPlay: true,
    loop: true,
    muted: true,
} as const

const LOGOS_SECTION = {
    title: 'Nossos serviços',
    logos: [
        {
            component: EntretenimentosIcon,
            alt: 'Entretenimentos',
            height: 36,
        },
        {
            component: VisitacoesIcon,
            alt: 'Visitações',
            height: 36,
        },
        {
            component: AtividadesEsportivasIcon,
            alt: 'Atividades Esportivas',
            height: 36,
        },
        {
            component: ToursGuiadosIcon,
            alt: 'Tours Guiados',
            height: 36,
        },
        {
            component: TurismoUrbanoIcon,
            alt: 'Turismo Urbano',
            height: 36,
        },
    ],
    sliderConfig: {
        speed: 40,
        speedOnHover: 20,
        gap: 112,
    },
} as const

// Componente para o conteúdo principal do hero
function HeroContent() {
    return (
        <div className="relative mx-auto flex max-w-7xl flex-col px-6 lg:block lg:px-12">
            <div className="mx-auto max-w-lg text-center lg:ml-0 lg:max-w-full lg:text-left">
                <h1 className="font-inter mt-8 max-w-2xl text-balance text-5xl md:text-6xl lg:mt-16 xl:text-7xl font-bold tracking-tight">
                    {HERO_CONTENT.title}
                </h1>
                
                <p className="font-inter mt-8 max-w-2xl text-balance text-lg text-muted-foreground leading-relaxed">
                    {HERO_CONTENT.description}
                </p>

                <div className="mt-12 flex flex-col items-center justify-center gap-2 sm:flex-row lg:justify-start">
                    <Button
                        asChild
                        size="lg"
                        className="h-12 rounded-full pl-5 pr-3 text-base"
                    >
                        <Link href={HERO_CONTENT.primaryButton.href}>
                            <span className="text-nowrap">
                                {HERO_CONTENT.primaryButton.text}
                            </span>
                            <ChevronRight className="ml-1" />
                        </Link>
                    </Button>
                    
                    <Button
                        asChild
                        size="lg"
                        variant="ghost"
                        className="h-12 rounded-full px-5 text-base hover:bg-zinc-950/5 dark:hover:bg-white/5"
                    >
                        <Link href={HERO_CONTENT.secondaryButton.href}>
                            <span className="text-nowrap">
                                {HERO_CONTENT.secondaryButton.text}
                            </span>
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}

// Componente para o vídeo de fundo
function HeroVideo() {
    return (
        <div className="absolute inset-1 -z-10 overflow-hidden rounded-3xl border border-black/10 aspect-[2/3] lg:aspect-video lg:rounded-[3rem] dark:border-white/5">
            <video
                autoPlay={VIDEO_CONFIG.autoPlay}
                loop={VIDEO_CONFIG.loop}
                muted={VIDEO_CONFIG.muted}
                playsInline
                className="size-full object-cover opacity-50 invert dark:opacity-35 dark:invert-0 dark:lg:opacity-75"
                src={VIDEO_CONFIG.src}
                aria-label="Vídeo de fundo do Rio de Janeiro"
            />
        </div>
    )
}

// Componente para logo individual
interface LogoItemProps {
    component?: React.ComponentType<{ height?: number; className?: string }>
    src?: string
    alt: string
    height: number
}

function LogoItem({ component: IconComponent, src, alt, height }: LogoItemProps) {
    return (
        <div className="flex items-center justify-center" style={{ height: `${height}px` }}>
            {IconComponent ? (
                <IconComponent
                    height={height}
                    className="mx-auto w-auto text-white dark:text-white drop-shadow-lg"
                />
            ) : src ? (
                <img
                    src={src}
                    alt={alt}
                    height={height}
                    width="auto"
                    className="mx-auto h-auto w-fit dark:invert"
                    loading="lazy"
                    decoding="async"
                />
            ) : null}
        </div>
    )
}

// Componente para a seção de logos
function LogosSection() {
    return (
        <section className="bg-background pb-2">
            <div className="group relative m-auto max-w-7xl px-6">
                <div className="flex flex-col items-center md:flex-row">
                    <div className="md:max-w-44 md:border-r md:pr-6">
                        <p className="text-end text-sm">
                            {LOGOS_SECTION.title}
                        </p>
                    </div>
                    
                    <div className="relative py-6 md:w-[calc(100%-11rem)]">
                        <InfiniteSlider
                            speedOnHover={LOGOS_SECTION.sliderConfig.speedOnHover}
                            speed={LOGOS_SECTION.sliderConfig.speed}
                            gap={LOGOS_SECTION.sliderConfig.gap}
                        >
                            {LOGOS_SECTION.logos.map((logo, index) => (
                                <LogoItem
                                    key={`${logo.alt}-${index}`}
                                    component={logo.component}
                                    alt={logo.alt}
                                    height={logo.height}
                                />
                            ))}
                        </InfiniteSlider>

                        {/* Gradientes laterais para efeito de fade */}
                        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent" />
                        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent" />
                        
                        {/* Efeitos de blur progressivo */}
                        <ProgressiveBlur
                            className="pointer-events-none absolute left-0 top-0 h-full w-20"
                            direction="left"
                            blurIntensity={1}
                        />
                        <ProgressiveBlur
                            className="pointer-events-none absolute right-0 top-0 h-full w-20"
                            direction="right"
                            blurIntensity={1}
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}

// Componente principal
export default function HeroSection() {
    return (
        <>
            <HeroHeader />
            <main className="overflow-x-hidden">
                <section>
                    <div className="relative py-24 md:pb-32 lg:pb-36 lg:pt-72">
                        <HeroContent />
                        <HeroVideo />
                    </div>
                </section>
                <LogosSection />
            </main>
        </>
    )
}
