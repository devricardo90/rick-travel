
'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { MessageCircle } from 'lucide-react'

export default function FAQsTwo() {
  const t = useTranslations('HomePage.FAQs');
  const faqItems = [
    {
      id: 'item-1',
      question: t('questions.q1.question'),
      answer: t('questions.q1.answer'),
    },
    {
      id: 'item-2',
      question: t('questions.q2.question'),
      answer: t('questions.q2.answer'),
    },
    {
      id: 'item-3',
      question: t('questions.q3.question'),
      answer: t('questions.q3.answer'),
    },
    {
      id: 'item-4',
      question: t('questions.q4.question'),
      answer: t('questions.q4.answer'),
    },
    {
      id: 'item-5',
      question: t('questions.q5.question'),
      answer: t('questions.q5.answer'),
    },
  ]

  return (
    <section className="section-spacing">
      <div className="mx-auto max-w-5xl px-6">
        {/* Header com ícone de suporte */}
        <div className="mx-auto max-w-2xl text-center space-y-4">
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/70">
              <MessageCircle className="h-4 w-4" />
              Suporte &amp; Perguntas
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-[-0.02em] text-white text-balance">
            {t('title')}
          </h2>
          <p className="text-white/65 text-balance">
            {t('subtitle')}
          </p>
        </div>

        {/* Accordion */}
        <div className="mx-auto mt-14 max-w-2xl">
          <Accordion
            type="single"
            collapsible
            className="surface-dark px-6 py-4"
          >
            {faqItems.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="border-b border-white/10 last:border-none"
              >
                <AccordionTrigger className="text-sm text-left font-semibold text-white hover:no-underline hover:text-white/80 transition-colors duration-200">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-white/65 leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* CTA */}
          <div className="mt-8 text-center space-y-2">
            <p className="text-sm text-white/55">
              {t('stillHaveQuestions')}
            </p>
            <Link
              href="#contato"
              className="text-sm inline-block text-white/80 hover:text-white font-medium transition-colors"
            >
              {t('contactTeam')} →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
