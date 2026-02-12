import TripList from "@/components/trip-list";

export const metadata = {
  title: "Tours e Experiências | Rick Travel",
  description: "Escolha seu passeio no Rio de Janeiro. Cristo Redentor, Pão de Açúcar, Angra e muito mais.",
  openGraph: {
    title: "Tours e Experiências | Rick Travel",
    description: "Confira nossas opções de passeios no Rio de Janeiro.",
    url: "https://ricktravel.com.br/tours",
  },
};


export default function ToursPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold">Nossos tours</h1>
        <p className="mt-4 text-muted-foreground text-lg">
          Confira todos os passeios disponíveis e reserve sua experiência.
        </p>
      </div>

      <TripList />
    </main>
  );
}

