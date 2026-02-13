import TripList from "@/components/trip-list";
import { ToursHeader } from "@/components/tours-header";

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
      <ToursHeader />
      <TripList />
    </main>
  );
}
