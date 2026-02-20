import { OurStory } from '@/components/about/our-story'
import { MissionVisionValues } from '@/components/about/mission-vision-values'
import { SecuritySection } from '@/components/about/security-section'

export default function QuemSomosPage() {
  return (
    /* ── Wrapper premium dark ───────────────────────────── */
    <div className="relative min-h-screen bg-[#071A2B] text-white">

      {/* Radial highlight superior — efeito "produto premium" */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-60"
        style={{
          background:
            'radial-gradient(1200px 600px at 50% -10%, rgba(255,255,255,0.10), transparent 60%)',
        }}
      />

      {/* Conteúdo */}
      <main className="relative z-10 pt-32 pb-20">
        {/* 1. Nossa História */}
        <OurStory />

        {/* 2. Missão • Visão • Valores */}
        <MissionVisionValues />

        {/* 3. Segurança e Certificação */}
        <SecuritySection />
      </main>
    </div>
  )
}
