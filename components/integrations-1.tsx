import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ChevronRight, MapPin, Users, Sun, Sunrise, Plane, Building2 } from 'lucide-react'
import Link from 'next/link'
import * as React from 'react'

export default function IntegrationsSection() {
    return (
        <section>
            <div className="py-32">
                <div className="mx-auto max-w-5xl px-6">
                    <div className="text-center">
                        <h2 className="font-inter text-balance text-3xl font-semibold md:text-4xl">Rio de Janeiro Excursões, ingressos, atividades</h2>
                        <p className="font-inter text-muted-foreground mt-6">
                            Explore as melhores experiências turísticas do Rio de Janeiro com excursões exclusivas, ingressos para principais atrações 
                            e atividades personalizadas. Sua jornada pela cidade maravilhosa começa aqui.
                        </p>
                    </div>

                    <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        <IntegrationCard
                            title="Um Dia no Rio - Cristo, Pão de Açúcar, City Tour"
                            description="Passeio completo pelas principais atrações do Rio em um dia. Visite o Cristo Redentor no Corcovado, 
                            o Pão de Açúcar com bondinho, passeie pelo centro histórico e descubra os pontos turísticos mais icônicos da cidade. 
                            Guia credenciado, transporte incluso e ingressos para as atrações. Experiência imperdível para quem quer conhecer o melhor do Rio."
                            link="#reservas">
                            <MapPin className="size-10" />
                        </IntegrationCard>

                        <IntegrationCard
                            title="Tour Privado: Cristo Redentor, Maracanã, Pão de Açúcar, Centro Antigo e Selarón"
                            description="Passeio privado exclusivo com guia credenciado Cadastur. Visite o Cristo Redentor, estádio do Maracanã, 
                            Pão de Açúcar, centro histórico do Rio e a famosa Escadaria Selarón. Tour personalizado, flexível e com transporte privado. 
                            Ideal para grupos ou famílias que buscam conforto, exclusividade e experiência premium no Rio de Janeiro."
                            link="#reservas">
                            <Users className="size-10" />
                        </IntegrationCard>

                        <IntegrationCard
                            title="Experiência Rio Sunset - Cristo Redentor, Catedral, Escadaria Selarón e Pôr do Sol no Pão de Açúcar"
                            description="Viva o pôr do sol mais bonito do Rio de Janeiro. Combine visita ao Cristo Redentor, Catedral Metropolitana 
                            e Escadaria Selarón com a experiência única de ver o pôr do sol no topo do Pão de Açúcar. Momento mágico e romântico 
                            com vistas panorâmicas espetaculares. Guia credenciado, ingressos e transporte incluídos."
                            link="#reservas">
                            <Sun className="size-10" />
                        </IntegrationCard>

                        <IntegrationCard
                            title="Rio: Amanhecer em Dona Marta, Cristo Redentor com Bilhetes"
                            description="Experiência única de ver o amanhecer no Mirante Dona Marta com vista para o Cristo Redentor e toda a 
                            Baía de Guanabara. Em seguida, visite o Cristo Redentor no Corcovado com ingressos incluídos. Tour exclusivo para 
                            os amantes de fotografia e natureza. Guia credenciado e transporte incluso. Reserve para viver um momento inesquecível."
                            link="#reservas">
                            <Sunrise className="size-10" />
                        </IntegrationCard>

                        <IntegrationCard
                            title="Rio: Passeio de Helicóptero no Cristo Redentor - 30 minutos"
                            description="Sobrevoagem exclusiva de 30 minutos sobre o Rio de Janeiro com vista privilegiada do Cristo Redentor, 
                            Pão de Açúcar, praias de Copacabana e Ipanema, Baía de Guanabara e muito mais. Experiência premium e inesquecível 
                            com segurança e conforto. Voo panorâmico sobrevoando os principais cartões-postais da cidade maravilhosa."
                            link="#reservas">
                            <Plane className="size-10" />
                        </IntegrationCard>

                        <IntegrationCard
                            title="Excursão particular pela Cidade Imperial de Petrópolis"
                            description="Conheça Petrópolis, a cidade imperial brasileira. Visite o Museu Imperial, Palácio de Cristal, 
                            Catedral São Pedro de Alcântara e o centro histórico. Tour privado com guia credenciado, transporte de ida e volta 
                            do Rio de Janeiro, roteiro personalizado e flexível. Ideal para quem quer conhecer a história do Brasil em um dia."
                            link="#reservas">
                            <Building2 className="size-10" />
                        </IntegrationCard>
                    </div>
                </div>
            </div>
        </section>
    )
}

const IntegrationCard = ({ title, description, children, link = '#reservas' }: { title: string; description: string; children: React.ReactNode; link?: string }) => {
    return (
        <Card className="p-6">
            <div className="relative">
                <div className="*:size-10">{children}</div>

                <div className="space-y-2 py-6">
                    <h3 className="font-inter text-base font-medium">{title}</h3>
                    <p className="font-inter text-muted-foreground line-clamp-3 text-sm leading-relaxed">{description}</p>
                </div>

                <div className="flex gap-3 border-t border-dashed pt-6">
                    <Button
                        asChild
                        variant="secondary"
                        size="sm"
                        className="gap-1 pr-2 shadow-none">
                        <Link href={link}>
                            Saiba mais
                            <ChevronRight className="ml-0 !size-3.5 opacity-50" />
                        </Link>
                    </Button>
                </div>
            </div>
        </Card>
    )
}
