import { listAllTrips } from "@/lib/services/trip.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function formatCurrency(cents: number) {
  return (cents / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export default async function AdminToursPage() {
  const tours = await listAllTrips();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gerenciamento de Tours</h2>
          <p className="text-muted-foreground">
            Visualize todos os pacotes e passeios cadastrados no sistema.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todos os Tours (Somente Leitura)</CardTitle>
        </CardHeader>
        <CardContent>
          {tours.length === 0 ? (
            <p className="text-muted-foreground">Nenhum tour cadastrado.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b text-left">
                    <th className="py-3 px-4 font-semibold">Título (PT)</th>
                    <th className="py-3 px-4 font-semibold">Cidade</th>
                    <th className="py-3 px-4 font-semibold">Preço Base</th>
                    <th className="py-3 px-4 font-semibold">Agendas</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold text-right">ID</th>
                  </tr>
                </thead>
                <tbody>
                  {tours.map((tour) => {
                    const titleObj = tour.title as Record<string, string>;
                    const titlePt = titleObj?.pt || "Sem título";

                    return (
                      <tr key={tour.id} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4 font-medium">{titlePt}</td>
                        <td className="py-3 px-4">{tour.city}</td>
                        <td className="py-3 px-4">{formatCurrency(tour.priceCents)}</td>
                        <td className="py-3 px-4 text-xs">
                          <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold">
                            {tour._count.schedules} {tour._count.schedules === 1 ? "agenda" : "agendas"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {tour.isPublished ? (
                            <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium uppercase bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                              Publicado
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium uppercase bg-muted text-muted-foreground">
                              Rascunho
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right text-[10px] font-mono text-muted-foreground">
                          {tour.id}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
