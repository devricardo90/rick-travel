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
      className={`group relative flex h-full flex-col overflow-hidden rounded-[30px] border border-white/10 bg-[#0d2436] shadow-[0_24px_70px_rgba(0,0,0,0.24)] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-white/16 hover:shadow-[0_32px_90px_rgba(0,0,0,0.3)] ${popular ? 'z-10 scale-[1.02] ring-1 ring-[#c8a86b]/50' : ''
        }`}
    >
      {popular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-[#c8a86b]/35 bg-[#102938] px-4 py-1 text-xs font-semibold text-[#f1dfb7] shadow-md">
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute right-3 top-3">
          {badge}
        </div>
      </div>

      <div className="px-6 pb-2 pt-6">
        <div className="inline-flex rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#d8c18f]">
          Rio signature
        </div>
        <h3 className="mt-4 text-xl font-semibold tracking-[-0.03em] text-white">{title}</h3>
        <div className="mt-4 rounded-[22px] border border-white/8 bg-[#091d2c] p-4">
          <span className="text-xs text-white/52">{priceLabel}</span>
          <p className="text-2xl font-semibold text-white">{price}</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-6 pb-6">
        <p className="mt-2 text-sm leading-7 text-white/66">{description}</p>

        <ul className="mt-5 space-y-2">
          {benefits.map((benefit, index) => (
            <li key={index} className="flex items-center gap-2 text-sm text-white/84">
              <Check className="h-4 w-4 shrink-0 text-[#d8c18f]" />
              {benefit}
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-6">
          <Link
            href={href}
            className={`flex w-full items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200 hover:-translate-y-px ${popular
              ? 'text-white'
              : 'border border-white/15 bg-white/[0.04] text-white hover:bg-white/[0.08]'
              }`}
            style={popular ? { background: 'linear-gradient(135deg, #123A28 0%, #184731 100%)', border: '1px solid rgba(56, 122, 91, 0.4)' } : {}}
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
      <div className="@container mx-auto max-w-6xl px-5 lg:px-6">
        <div className="space-y-4 text-center">
          <span className="inline-flex rounded-full border border-white/10 bg-white/[0.05] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#C8A86B]">
            Curated packages
          </span>
          <h2 className="text-balance text-3xl font-semibold tracking-[-0.04em] text-white md:text-4xl">
            {t('title')}
          </h2>
          <p className="mx-auto max-w-2xl text-[15px] leading-7 text-white/64">
            {t('subtitle')}
          </p>
        </div>

        <div className="@min-4xl:max-w-full @min-4xl:grid-cols-3 mx-auto mt-10 grid max-w-sm items-start gap-6 md:mt-14">
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
