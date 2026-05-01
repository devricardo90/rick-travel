import type { Metadata } from "next";
import TripList from "@/components/trip-list";
import { ToursHeader } from "@/components/tours-header";

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
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    search?: string;
  }>;
}

export default async function ToursPage({ params, searchParams }: ToursPageProps) {
  const [{ locale }, query] = await Promise.all([params, searchParams]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#071826] text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background:
            "radial-gradient(1200px 560px at 50% -8%, rgba(255,255,255,0.09), transparent 58%), linear-gradient(180deg, rgba(200,168,107,0.06) 0%, transparent 18%)",
        }}
      />

      <main className="relative z-10 mx-auto max-w-7xl px-5 pb-20 pt-28 lg:px-12 lg:pt-32">
        <ToursHeader />

        <div className="mt-10">
          <section className="min-w-0">
            <TripList searchParams={query} locale={locale} />
          </section>
        </div>
      </main>
    </div>
  );
}
