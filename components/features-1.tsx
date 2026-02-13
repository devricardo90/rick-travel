'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

export default function Features() {
  const t = useTranslations('HomePage.Features');

  return (
    <section className="bg-zinc-50 py-16 md:py-32 dark:bg-transparent">
      <div className="@container mx-auto max-w-5xl px-6">
        <div className="text-center">
          <h2 className="font-inter text-balance text-4xl font-semibold lg:text-5xl">
            {t('title')}
          </h2>
          <p className="font-inter mt-4 text-muted-foreground">
            {t('subtitle')}
          </p>
        </div>

        <div className="@min-4xl:max-w-full @min-4xl:grid-cols-3 mx-auto mt-8 grid max-w-sm gap-6 md:mt-16">

          {/* PACOTE 1: Rio Essencial */}
          <Card className="group flex flex-col shadow-zinc-950/5 overflow-hidden">
            <div className="relative h-48 w-full overflow-hidden">
              <img
                src="/images/trips/imagem-casal-pao-de-acucar.jpg"
                alt="Tour Rio de Janeiro Pão de Açúcar"
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            <CardHeader className="pb-3 text-center">
              <h3 className="font-inter mt-2 font-medium text-xl">
                {t('package1.title')}
              </h3>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col">
              <p className="font-inter text-sm text-muted-foreground">
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
          <Card className="group flex flex-col shadow-zinc-950/5 overflow-hidden">
            <div className="relative h-48 w-full overflow-hidden">
              <img
                src="/images/trips/imagem-escadaria-selarao-brasil.jpg"
                alt="Tour Rio de Janeiro Experiência Completa"
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            <CardHeader className="pb-3 text-center">
              <h3 className="font-inter mt-2 font-medium text-xl">
                {t('package2.title')}
              </h3>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col">
              <p className="font-inter text-sm text-muted-foreground">
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
          <Card className="group flex flex-col shadow-zinc-950/5 overflow-hidden">
            <div className="relative h-48 w-full overflow-hidden">
              <img
                src="/images/trips/imagem-tour-favela-rocinha.jpg"
                alt="Tour Favela Rocinha e Arte Urbana"
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            <CardHeader className="pb-3 text-center">
              <h3 className="font-inter mt-2 font-medium text-xl">
                {t('package3.title')}
              </h3>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col">
              <p className="font-inter text-sm text-muted-foreground">
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

