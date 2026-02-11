
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quem Somos | Rick Travel",
  description: "Conheça a Rick Travel, especialistas em turismo receptivo no Rio de Janeiro. Guias credenciados Cadastur e roteiros personalizados.",
  openGraph: {
    title: "Quem Somos | Rick Travel",
    description: "Especialistas em turismo no Rio de Janeiro com guias credenciados.",
    url: "https://ricktravel.com.br/quem-somos",
  },
};

export default function QuemSomosPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-20 space-y-16">
      {/* Intro Section */}
      <section className="text-center space-y-8">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Quem Somos</h1>

        {/* Foto do Guia */}
        <div className="mx-auto relative w-full max-w-2xl aspect-video rounded-2xl overflow-hidden shadow-xl">
          <img
            src="/images/imagem-casal-pao-de-acucar.jpg"
            alt="Ricardo Guia de Turismo no Pão de Açúcar com turista"
            className="object-cover w-full h-full"
          />
        </div>

        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          A Rick Travel nasceu da paixão pelo Rio de Janeiro e do desejo de proporcionar experiências inesquecíveis aos nossos visitantes.
        </p>
      </section>

      {/* Mission/Vision/Values Grid */}
      <section className="grid gap-8 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="mb-2 text-xl font-semibold">Missão</h3>
          <p className="text-muted-foreground">
            Oferecer experiências turísticas seguras, autênticas e memoráveis, conectando pessoas à cultura e beleza do Rio de Janeiro.
          </p>
        </div>
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="mb-2 text-xl font-semibold">Visão</h3>
          <p className="text-muted-foreground">
            Ser referência em turismo receptivo no Rio, reconhecida pela excelência no atendimento e pela qualidade dos roteiros.
          </p>
        </div>
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="mb-2 text-xl font-semibold">Valores</h3>
          <ul className="list-disc list-inside text-muted-foreground text-left">
            <li>Segurança em primeiro lugar</li>
            <li>Pontualidade e compromisso</li>
            <li>Respeito à cultura local</li>
            <li>Excelência no atendimento</li>
          </ul>
        </div>
      </section>

      {/* Cadastur / Governance */}
      <section className="rounded-2xl bg-muted/50 p-8 md:p-12">
        <div className="md:flex md:items-center md:justify-between md:gap-8">
          <div className="space-y-4 md:w-2/3">
            <h2 className="text-3xl font-bold">Segurança e Certificação</h2>
            <p className="text-muted-foreground">
              Sua segurança é nossa prioridade. Todos os nossos guias são credenciados pelo Ministério do Turismo (Cadastur) e nossos veículos passam por rigorosas inspeções.
            </p>
            <p className="text-muted-foreground">
              Viaje tranquilo sabendo que você está em boas mãos.
            </p>
          </div>
          {/* Placeholder for Cadastur Seal/Image */}
          <div className="mt-6 flex justify-center md:mt-0 md:w-1/3">
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-background shadow-lg">
              <span className="font-bold text-primary">CADASTUR</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
