import { OurStory } from '@/components/about/our-story'
import { MissionVisionValues } from '@/components/about/mission-vision-values'
import { SecuritySection } from '@/components/about/security-section'

export default function QuemSomosPage() {
  return (
    <main className="min-h-screen pt-32 pb-20">
      {/* 1. Nossa História - Início direto */}
      <OurStory />

      {/* 2. Missão • Visão • Valores */}
      <MissionVisionValues />

      {/* 3. Segurança e Certificação */}
      <SecuritySection />
    </main>
  )
}
