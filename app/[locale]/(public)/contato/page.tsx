import { ShieldCheck, Clock3, MessageCircleMore, MapPin } from "lucide-react";
import { ContactForm } from "@/components/contact-form";

export const metadata = {
  title: 'Contato e Orçamento | Rick Travel',
  description:
    'Solicite orçamento para passeios no Rio de Janeiro com guias credenciados Cadastur. Entre em contato conosco.',
  openGraph: {
    title: 'Contato e Orçamento | Rick Travel',
    description: 'Solicite orçamento para passeios no Rio de Janeiro com guias credenciados Cadastur.',
    url: 'https://ricktravel.com.br/contato',
    siteName: 'Rick Travel',
    locale: 'pt_BR',
    type: 'website',
  },
}

const trustItems = [
  {
    icon: ShieldCheck,
    title: "Atendimento com operação credenciada",
    description: "Receba orientação para passeios e roteiros com equipe local e suporte humano.",
  },
  {
    icon: Clock3,
    title: "Resposta mais rápida e organizada",
    description: "Use o formulário para pedir orçamento, validar disponibilidade e alinhar detalhes.",
  },
  {
    icon: MessageCircleMore,
    title: "Contato para roteiro personalizado",
    description: "Ideal para famílias, grupos privados e viajantes que querem ajustar o passeio ao perfil da viagem.",
  },
];

export default function ContatoPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#071826] text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background:
            'radial-gradient(1200px 560px at 50% -10%, rgba(255,255,255,0.09), transparent 58%), linear-gradient(180deg, rgba(200,168,107,0.06) 0%, transparent 18%)',
        }}
      />

      <main className="relative z-10 mx-auto max-w-7xl px-5 pb-20 pt-28 lg:px-12 lg:pt-32">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_440px] lg:items-start">
          <section className="space-y-8">
            <div className="surface-dark-solid p-6 md:p-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#d8c18f]">
                <MessageCircleMore className="h-3.5 w-3.5" />
                Orçamento e atendimento
              </div>

              <h1 className="mt-6 max-w-[12ch] text-balance text-4xl font-semibold tracking-[-0.05em] text-white md:text-5xl">
                Fale com a Rick Travel sobre sua viagem no Rio
              </h1>

              <p className="mt-5 max-w-3xl text-[15px] leading-8 text-white/68 md:text-lg">
                Solicite orçamento, tire dúvidas sobre roteiros e receba apoio para montar uma experiência mais segura, organizada e personalizada com equipe local credenciada.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="chip-dark">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Guias credenciados
                </span>
                <span className="chip-dark">
                  <Clock3 className="h-3.5 w-3.5" />
                  Atendimento para orçamento e agenda
                </span>
                <span className="chip-dark">
                  <MapPin className="h-3.5 w-3.5" />
                  Rio de Janeiro com operação local
                </span>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {trustItems.map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.title} className="rounded-[24px] border border-white/8 bg-[#0d2436] p-5 shadow-[0_18px_45px_rgba(0,0,0,0.18)]">
                    <div className="inline-flex rounded-2xl border border-white/10 bg-white/[0.05] p-3 text-[#d8c18f]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h2 className="mt-4 text-lg font-semibold tracking-[-0.03em] text-white">{item.title}</h2>
                    <p className="mt-3 text-sm leading-7 text-white/62">{item.description}</p>
                  </div>
                );
              })}
            </div>

            <div className="rounded-[28px] border border-white/8 bg-[#0d2436] p-6 md:p-8">
              <h2 className="text-xl font-semibold tracking-[-0.03em] text-white">Quando usar esta página</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[22px] border border-white/8 bg-[#091d2c] px-4 py-4 text-sm leading-7 text-white/70">
                  Pedir orçamento para passeio privado, city tour ou pacote de vários dias.
                </div>
                <div className="rounded-[22px] border border-white/8 bg-[#091d2c] px-4 py-4 text-sm leading-7 text-white/70">
                  Confirmar detalhes antes de reservar, como formato do roteiro, agenda e atendimento.
                </div>
                <div className="rounded-[22px] border border-white/8 bg-[#091d2c] px-4 py-4 text-sm leading-7 text-white/70">
                  Ajustar a experiência para casal, família, grupo ou viagem com necessidades específicas.
                </div>
                <div className="rounded-[22px] border border-white/8 bg-[#091d2c] px-4 py-4 text-sm leading-7 text-white/70">
                  Receber contato da equipe para montar um plano mais alinhado ao seu perfil de viagem.
                </div>
              </div>
            </div>
          </section>

          <aside className="lg:sticky lg:top-24">
            <ContactForm />
          </aside>
        </div>
      </main>
    </div>
  );
}
