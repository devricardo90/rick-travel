'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Check } from 'lucide-react'

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
      className={`group flex flex-col rounded-2xl overflow-hidden border border-white/8 bg-white dark:bg-[#0B2233] shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl dark:hover:border-white/15 dark:hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)] ${popular ? 'ring-2 ring-[#1A7A6E]/60 shadow-xl scale-[1.02] relative z-10' : ''
        }`}
    >
      {/* Popular badge flutuante */}
      {popular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#0B2E1E] to-[#0F3B27] border border-[#1A4D2E]/60 text-white/90 text-xs font-bold px-4 py-1 rounded-full shadow-md whitespace-nowrap">
          ⭐ Mais Popular
        </div>
      )}

      <div className="relative h-52 w-full overflow-hidden">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          quality={75}
          loading="lazy"
        />
        {/* Gradiente no hover da imagem */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-3 right-3">
          {badge}
        </div>
      </div>

      <div className="px-6 pb-2 pt-6 text-center">
        <h3 className="text-lg font-semibold mt-2 text-gray-900 dark:text-[#EAF2F7]">{title}</h3>
        {/* Preço de destaque */}
        <div className="mt-2 rounded-lg dark:bg-gradient-to-r dark:from-[#0B2E1E] dark:to-[#0F3B27] dark:border dark:border-[#1A4D2E]/50 p-0 dark:py-2 dark:px-3">
          <span className="text-xs text-muted-foreground dark:text-[#A8B7C6]/70">{priceLabel}</span>
          <p className="text-2xl font-black text-primary dark:text-[#EAF2F7]">{price}</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-6 pb-6">
        <p className="text-sm leading-relaxed text-muted-foreground dark:text-[#A8B7C6] mt-2">{description}</p>

        {/* Lista de benefícios */}
        <ul className="mt-4 space-y-1.5">
          {benefits.map((benefit, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-foreground dark:text-[#EAF2F7]/85">
              <Check className="h-4 w-4 text-[#1A7A6E] shrink-0" />
              {benefit}
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-6">
          <Link href={href}>
            <button
              className={`w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 hover:-translate-y-px ${popular
                ? 'text-white'
                : 'border border-white/15 dark:text-[#EAF2F7] dark:hover:bg-white/8'
                }`}
              style={popular ? { background: 'linear-gradient(135deg, #0B2E1E 0%, #0F3B27 100%)', border: '1px solid rgba(26,77,46,0.5)' } : {}}
            >
              {t('requestQuote')}
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function Features() {
  const t = useTranslations('HomePage.Features');

  return (
    <section className="section-spacing">
      <div className="@container mx-auto max-w-5xl px-6">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold tracking-[-0.02em] text-white text-balance">
            {t('title')}
          </h2>
          <p className="text-white/65">
            {t('subtitle')}
          </p>
        </div>

        <div className="@min-4xl:max-w-full @min-4xl:grid-cols-3 mx-auto mt-8 grid max-w-sm gap-6 md:mt-16 items-start">

          {/* PACOTE 1: Rio Essencial */}
          <PackageCard
            title={t('package1.title')}
            description={t('package1.description')}
            imageSrc="/images/trips/imagem-casal-pao-de-acucar.jpg"
            imageAlt="Tour Rio de Janeiro Pão de Açúcar"
            badge={<span className="badge-success text-xs px-3 py-1 rounded-full font-medium">✓ Disponível</span>}
            price="R$ 280"
            priceLabel="A partir de"
            benefits={['Guia bilíngue incluso', 'Transporte confortável', 'Fotos panorâmicas']}
            href="/contato?pacote=1-dia"
          />

          {/* PACOTE 2: Rio Completo — POPULAR */}
          <PackageCard
            title={t('package2.title')}
            description={t('package2.description')}
            imageSrc="/images/trips/imagem-escadaria-selarao-brasil.jpg"
            imageAlt="Tour Rio de Janeiro Experiência Completa"
            badge={<span className="badge-info text-xs px-3 py-1 rounded-full font-medium">🔥 Mais Vendido</span>}
            price="R$ 490"
            priceLabel="A partir de"
            benefits={['2 dias de experiência', 'Café da manhã incluso', 'Roteiro personalizado']}
            href="/contato?pacote=2-dias"
            popular
          />

          {/* PACOTE 3: Rio Imersão */}
          <PackageCard
            title={t('package3.title')}
            description={t('package3.description')}
            imageSrc="/images/trips/imagem-tour-favela-rocinha.jpg"
            imageAlt="Tour Favela Rocinha e Arte Urbana"
            badge={<span className="badge-warning text-xs px-3 py-1 rounded-full font-medium">🔥 Vagas Limitadas</span>}
            price="R$ 750"
            priceLabel="A partir de"
            benefits={['3 dias de imersão', 'Experiências exclusivas', 'Guia especialista local']}
            href="/contato?pacote=3-dias"
          />

        </div>
      </div>
    </section>
  )
}
