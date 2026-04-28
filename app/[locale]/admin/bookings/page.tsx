import { getBookingsAction } from "@/app/actions/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLocalizedField } from "@/lib/localized-field";

/**
 * RT-013C: Admin Bookings Read-Only
 * Página para listagem de todas as reservas do sistema.
 */
export default async function AdminBookingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  let bookings = [];
  
  try {
    bookings = await getBookingsAction();
  } catch {
    return (
      <div className="p-6">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Erro ao carregar reservas</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Nao foi possivel carregar a lista de reservas. Verifique suas permissoes.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Reservas</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todas as Reservas (Somente Leitura)</CardTitle>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <p className="text-muted-foreground">Nenhuma reserva encontrada.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b text-left">
                    <th className="py-3 px-4 font-semibold">ID</th>
                    <th className="py-3 px-4 font-semibold">Cliente</th>
                    <th className="py-3 px-4 font-semibold">Viagem</th>
                    <th className="py-3 px-4 font-semibold">Data</th>
                    <th className="py-3 px-4 font-semibold">Hospedes</th>
                    <th className="py-3 px-4 font-semibold">Total</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4 font-mono text-[10px] text-muted-foreground" title={booking.id}>
                        {booking.id.substring(0, 8)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-sm">{booking.user.name}</div>
                        <div className="text-[10px] text-muted-foreground">{booking.user.email}</div>
                      </td>
                      <td className="py-3 px-4 text-xs">
                        {getLocalizedField<string>(booking.trip.title as Record<string, string>, locale)}
                      </td>
                      <td className="py-3 px-4 text-xs">
                        {booking.schedule?.startAt 
                          ? new Date(booking.schedule.startAt).toLocaleDateString(locale)
                          : "A definir"}
                      </td>
                      <td className="py-3 px-4 text-center text-xs">{booking.guestCount}</td>
                      <td className="py-3 px-4 text-xs font-medium">
                        {(booking.totalPriceCents / 100).toLocaleString(locale, {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium uppercase ${
                          booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                          booking.status === 'CANCELED' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
