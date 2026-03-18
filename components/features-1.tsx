'use client'

import Image from 'next/image'
import { Check } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Link } from '@/i18n/routing'

interface PackageCardProps {
  title: string
  description: string
  imageSrc: string
  imageAlt: string
  badge: React.ReactNode
  price: string
  priceLabel: string
  benefits: string[]
  href: string
  popular?: boolean
}

function PackageCard({
  title,
  description,
  imageSrc,
  imageAlt,
  badge,
  price,
  priceLabel,
  benefits,
  href,
  popular = false,
}: PackageCardProps) {
  const t = useTranslations('HomePage.Features')

  return (
    <div
      className={`group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-white/8 bg-white/95 shadow-[0_24px_60px_rgba(15,23,42,0.12)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_32px_80px_rgba(15,23,42,0.18)] dark:bg-[#0B2233] dark:hover:border-white/15 dark:hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)] ${popular ? 'z-10 scale-[1.02] ring-2 ring-[#1A7A6E]/60' : ''
        }`}
    >
      {popular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-[#1A4D2E]/60 bg-gradient-to-r from-[#0B2E1E] to-[#0F3B27] px-4 py-1 text-xs font-bold text-white/90 shadow-md">
          Mais popular
        </div>
      )}

      <div className="relative h-56 w-full overflow-hidden">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          quality={75}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute right-3 top-3">
          {badge}
        </div>
      </div>

      <div className="px-6 pb-2 pt-6">
        <div className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-900 dark:border-white/10 dark:bg-white/5 dark:text-white/70">
          Rio signature
        </div>
        <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-[#EAF2F7]">{title}</h3>
        <div className="mt-3 rounded-2xl border border-slate-200/70 bg-slate-50/80 p-3 dark:border-[#1A4D2E]/50 dark:bg-gradient-to-r dark:from-[#0B2E1E] dark:to-[#0F3B27]">
          <span className="text-xs text-muted-foreground dark:text-[#A8B7C6]/70">{priceLabel}</span>
          <p className="text-2xl font-black text-primary dark:text-[#EAF2F7]">{price}</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-6 pb-6">
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground dark:text-[#A8B7C6]">{description}</p>

        <ul className="mt-4 space-y-1.5">
          {benefits.map((benefit, index) => (
            <li key={index} className="flex items-center gap-2 text-sm text-foreground dark:text-[#EAF2F7]/85">
              <Check className="h-4 w-4 shrink-0 text-[#1A7A6E]" />
              {benefit}
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-6">
          <Link
            href={href}
            className={`flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 hover:-translate-y-px ${popular
              ? 'text-white'
              : 'border border-slate-200 bg-slate-50 text-slate-900 hover:bg-slate-100 dark:border-white/15 dark:bg-transparent dark:text-[#EAF2F7] dark:hover:bg-white/8'
              }`}
            style={popular ? { background: 'linear-gradient(135deg, #0B2E1E 0%, #0F3B27 100%)', border: '1px solid rgba(26,77,46,0.5)' } : {}}
          >
            {t('requestQuote')}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function Features() {
  const t = useTranslations('HomePage.Features')

  return (
    <section className="section-spacing-sm">
      <div className="@container mx-auto max-w-5xl px-6">
        <div className="space-y-4 text-center">
          <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C8A86B]">
            Curated packages
          </span>
          <h2 className="text-balance text-3xl font-bold tracking-[-0.02em] text-white md:text-4xl">
            {t('title')}
          </h2>
          <p className="mx-auto max-w-2xl text-white/65">
            {t('subtitle')}
          </p>
        </div>

        <div className="@min-4xl:max-w-full @min-4xl:grid-cols-3 mx-auto mt-8 grid max-w-sm items-start gap-6 md:mt-14">
          <PackageCard
            title={t('package1.title')}
            description={t('package1.description')}
            imageSrc="/images/trips/imagem-casal-pao-de-acucar.jpg"
            imageAlt="Tour Rio de Janeiro Pao de Acucar"
            badge={<span className="badge-success rounded-full px-3 py-1 text-xs font-medium">Disponivel</span>}
            price="R$ 280"
            priceLabel="A partir de"
            benefits={['Guia bilingue incluso', 'Transporte confortavel', 'Fotos panoramicas']}
            href="/contato?pacote=1-dia"
          />

          <PackageCard
            title={t('package2.title')}
            description={t('package2.description')}
            imageSrc="/images/trips/imagem-escadaria-selarao-brasil.jpg"
            imageAlt="Tour Rio de Janeiro Experiencia Completa"
            badge={<span className="badge-info rounded-full px-3 py-1 text-xs font-medium">Mais vendido</span>}
            price="R$ 490"
            priceLabel="A partir de"
            benefits={['2 dias de experiencia', 'Cafe da manha incluso', 'Roteiro personalizado']}
            href="/contato?pacote=2-dias"
            popular
          />

          <PackageCard
            title={t('package3.title')}
            description={t('package3.description')}
            imageSrc="/images/trips/imagem-tour-favela-rocinha.jpg"
            imageAlt="Tour Favela Rocinha e Arte Urbana"
            badge={<span className="badge-warning rounded-full px-3 py-1 text-xs font-medium">Vagas limitadas</span>}
            price="R$ 750"
            priceLabel="A partir de"
            benefits={['3 dias de imersao', 'Experiencias exclusivas', 'Guia especialista local']}
            href="/contato?pacote=3-dias"
          />
        </div>
      </div>
    </section>
  )
}
