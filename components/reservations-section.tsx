
import { TripList } from './trip-list'

export function ReservationsSection() {
  return (
    <section id="reservas" className="mx-auto max-w-7xl px-6 py-20 lg:px-12">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold tracking-tight">Reserve seu passeio</h2>
        <p className="mt-3 text-muted-foreground">
          Escolha uma experiência e garanta sua vaga com poucos cliques.
        </p>
      </div>

      <TripList />
    </section>
  )
}
