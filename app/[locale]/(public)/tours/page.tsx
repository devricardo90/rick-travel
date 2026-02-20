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
    <main className="mx-auto max-w-7xl px-6 pt-32 pb-20">
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
  );
}
