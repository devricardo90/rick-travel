import TripList from "@/components/trip-list";
import { ToursHeader } from "@/components/tours-header";
import { TourFilters } from "@/components/trips/tour-filters";

export const metadata = {
  title: "Tours e Experiências | Rick Travel",
  description: "Escolha seu passeio no Rio de Janeiro. Cristo Redentor, Pão de Açúcar, Angra e muito mais.",
  openGraph: {
    title: "Tours e Experiências | Rick Travel",
    description: "Confira nossas opções de passeios no Rio de Janeiro.",
    url: "https://ricktravel.com.br/tours",
  },
};

interface ToursPageProps {
  searchParams: Promise<{
    minPrice?: string;
    maxPrice?: string;
    duration?: string;
    level?: string;
    children?: string;
  }>;
}

export default async function ToursPage({ searchParams }: ToursPageProps) {
  const params = await searchParams;

  return (
    /* ── Wrapper premium dark — igual ao Quem Somos ─────── */
    <div className="relative min-h-screen bg-[#071A2B] text-white">

      {/* Radial highlight superior */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-60"
        style={{
          background:
            'radial-gradient(1200px 600px at 50% -10%, rgba(255,255,255,0.10), transparent 60%)',
        }}
      />

      <main className="relative z-10 mx-auto max-w-7xl px-6 pt-32 pb-20">
        <ToursHeader />

        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          {/* Sidebar de Filtros */}
          <aside className="w-full lg:w-1/4">
            <div className="sticky top-24">
              <TourFilters />
            </div>
          </aside>

          {/* Lista de Passeios */}
          <section className="w-full lg:w-3/4">
            <TripList searchParams={params} />
          </section>
        </div>
      </main>
    </div>
  );
}
