'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import Link from 'next/link'

export default function FAQsTwo() {
    const faqItems = [
        {
            id: 'item-1',
            question: 'Quanto tempo leva para confirmar a reserva?',
            answer: 'A confirmação da reserva é realizada em até 24 horas após o pagamento. Para reservas urgentes, oferecemos confirmação expressa em até 2 horas. Entre em contato conosco para agilizar sua reserva.',
        },
        {
            id: 'item-2',
            question: 'Quais métodos de pagamento vocês aceitam?',
            answer: 'Aceitamos todos os cartões de crédito principais (Visa, Mastercard, American Express), Pix, PayPal e transferência bancária. Para clientes corporativos, também oferecemos opções de faturamento e nota fiscal.',
        },
        {
            id: 'item-3',
            question: 'Posso alterar ou cancelar minha reserva?',
            answer: 'Você pode modificar ou cancelar sua reserva até 48 horas antes do passeio agendado. Após esse período, entre em contato com nossa equipe de atendimento ao cliente que ajudará com quaisquer alterações, sujeito às políticas de cancelamento.',
        },
        {
            id: 'item-4',
            question: 'Vocês atendem turistas internacionais?',
            answer: 'Sim, atendemos turistas de diversos países. Nossos guias são credenciados Cadastur e falam português, inglês e espanhol. Oferecemos suporte completo para visitantes internacionais, incluindo assistência com documentos e informações sobre vistos quando necessário.',
        },
        {
            id: 'item-5',
            question: 'Qual é a política de reembolso?',
            answer: 'Oferecemos política de reembolso de até 48 horas antes do passeio agendado. Cancelamentos com menos de 48 horas podem estar sujeitos a taxas, conforme especificado nos termos e condições. Em caso de condições climáticas adversas, oferecemos reagendamento sem custos adicionais.',
        },
    ]

    return (
        <section className="py-16 md:py-24">
            <div className="mx-auto max-w-5xl px-4 md:px-6">
                <div className="mx-auto max-w-xl text-center">
                    <h2 className="font-inter text-balance text-3xl font-bold md:text-4xl lg:text-5xl">Perguntas e Respostas - Dúvidas Frequentes</h2>
                    <p className="font-inter text-muted-foreground mt-4 text-balance">
                        Encontre respostas rápidas e completas para as principais dúvidas sobre nossos passeios, serviços e experiências turísticas no Rio de Janeiro.
                    </p>
                </div>

                <div className="mx-auto mt-12 max-w-xl">
                    <Accordion
                        type="single"
                        collapsible
                        className="bg-card ring-muted w-full rounded-2xl border px-8 py-3 shadow-sm ring-4 dark:ring-0">
                        {faqItems.map((item) => (
                            <AccordionItem
                                key={item.id}
                                value={item.id}
                                className="border-dashed">
                                <AccordionTrigger className="font-inter cursor-pointer text-base hover:no-underline">{item.question}</AccordionTrigger>
                                <AccordionContent>
                                    <p className="font-inter text-base leading-relaxed">{item.answer}</p>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>

                    <p className="font-inter text-muted-foreground mt-6 px-8">
                        Não encontrou o que procurava? Entre em contato conosco{' '}
                        <Link
                            href="#contato"
                            className="font-inter text-primary font-medium hover:underline">
                            através da nossa equipe de atendimento
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    )
}
