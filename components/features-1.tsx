import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Settings2, Sparkles, Zap } from 'lucide-react'
import { ReactNode } from 'react'

export default function Features() {
    return (
        <section className="bg-zinc-50 py-16 md:py-32 dark:bg-transparent">
            <div className="@container mx-auto max-w-5xl px-6">
                <div className="text-center">
                    <h2 className="font-inter text-balance text-4xl font-semibold lg:text-5xl">Nossos Tours Exclusivos no Rio de Janeiro</h2>
                    <p className="font-inter mt-4 text-muted-foreground">Escolha o pacote ideal para sua viagem e descubra as belezas do Rio de Janeiro com guias credenciados e experiências personalizadas.</p>
                </div>
                <div className="@min-4xl:max-w-full @min-4xl:grid-cols-3 mx-auto mt-8 grid max-w-sm gap-6 *:text-center md:mt-16">
                    <Card className="group shadow-zinc-950/5">
                        <CardHeader className="pb-3">
                            <CardDecorator>
                                <Zap
                                    className="size-6"
                                    aria-hidden
                                />
                            </CardDecorator>

                            <h3 className="font-inter mt-6 font-medium">PACOTE 1 DIA RIO DE JANEIRO</h3>
                        </CardHeader>

                        <CardContent>
                            <p className="font-inter text-sm text-muted-foreground">
                                Descubra as principais atrações do Rio de Janeiro em um dia completo com nosso guia credenciado Cadastur. 
                                Visite o Cristo Redentor, Pão de Açúcar, praias icônicas e pontos turísticos históricos com transporte 
                                incluso e suporte em múltiplos idiomas. Experiência única e personalizada para turistas nacionais e 
                                internacionais.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="group shadow-zinc-950/5">
                        <CardHeader className="pb-3">
                            <CardDecorator>
                                <Settings2
                                    className="size-6"
                                    aria-hidden
                                />
                            </CardDecorator>

                            <h3 className="font-inter mt-6 font-medium">PACOTE 2 DIAS RIO DE JANEIRO</h3>
                        </CardHeader>

                        <CardContent>
                            <p className="font-inter mt-3 text-sm text-muted-foreground">
                                Explore o melhor do Rio de Janeiro em dois dias intensos de passeios guiados. Combine visitas aos 
                                principais pontos turísticos com experiências culturais, gastronômicas e atividades exclusivas. 
                                Guia credenciado Cadastur, roteiro personalizado e flexível com suporte em português, inglês e 
                                espanhol. Ideal para quem deseja conhecer a cidade maravilhosa com mais profundidade e conforto.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="group shadow-zinc-950/5">
                        <CardHeader className="pb-3">
                            <CardDecorator>
                                <Sparkles
                                    className="size-6"
                                    aria-hidden
                                />
                            </CardDecorator>

                            <h3 className="font-inter mt-6 font-medium">PACOTE 3 DIAS RIO</h3>
                        </CardHeader>

                        <CardContent>
                            <p className="font-inter mt-3 text-sm text-muted-foreground">
                                Imersão completa no Rio de Janeiro com três dias de passeios exclusivos e personalizados. 
                                Roteiro completo incluindo pontos históricos, culturais, naturais e de entretenimento. 
                                Guia turístico credenciado Cadastur, transporte privado, acompanhamento multilíngue e 
                                experiência premium. Perfeito para turistas que buscam conhecer verdadeiramente a essência 
                                da cidade maravilhosa com segurança, qualidade e autenticidade.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}

const CardDecorator = ({ children }: { children: ReactNode }) => (
    <div className="mask-radial-from-40% mask-radial-to-60% relative mx-auto size-36 duration-200 [--color-border:color-mix(in_oklab,var(--color-zinc-950)10%,transparent)] group-hover:[--color-border:color-mix(in_oklab,var(--color-zinc-950)20%,transparent)] dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)] dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)]">
        <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:24px_24px] dark:opacity-50"
        />

        <div className="bg-background absolute inset-0 m-auto flex size-12 items-center justify-center border-l border-t">{children}</div>
    </div>
)
