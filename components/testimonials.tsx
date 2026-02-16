
'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function Testimonials() {
  const t = useTranslations('HomePage.Testimonials');
  return (
    <section className="section-spacing">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center space-y-4">
          <h2 className="heading-2">
            {t('title')}
          </h2>
          <p className="body-base text-muted-foreground">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
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
    <Card className="h-full rounded-2xl border bg-background/60 shadow-sm card-hover">
      <CardContent className="flex h-full flex-col justify-between p-6">
        <div className="space-y-3">
          <p className="text-sm leading-relaxed text-muted-foreground">
            {expanded ? fullText : text}
          </p>

          {canExpand && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              aria-expanded={expanded}
              className="h-auto px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10 hover:text-primary rounded-md transition-all duration-200 flex items-center gap-1"
            >
              {expanded ? t('readLess') : t('readMore')}
              <ChevronDown
                className={`size-4 transition-transform duration-200 ${expanded ? 'rotate-180' : ''
                  }`}
              />
            </Button>
          )}
        </div>

        <div className="mt-6 flex items-center gap-3 border-t pt-4">
          <Avatar className="size-11">
            {avatarUrl && (
              <AvatarImage
                src={avatarUrl}
                alt={author}
                onError={(e) => {
                  // Fallback to initials on image load error
                  e.currentTarget.style.display = 'none'
                }}
              />
            )}
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <p className="text-sm font-medium leading-tight">{author}</p>
            <p className="text-xs text-muted-foreground">{role}</p>
            <p className="text-xs text-primary">{instagram}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
