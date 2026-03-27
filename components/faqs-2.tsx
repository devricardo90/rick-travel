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
      <div className="mx-auto max-w-5xl px-5 lg:px-6">
        <div className="mx-auto max-w-2xl space-y-4 text-center">
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-medium text-white/70">
              <MessageCircle className="h-4 w-4" />
              Suporte &amp; Perguntas
            </span>
          </div>
          <h2 className="text-balance text-3xl font-semibold tracking-[-0.04em] text-white md:text-4xl">
            {t('title')}
          </h2>
          <p className="text-balance text-[15px] leading-7 text-white/64">
            {t('subtitle')}
          </p>
        </div>

        <div className="mx-auto mt-14 max-w-3xl">
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
                <AccordionTrigger className="py-5 text-left text-[15px] font-semibold text-white transition-colors duration-200 hover:text-white/80 hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-sm leading-7 text-white/64">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-8 space-y-2 text-center">
            <p className="text-sm text-white/55">
              {t('stillHaveQuestions')}
            </p>
            <Link
              href="#contato"
              className="inline-block text-sm font-medium text-[#d8c18f] transition-colors hover:text-[#f0ddaf]"
            >
              {t('contactTeam')} →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
