
import { TripList } from "./trip-list";
import { MyBookings } from "./my-bookings";

export function ReservationsSection() {
  return (
    <section id="reservas" className="mx-auto max-w-7xl px-6 py-20 lg:px-12">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold tracking-tight">Reserve seu passeio</h2>
        <p className="mt-3 text-muted-foreground">
          Escolha uma experiência e garanta sua vaga com poucos cliques.
        </p>
      </div>

      <div className="mb-10">
        <h3 className="mb-4 text-xl font-semibold">Minhas reservas</h3>
        <MyBookings />
      </div>

      <div>
        <h3 className="mb-4 text-xl font-semibold">Passeios disponíveis</h3>
        <TripList />
      </div>
    </section>
  );
}
