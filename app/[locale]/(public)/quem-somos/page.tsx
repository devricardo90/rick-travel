import { ShieldCheck, MapPin, BadgeCheck } from 'lucide-react'
import { OurStory } from '@/components/about/our-story'
import { MissionVisionValues } from '@/components/about/mission-vision-values'
import { SecuritySection } from '@/components/about/security-section'

export default function QuemSomosPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#071826] text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background:
            'radial-gradient(1200px 560px at 50% -8%, rgba(255,255,255,0.09), transparent 58%), linear-gradient(180deg, rgba(200,168,107,0.06) 0%, transparent 18%)',
        }}
      />

      <main className="relative z-10 pb-20 pt-28 lg:pt-32">
        <section className="mx-auto max-w-7xl px-5 lg:px-12">
          <div className="surface-dark-solid p-6 md:p-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#d8c18f]">
              <ShieldCheck className="h-3.5 w-3.5" />
              Operação local e credenciada
            </div>

            <h1 className="mt-6 max-w-[12ch] text-balance text-4xl font-semibold tracking-[-0.05em] text-white md:text-5xl">
              Quem somos e como conduzimos cada experiência
            </h1>

            <p className="mt-5 max-w-3xl text-[15px] leading-8 text-white/68 md:text-lg">
              A Rick Travel atua com foco em atendimento humano, operação organizada e passeios guiados com mais clareza, segurança e atenção aos detalhes para quem visita o Rio de Janeiro.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="chip-dark">
                <MapPin className="h-3.5 w-3.5" />
                Rio de Janeiro com equipe local
              </span>
              <span className="chip-dark">
                <ShieldCheck className="h-3.5 w-3.5" />
                Guias credenciados e operação regular
              </span>
              <span className="chip-dark">
                <BadgeCheck className="h-3.5 w-3.5" />
                Experiência mais organizada e confiável
              </span>
            </div>
          </div>
        </section>

        <OurStory />
        <MissionVisionValues />
        <SecuritySection />
      </main>
    </div>
  )
}
