'use client'

import Image from 'next/image'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

export default function Features() {
  const t = useTranslations('HomePage.Features');

  return (
    <section className="section-spacing bg-zinc-50 dark:bg-transparent">
      <div className="@container mx-auto max-w-5xl px-6">
        <div className="text-center space-y-4">
          <h2 className="heading-2 text-balance">
            {t('title')}
          </h2>
          <p className="body-base text-muted-foreground">
            {t('subtitle')}
          </p>
        </div>

        <div className="@min-4xl:max-w-full @min-4xl:grid-cols-3 mx-auto mt-8 grid max-w-sm gap-6 md:mt-16">

          {/* PACOTE 1: Rio Essencial */}
          <Card className="group flex flex-col shadow-zinc-950/5 overflow-hidden card-hover">
            <div className="relative h-48 w-full overflow-hidden">
              <Image
                src="/images/trips/imagem-casal-pao-de-acucar.jpg"
                alt="Tour Rio de Janeiro Pão de Açúcar"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                quality={85}
              />
              <div className="absolute top-3 right-3">
                <span className="badge-success text-xs px-3 py-1 rounded-full font-medium">
                  ✓ Disponível
                </span>
              </div>
            </div>

            <CardHeader className="pb-3 text-center">
              <h3 className="heading-5 mt-2">
                {t('package1.title')}
              </h3>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col">
              <p className="body-sm text-muted-foreground">
                {t('package1.description')}
              </p>

              <div className="mt-auto pt-6">
                <Link href="/contato?pacote=1-dia">
                  <Button className="w-full">{t('requestQuote')}</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* PACOTE 2: Rio Completo */}
          <Card className="group flex flex-col shadow-zinc-950/5 overflow-hidden card-hover">
            <div className="relative h-48 w-full overflow-hidden">
              <Image
                src="/images/trips/imagem-escadaria-selarao-brasil.jpg"
                alt="Tour Rio de Janeiro Experiência Completa"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                quality={85}
              />
              <div className="absolute top-3 right-3">
                <span className="badge-info text-xs px-3 py-1 rounded-full font-medium">
                  ⭐ Mais Popular
                </span>
              </div>
            </div>

            <CardHeader className="pb-3 text-center">
              <h3 className="heading-5 mt-2">
                {t('package2.title')}
              </h3>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col">
              <p className="body-sm text-muted-foreground">
                {t('package2.description')}
              </p>

              <div className="mt-auto pt-6">
                <Link href="/contato?pacote=2-dias">
                  <Button className="w-full">{t('requestQuote')}</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* PACOTE 3: Rio Imersão */}
          <Card className="group flex flex-col shadow-zinc-950/5 overflow-hidden card-hover">
            <div className="relative h-48 w-full overflow-hidden">
              <Image
                src="/images/trips/imagem-tour-favela-rocinha.jpg"
                alt="Tour Favela Rocinha e Arte Urbana"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                quality={85}
              />
              <div className="absolute top-3 right-3">
                <span className="badge-warning text-xs px-3 py-1 rounded-full font-medium">
                  🔥 Vagas Limitadas
                </span>
              </div>
            </div>

            <CardHeader className="pb-3 text-center">
              <h3 className="heading-5 mt-2">
                {t('package3.title')}
              </h3>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col">
              <p className="body-sm text-muted-foreground">
                {t('package3.description')}
              </p>

              <div className="mt-auto pt-6">
                <Link href="/contato?pacote=3-dias">
                  <Button className="w-full">{t('requestQuote')}</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </section>
  )
}

