import { notFound } from "next/navigation";
import Link from "next/link";
import { getBookingByIdAction } from "@/app/actions/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLocalizedField } from "@/lib/localized-field";
import { ArrowLeft } from "lucide-react";

/**
 * RT-013G: Admin Booking Detail Read-Only
 * Página de detalhe de uma reserva individual — somente leitura.
 */
export default async function AdminBookingDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;

  let booking: Awaited<ReturnType<typeof getBookingByIdAction>>;

  try {
    booking = await getBookingByIdAction(id);
  } catch {
    return (
      <div className="space-y-4">
        <Link
          href={`/${locale}/admin/bookings`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Reservas
        </Link>
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Erro ao carregar reserva</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Nao foi possivel carregar os dados da reserva. Verifique suas permissoes.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!booking) {
    notFound();
  }

  const tripTitle = getLocalizedField<string>(
    booking.trip.title as Record<string, string>,
    locale
  );

  const statusColors: Record<string, string> = {
    CONFIRMED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    CANCELED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  };

  const paymentStatusColors: Record<string, string> = {
    PAID: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    REFUNDED: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    PARTIAL: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
    UNPAID: "bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-400",
  };

  const paymentAttemptStatusColors: Record<string, string> = {
    SUCCEEDED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    FAILED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    CANCELED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    CREATED: "bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-400",
    REFUNDED: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href={`/${locale}/admin/bookings`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Reservas
        </Link>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Detalhe da Reserva</h1>
          <p className="text-xs text-muted-foreground font-mono mt-1">{booking.id}</p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold uppercase ${
              statusColors[booking.status] ?? statusColors.PENDING
            }`}
          >
            {booking.status}
          </span>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold uppercase ${
              paymentStatusColors[booking.paymentStatus] ?? paymentStatusColors.UNPAID
            }`}
          >
            {booking.paymentStatus}
          </span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Cliente */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <span className="text-muted-foreground text-xs">Nome</span>
              <p className="font-medium">{booking.user.name}</p>
            </div>
            <div>
              <span className="text-muted-foreground text-xs">E-mail</span>
              <p>{booking.user.email}</p>
            </div>
          </CardContent>
        </Card>

        {/* Viagem */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Viagem</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <span className="text-muted-foreground text-xs">Titulo</span>
              <p className="font-medium">{tripTitle}</p>
            </div>
            <div>
              <span className="text-muted-foreground text-xs">Cidade</span>
              <p>{booking.trip.city}</p>
            </div>
            {booking.trip.location && (
              <div>
                <span className="text-muted-foreground text-xs">Localizacao</span>
                <p>{booking.trip.location}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reserva */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Dados da Reserva</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <span className="text-muted-foreground text-xs">Hospedes</span>
              <p className="font-medium">{booking.guestCount}</p>
            </div>
            <div>
              <span className="text-muted-foreground text-xs">Total</span>
              <p className="font-medium">
                {(booking.totalPriceCents / 100).toLocaleString(locale, {
                  style: "currency",
                  currency: "BRL",
                })}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground text-xs">Criado em</span>
              <p>
                {new Date(booking.createdAt).toLocaleDateString(locale, {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground text-xs">Atualizado em</span>
              <p>
                {new Date(booking.updatedAt).toLocaleDateString(locale, {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Agenda */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Agenda</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {!booking.schedule ? (
              <p className="text-muted-foreground">Sem data especifica agendada.</p>
            ) : (
              <>
                <div>
                  <span className="text-muted-foreground text-xs">Inicio</span>
                  <p className="font-medium">
                    {new Date(booking.schedule.startAt).toLocaleDateString(locale, {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </p>
                </div>
                {booking.schedule.endAt && (
                  <div>
                    <span className="text-muted-foreground text-xs">Fim</span>
                    <p>
                      {new Date(booking.schedule.endAt).toLocaleDateString(locale, {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                )}
                <div>
                  <span className="text-muted-foreground text-xs">Capacidade da agenda</span>
                  <p>{booking.schedule.capacity}</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs">Preco por pessoa (agenda)</span>
                  <p>
                    {(booking.schedule.pricePerPersonCents / 100).toLocaleString(locale, {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs">Status da agenda</span>
                  <p className="uppercase font-medium">{booking.schedule.status}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tentativas de Pagamento */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tentativas de Pagamento</CardTitle>
        </CardHeader>
        <CardContent>
          {booking.paymentAttempts.length === 0 ? (
            <p className="text-muted-foreground text-sm">Nenhuma tentativa de pagamento registrada.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b text-left">
                    <th className="py-2 px-3 font-semibold text-xs">ID</th>
                    <th className="py-2 px-3 font-semibold text-xs">Provedor</th>
                    <th className="py-2 px-3 font-semibold text-xs">Status</th>
                    <th className="py-2 px-3 font-semibold text-xs">Valor</th>
                    <th className="py-2 px-3 font-semibold text-xs">Pago em</th>
                    <th className="py-2 px-3 font-semibold text-xs">Criado em</th>
                  </tr>
                </thead>
                <tbody>
                  {booking.paymentAttempts.map((attempt) => (
                    <tr key={attempt.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="py-2 px-3 font-mono text-[10px] text-muted-foreground">
                        {attempt.id.substring(0, 8)}
                      </td>
                      <td className="py-2 px-3 text-xs uppercase">{attempt.provider}</td>
                      <td className="py-2 px-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium uppercase ${
                            paymentAttemptStatusColors[attempt.status] ?? ""
                          }`}
                        >
                          {attempt.status}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-xs">
                        {(attempt.amountCents / 100).toLocaleString(locale, {
                          style: "currency",
                          currency: attempt.currency,
                        })}
                      </td>
                      <td className="py-2 px-3 text-xs text-muted-foreground">
                        {attempt.paidAt
                          ? new Date(attempt.paidAt).toLocaleDateString(locale, {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "—"}
                      </td>
                      <td className="py-2 px-3 text-xs text-muted-foreground">
                        {new Date(attempt.createdAt).toLocaleDateString(locale, {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Logs de E-mail */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Logs de E-mail</CardTitle>
        </CardHeader>
        <CardContent>
          {booking.emailLogs.length === 0 ? (
            <p className="text-muted-foreground text-sm">Nenhum e-mail registrado para esta reserva.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b text-left">
                    <th className="py-2 px-3 font-semibold text-xs">Template</th>
                    <th className="py-2 px-3 font-semibold text-xs">Status</th>
                    <th className="py-2 px-3 font-semibold text-xs">Enviado em</th>
                    <th className="py-2 px-3 font-semibold text-xs">Criado em</th>
                  </tr>
                </thead>
                <tbody>
                  {booking.emailLogs.map((log) => (
                    <tr key={log.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="py-2 px-3 text-xs uppercase">{log.template}</td>
                      <td className="py-2 px-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium uppercase ${
                            log.status === "SENT"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : log.status === "FAILED"
                              ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                              : "bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-400"
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-xs text-muted-foreground">
                        {log.sentAt
                          ? new Date(log.sentAt).toLocaleDateString(locale, {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "—"}
                      </td>
                      <td className="py-2 px-3 text-xs text-muted-foreground">
                        {new Date(log.createdAt).toLocaleDateString(locale, {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
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
