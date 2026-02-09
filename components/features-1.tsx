

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Settings2, Sparkles, Zap } from 'lucide-react'
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
          
          {/* PACOTE 1 */}
          <Card className="group flex flex-col shadow-zinc-950/5">
            <CardHeader className="pb-3 text-center">
              <CardDecorator>
                <Zap className="size-6" aria-hidden />
              </CardDecorator>

              <h3 className="font-inter mt-6 font-medium">
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

          {/* PACOTE 2 */}
          <Card className="group flex flex-col shadow-zinc-950/5">
            <CardHeader className="pb-3 text-center">
              <CardDecorator>
                <Settings2 className="size-6" aria-hidden />
              </CardDecorator>

              <h3 className="font-inter mt-6 font-medium">
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

          {/* PACOTE 3 */}
          <Card className="group flex flex-col shadow-zinc-950/5">
            <CardHeader className="pb-3 text-center">
              <CardDecorator>
                <Sparkles className="size-6" aria-hidden />
              </CardDecorator>

              <h3 className="font-inter mt-6 font-medium">
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

const CardDecorator = ({ children }: { children: ReactNode }) => (
  <div className="mask-radial-from-40% mask-radial-to-60% relative mx-auto size-36 duration-200">
    <div
      aria-hidden
      className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[size:24px_24px] dark:opacity-50"
    />
    <div className="bg-background absolute inset-0 m-auto flex size-12 items-center justify-center border-l border-t">
      {children}
    </div>
  </div>
)
