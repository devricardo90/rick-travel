
'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import Link from 'next/link'

export default function FAQsTwo() {
  const faqItems = [
    {
      id: 'item-1',
      question: 'Quanto tempo leva para confirmar a reserva?',
      answer:
        'A confirmação da reserva acontece em até 24 horas após o pagamento. Para reservas urgentes, oferecemos confirmação expressa em até 2 horas. Basta entrar em contato com nossa equipe.',
    },
    {
      id: 'item-2',
      question: 'Quais métodos de pagamento vocês aceitam?',
      answer:
        'Aceitamos cartões de crédito (Visa, Mastercard e American Express), Pix, PayPal e transferência bancária. Para empresas, também disponibilizamos faturamento com nota fiscal.',
    },
    {
      id: 'item-3',
      question: 'Posso alterar ou cancelar minha reserva?',
      answer:
        'Sim. Alterações ou cancelamentos podem ser feitos até 48 horas antes do passeio. Após esse prazo, nossa equipe avaliará cada caso conforme a política de cancelamento.',
    },
    {
      id: 'item-4',
      question: 'Vocês atendem turistas internacionais?',
      answer:
        'Atendemos turistas do mundo todo. Nossos guias são credenciados Cadastur e falam português, inglês e espanhol, garantindo uma experiência segura e personalizada.',
    },
    {
      id: 'item-5',
      question: 'Qual é a política de reembolso?',
      answer:
        'Reembolsos são garantidos para cancelamentos feitos até 48 horas antes do passeio. Em casos de clima adverso, oferecemos reagendamento sem custo adicional.',
    },
  ]

  return (
    <section className="py-20 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center space-y-4">
          <h2 className="font-inter text-balance text-4xl font-semibold md:text-5xl">
            Dúvidas Frequentes
          </h2>
          <p className="font-inter text-muted-foreground text-balance">
            Respostas rápidas e claras para as principais perguntas sobre nossos
            passeios, reservas e experiências no Rio de Janeiro.
          </p>
        </div>

        {/* Accordion */}
        <div className="mx-auto mt-14 max-w-2xl">
          <Accordion
            type="single"
            collapsible
            className="rounded-3xl border bg-card px-6 py-4 shadow-sm"
          >
            {faqItems.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="border-b border-dashed last:border-none"
              >
                <AccordionTrigger className="font-inter text-left text-base font-medium hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="font-inter text-muted-foreground leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* CTA */}
          <div className="mt-8 text-center">
            <p className="font-inter text-muted-foreground">
              Ainda ficou com alguma dúvida?
            </p>
            <Link
              href="#contato"
              className="font-inter mt-2 inline-block text-primary font-medium hover:underline"
            >
              Fale com nossa equipe de atendimento
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
