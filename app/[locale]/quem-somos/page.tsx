'use client'

import { useTranslations } from 'next-intl';

export default function QuemSomosPage() {
  const t = useTranslations('AboutPage');

  return (
    <main className="mx-auto max-w-5xl px-6 py-20 space-y-16">
      {/* Intro Section */}
      <section className="text-center space-y-8">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{t('title')}</h1>

        {/* Foto do Guia */}
        <div className="mx-auto relative w-full max-w-2xl aspect-video rounded-2xl overflow-hidden shadow-xl">
          <img
            src="/images/trips/imagem-casal-pao-de-acucar.jpg"
            alt="Ricardo Guia de Turismo no Pão de Açúcar com turista"
            className="object-cover w-full h-full"
          />
        </div>

        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          {t('intro')}
        </p>
      </section>

      {/* Mission/Vision/Values Grid */}
      <section className="grid gap-8 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="mb-2 text-xl font-semibold">{t('mission.title')}</h3>
          <p className="text-muted-foreground">
            {t('mission.description')}
          </p>
        </div>
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="mb-2 text-xl font-semibold">{t('vision.title')}</h3>
          <p className="text-muted-foreground">
            {t('vision.description')}
          </p>
        </div>
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="mb-2 text-xl font-semibold">{t('values.title')}</h3>
          <ul className="list-disc list-inside text-muted-foreground text-left">
            <li>{t('values.item1')}</li>
            <li>{t('values.item2')}</li>
            <li>{t('values.item3')}</li>
            <li>{t('values.item4')}</li>
          </ul>
        </div>
      </section>

      {/* Cadastur / Governance */}
      <section className="rounded-2xl bg-muted/50 p-8 md:p-12">
        <div className="md:flex md:items-center md:justify-between md:gap-8">
          <div className="space-y-4 md:w-2/3">
            <h2 className="text-3xl font-bold">{t('certification.title')}</h2>
            <p className="text-muted-foreground">
              {t('certification.description1')}
            </p>
            <p className="text-muted-foreground">
              {t('certification.description2')}
            </p>
          </div>
          {/* Placeholder for Cadastur Seal/Image */}
          <div className="mt-6 flex justify-center md:mt-0 md:w-1/3">
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-background shadow-lg">
              <span className="font-bold text-primary">CADASTUR</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
