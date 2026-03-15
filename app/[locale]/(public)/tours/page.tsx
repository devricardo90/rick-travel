import type { Metadata } from "next";
import TripList from "@/components/trip-list";
import { ToursHeader } from "@/components/tours-header";
import { TourFilters } from "@/components/trips/tour-filters";

function getToursMetadataCopy(locale: string) {
  switch (locale) {
    case "en":
      return {
        title: "Tours in Rio de Janeiro | Rick Travel",
        description: "Compare guided tours, schedules and premium experiences in Rio de Janeiro.",
      };
    case "es":
      return {
        title: "Tours en Rio de Janeiro | Rick Travel",
        description: "Compara tours guiados, fechas y experiencias premium en Rio de Janeiro.",
      };
    case "sv":
      return {
        title: "Turer i Rio de Janeiro | Rick Travel",
        description: "Jamfor guidade turer, datum och premiumupplevelser i Rio de Janeiro.",
      };
    default:
      return {
        title: "Tours e experiencias no Rio | Rick Travel",
        description: "Compare passeios guiados, datas e experiencias premium no Rio de Janeiro.",
      };
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const copy = getToursMetadataCopy(locale);
  const path = `/${locale}/tours`;

  return {
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: copy.title,
      description: copy.description,
      url: path,
    },
  };
}

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
    <div className="relative min-h-screen bg-[#071A2B] text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(1200px 600px at 50% -10%, rgba(255,255,255,0.10), transparent 60%)",
        }}
      />

      <main className="relative z-10 mx-auto max-w-7xl px-6 pb-20 pt-32">
        <ToursHeader />

        <div className="mt-8 flex flex-col gap-8 lg:flex-row">
          <aside className="w-full lg:w-1/4">
            <div className="sticky top-24">
              <TourFilters />
            </div>
          </aside>

          <section className="w-full lg:w-3/4">
            <TripList searchParams={params} />
          </section>
        </div>
      </main>
    </div>
  );
}
