
'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

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
    <section className="py-20 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center space-y-4">
          <h2 className="font-inter text-balance text-4xl font-semibold md:text-5xl">
            {t('title')}
          </h2>
          <p className="font-inter text-muted-foreground text-balance">
            {t('subtitle')}
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
              {t('stillHaveQuestions')}
            </p>
            <Link
              href="#contato"
              className="font-inter mt-2 inline-block text-primary font-medium hover:underline"
            >
              {t('contactTeam')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
