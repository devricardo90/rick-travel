

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ReactNode } from 'react'

export default function Features() {
  return (
    <section className="bg-zinc-50 py-16 md:py-32 dark:bg-transparent">
      <div className="@container mx-auto max-w-5xl px-6">
        <div className="text-center">
          <h2 className="font-inter text-balance text-4xl font-semibold lg:text-5xl">
            Nossos Tours Exclusivos no Rio de Janeiro
          </h2>
          <p className="font-inter mt-4 text-muted-foreground">
            Escolha o pacote ideal para sua viagem e descubra as belezas do Rio de
            Janeiro com guias credenciados e experiências personalizadas.
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
                Rio Essencial – 1 Dia
              </h3>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col">
              <p className="font-inter text-sm text-muted-foreground">
                Conheça os principais cartões-postais do Rio de Janeiro em um dia
                completo. Cristo Redentor, Pão de Açúcar, praias icônicas e pontos
                históricos, tudo com transporte incluso e acompanhamento de guia
                credenciado Cadastur.
              </p>

              <div className="mt-auto pt-6">
                <Link href="/contato?pacote=1-dia">
                  <Button className="w-full">Solicitar orçamento</Button>
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
                Rio Completo – 2 Dias
              </h3>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col">
              <p className="font-inter text-sm text-muted-foreground">
                Explore o melhor do Rio de Janeiro em dois dias intensos de
                passeios guiados. Combine visitas aos principais pontos
                turísticos com experiências culturais, gastronômicas e
                atividades exclusivas.
              </p>

              <div className="mt-auto pt-6">
                <Link href="/contato?pacote=2-dias">
                  <Button className="w-full">Solicitar orçamento</Button>
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
                Rio Imersão – 3 Dias
              </h3>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col">
              <p className="font-inter text-sm text-muted-foreground">
                Imersão completa no Rio de Janeiro com três dias de passeios
                exclusivos e personalizados. Roteiro completo, transporte
                privado, acompanhamento multilíngue e experiência premium.
              </p>

              <div className="mt-auto pt-6">
                <Link href="/contato?pacote=3-dias">
                  <Button className="w-full">Solicitar orçamento</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </section>
  )
}


