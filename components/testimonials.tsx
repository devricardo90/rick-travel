'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'
import { useTranslations } from 'next-intl'

function StarRating() {
  return (
    <div className="star-rating mb-3" aria-label="5 estrelas">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="h-4 w-4 fill-amber-400 text-amber-400" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default function Testimonials() {
  const t = useTranslations('HomePage.Testimonials');
  return (
    <section className="section-spacing">
      <div className="mx-auto max-w-6xl px-5 lg:px-6">
        <div className="mx-auto mb-12 max-w-2xl space-y-4 text-center">
          <div className="inline-flex rounded-full border border-white/10 bg-white/[0.05] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#c8a86b]">
            Depoimentos reais
          </div>
          <h2 className="text-3xl font-semibold tracking-[-0.04em] text-white md:text-4xl">
            {t('title')}
          </h2>
          <p className="text-[15px] leading-7 text-white/64">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <TestimonialCard
            author="Camila Ferraz"
            role="Turista • São Paulo"
            initials="CF"
            instagram="@camilaf"
            avatarUrl="/avatars/camila.jpg"
            text="Experiência incrível! Atendimento impecável e roteiro muito bem planejado."
            fullText="Experiência incrível! Atendimento impecável e roteiro muito bem planejado. O guia foi extremamente profissional e atencioso, tornando o passeio leve, seguro e enriquecedor. Recomendo para quem quer conhecer o Rio com qualidade."
            translate={t}
          />

          <TestimonialCard
            author="Lucas Hernanes"
            role="Turista Internacional"
            initials="LH"
            instagram="@lucas.h"
            avatarUrl="/avatars/lucas.jpg"
            text="Tour privado excelente, tudo organizado nos mínimos detalhes."
            fullText="Tour privado excelente, tudo organizado nos mínimos detalhes. O guia falava inglês fluentemente, o transporte foi confortável e o roteiro flexível. Uma experiência memorável para toda a família."
            translate={t}
          />

          <TestimonialCard
            author="Rafael Monteiro"
            role="Turista • Minas Gerais"
            initials="RM"
            instagram="@rafaelmonteiro"
            avatarUrl="/avatars/rafael.jpg"
            text="Passeio super organizado e confortável, vale cada minuto."
            fullText="Passeio super organizado e confortável, vale cada minuto. O roteiro foi flexível, o guia extremamente educado e o transporte impecável. Conseguimos aproveitar o Rio com tranquilidade e segurança. Recomendo demais!"
            translate={t}
          />

          <TestimonialCard
            author="Mariana Lopes"
            role="Empresária"
            initials="ML"
            instagram="@marilopes"
            avatarUrl="/avatars/mariana.jpg"
            text="Atendimento premium do início ao fim, experiência sensacional."
            fullText="Atendimento premium do início ao fim, experiência sensacional. A Rick Travel cuidou de todos os detalhes com muito profissionalismo. O tour foi exclusivo, confortável e super bem planejado. Sem dúvida a melhor forma de conhecer o Rio."
            translate={t}
          />


          <TestimonialCard
            author="Danyela Viana"
            role="Influenciadora Digital"
            initials="DV"
            instagram="@danyviana"
            avatarUrl="/avatars/dany.jpg"
            text="O passeio de helicóptero foi simplesmente surreal!"
            fullText="O passeio de helicóptero foi simplesmente surreal! A vista aérea do Cristo Redentor e da Baía de Guanabara é algo que nunca vou esquecer. Organização, segurança e profissionalismo impecáveis."
            translate={t}
          />

          <TestimonialCard
            author="Julia Cortez"
            role="Jornalista"
            initials="JC"
            instagram="@juliacortez"
            avatarUrl="/avatars/julia.jpg"
            text="Roteiro cultural riquíssimo e muito bem explicado."
            fullText="Roteiro cultural riquíssimo e muito bem explicado. O guia demonstrou domínio total da história do Rio, tornando o passeio envolvente e educativo. Experiência de altíssimo nível."
            translate={t}
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
  instagram: string
  avatarUrl?: string
  text: string
  fullText: string
  translate: (key: string) => string
}

function TestimonialCard({
  author,
  role,
  initials,
  instagram,
  avatarUrl,
  text,
  fullText,
  translate: t,
}: TestimonialCardProps) {
  const [expanded, setExpanded] = useState(false)
  const canExpand = fullText.length > text.length

  return (
    <Card className="relative h-full overflow-hidden rounded-[28px] border-white/8 bg-[#0d2436] text-white shadow-[0_20px_55px_rgba(0,0,0,0.2)] transition-all duration-300 hover:-translate-y-1 hover:border-white/14 hover:shadow-[0_28px_70px_rgba(0,0,0,0.28)]">
      <div className="absolute right-5 top-4 select-none font-serif text-5xl leading-none text-white/8" aria-hidden="true">
        &quot;
      </div>

      <CardContent className="flex h-full flex-col justify-between p-6">
        <div className="space-y-3">
          <StarRating />

          <p className="text-sm leading-7 text-white/68">
            {expanded ? fullText : text}
          </p>

          {canExpand && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              aria-expanded={expanded}
              className="flex h-auto items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-[#d8c18f] transition-all duration-200 hover:bg-white/[0.05] hover:text-[#f0ddaf]"
            >
              {expanded ? t('readLess') : t('readMore')}
              <ChevronDown
                className={`size-4 transition-transform duration-200 ${expanded ? 'rotate-180' : ''
                  }`}
              />
            </Button>
          )}
        </div>

        <div className="mt-6 flex items-center gap-3 border-t border-white/8 pt-4">
          <Avatar className="size-11">
            {avatarUrl && (
              <AvatarImage
                src={avatarUrl}
                alt={author}
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            )}
            <AvatarFallback className="bg-white/8 font-semibold text-[#d8c18f]">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <p className="text-sm font-semibold leading-tight text-white">{author}</p>
            <p className="text-xs text-white/54">{role}</p>
            <p className="text-xs text-[#d8c18f]">{instagram}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
