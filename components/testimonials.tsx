'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'

export default function Testimonials() {
    return (
        <section className="py-16 md:py-32">
            <div className="mx-auto max-w-6xl space-y-8 px-6 md:space-y-16">
                <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center md:space-y-12">
                    <h2 className="font-inter text-4xl font-medium lg:text-5xl">Avaliações e Depoimentos</h2>
                    <p className="font-inter text-muted-foreground">
                        Veja aqui os depoimentos de nossos clientes que viveram experiências inesquecíveis no Rio de Janeiro. 
                        Histórias reais de turistas que escolheram a Rick Travel para descobrir a cidade maravilhosa com guias credenciados e passeios exclusivos.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-rows-2">
                    <TestimonialCard
                        author="Camila Ferraz"
                        role="Turista de São Paulo"
                        initials="CF"
                        isLarge={true}
                        text="Foi maravilhoso! A experiência no Rio de Janeiro superou todas as minhas expectativas. O guia credenciado da Rick Travel foi extremamente profissional, conhecedor da história e cultura da cidade. Visitamos o Cristo Redentor, Pão de Açúcar, e tantos outros pontos turísticos incríveis. O atendimento personalizado e a atenção aos detalhes fizeram toda a diferença. Recomendo muito para quem quer conhecer o melhor do Rio com segurança e qualidade."
                        fullText="Foi maravilhoso! A experiência no Rio de Janeiro superou todas as minhas expectativas. O guia credenciado da Rick Travel foi extremamente profissional, conhecedor da história e cultura da cidade. Visitamos o Cristo Redentor, Pão de Açúcar, e tantos outros pontos turísticos incríveis. O atendimento personalizado e a atenção aos detalhes fizeram toda a diferença. A equipe foi muito atenciosa desde o primeiro contato, respondendo todas as nossas dúvidas prontamente. O roteiro foi perfeitamente planejado, permitindo que aproveitássemos ao máximo cada momento. A experiência superou todas as minhas expectativas e certamente voltarei a contratar os serviços da Rick Travel quando retornar ao Rio de Janeiro. Recomendo muito para quem quer conhecer o melhor do Rio com segurança e qualidade."
                    />
                    <TestimonialCard
                        author="Lucas Hernanes"
                        role="Turista Internacional"
                        initials="LH"
                        text="Serviço excelente! Desde o primeiro contato até o final do passeio, tudo foi perfeito. O tour privado pelo Rio de Janeiro foi incrível, com roteiro personalizado que incluiu Cristo Redentor, Maracanã e a famosa Escadaria Selarón. O guia falava perfeitamente em português e inglês, o que facilitou muito para nossa família."
                        fullText="Serviço excelente! Desde o primeiro contato até o final do passeio, tudo foi perfeito. O tour privado pelo Rio de Janeiro foi incrível, com roteiro personalizado que incluiu Cristo Redentor, Maracanã e a famosa Escadaria Selarón. O guia falava perfeitamente em português e inglês, o que facilitou muito para nossa família. O transporte foi confortável e pontual, e o guia estava sempre disponível para tirar dúvidas e fazer ajustes no roteiro conforme necessário. A experiência foi verdadeiramente única e memorável, superando todas as nossas expectativas. Certamente repetirei quando voltar ao Rio!"
                    />
                    <TestimonialCard
                        author="Danyela Viana"
                        role="Influenciadora Digital"
                        initials="DV"
                        text="Experiência inesquecível no passeio de helicóptero sobre o Rio de Janeiro! A vista aérea do Cristo Redentor e da Baía de Guanabara foi de tirar o fôlego."
                        fullText="Experiência inesquecível no passeio de helicóptero sobre o Rio de Janeiro! A vista aérea do Cristo Redentor e da Baía de Guanabara foi de tirar o fôlego. A equipe da Rick Travel cuidou de todos os detalhes, desde a reserva até o retorno. Segurança, profissionalismo e muita dedicação. O piloto foi extremamente experiente e nos proporcionou uma visão privilegiada dos principais cartões-postais da cidade. Recomendo muito para quem busca uma experiência única e memorável na cidade maravilhosa."
                    />
                    <TestimonialCard
                        author="Julia Cortez"
                        role="Jornalista e Escritora"
                        initials="JC"
                        text="Atendimento impecável da Rick Travel! Desde o primeiro contato, percebi o cuidado e atenção com cada detalhe. O tour pelo centro histórico do Rio foi enriquecedor."
                        fullText="Atendimento impecável da Rick Travel! Desde o primeiro contato, percebi o cuidado e atenção com cada detalhe. O tour pelo centro histórico do Rio foi enriquecedor, com explicações detalhadas sobre a história e cultura da cidade. O guia credenciado Cadastur demonstrou muito conhecimento e paciência, respondendo todas as minhas perguntas com propriedade. A experiência me proporcionou insights valiosos para minhas pesquisas e trabalhos. Serviço de excelência que superou minhas expectativas em todos os aspectos!"
                    />
                </div>
            </div>
        </section>
    )
}

interface TestimonialCardProps {
    author: string
    role: string
    initials: string
    text: string
    fullText: string
    isLarge?: boolean
}

function TestimonialCard({ author, role, initials, text, fullText, isLarge = false }: TestimonialCardProps) {
    const [isExpanded, setIsExpanded] = useState(false)
    const needsExpand = fullText.length > text.length

    return (
        <Card className={`grid grid-rows-[auto_1fr] ${isLarge ? 'sm:col-span-2 lg:row-span-2' : ''} ${!isLarge && isExpanded ? 'md:col-span-2' : ''}`}>
            {isLarge && (
                <CardHeader>
                    <div className="h-6 flex items-center">
                        <span className="font-inter text-lg font-semibold text-primary">Rick Travel</span>
                    </div>
                </CardHeader>
            )}
            <CardContent className={`${isLarge ? '' : 'pt-6'} p-6`}>
                <blockquote className="grid h-full grid-rows-[1fr_auto] gap-4">
                    <div className="space-y-2">
                        <p className={`font-inter leading-relaxed text-muted-foreground ${isLarge ? 'text-base' : 'text-sm'}`}>
                            {isExpanded ? fullText : text}
                        </p>
                        {needsExpand && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="font-inter h-auto p-0 text-xs text-primary hover:bg-transparent hover:underline -ml-1"
                            >
                                {isExpanded ? 'Ler menos' : 'Leia mais'}
                                <ChevronDown className={`ml-1 size-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                            </Button>
                        )}
                    </div>

                    <div className={`grid ${isLarge ? 'grid-cols-[auto_1fr]' : 'grid-cols-[auto_1fr]'} items-center gap-3 pt-4 border-t border-dashed`}>
                        <Avatar className="size-10 sm:size-12">
                            <AvatarFallback className="font-inter bg-primary/10 text-primary font-semibold text-xs sm:text-sm">{initials}</AvatarFallback>
                        </Avatar>
                        <div>
                            <cite className="font-inter text-sm font-medium block">{author}</cite>
                            <span className="text-muted-foreground font-inter block text-xs sm:text-sm">{role}</span>
                        </div>
                    </div>
                </blockquote>
            </CardContent>
        </Card>
    )
}
