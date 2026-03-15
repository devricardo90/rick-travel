import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getLocalizedField } from "@/lib/localized-field";
import { Trash2, Calendar, Lock, LockOpen } from "lucide-react";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminSession } from "@/lib/authz";
import { isDomainError } from "@/lib/errors/domain-error";
import {
    createScheduleForTrip,
    deleteSchedule,
    listSchedulesWithOccupancy,
    updateScheduleStatus,
} from "@/lib/services/schedule.service";

function buildSchedulesPath(locale: string, tripId: string, params?: Record<string, string>) {
    const pathname = `/${locale}/admin/trips/${tripId}/schedules`;

    if (!params || Object.keys(params).length === 0) {
        return pathname;
    }

    const search = new URLSearchParams(params);
    return `${pathname}?${search.toString()}`;
}

async function ensureAdminOrRedirect(locale: string) {
    try {
        await requireAdminSession();
    } catch {
        redirect(`/${locale}/login`);
    }
}

async function deleteScheduleAction(id: string, tripId: string, locale: string) {
    "use server";

    await ensureAdminOrRedirect(locale);

    try {
        await deleteSchedule(id);
        revalidatePath(`/${locale}/admin/trips/${tripId}/schedules`);
        redirect(
            buildSchedulesPath(locale, tripId, {
                success: "Agenda removida com sucesso.",
            })
        );
    } catch (error) {
        if (isDomainError(error)) {
            redirect(buildSchedulesPath(locale, tripId, { error: error.message }));
        }

        throw error;
    }
}

async function updateScheduleStatusAction(formData: FormData) {
    "use server";

    const scheduleId = String(formData.get("scheduleId") || "");
    const tripId = String(formData.get("tripId") || "");
    const locale = String(formData.get("locale") || "");
    const status = String(formData.get("status") || "") as "OPEN" | "CLOSED";

    await ensureAdminOrRedirect(locale);

    try {
        await updateScheduleStatus(scheduleId, status);
        revalidatePath(`/${locale}/admin/trips/${tripId}/schedules`);
        redirect(
            buildSchedulesPath(locale, tripId, {
                success: status === "CLOSED" ? "Agenda fechada com sucesso." : "Agenda reaberta com sucesso.",
            })
        );
    } catch (error) {
        if (isDomainError(error)) {
            redirect(buildSchedulesPath(locale, tripId, { error: error.message }));
        }

        throw error;
    }
}

async function createScheduleAction(formData: FormData) {
    "use server";

    const tripId = formData.get("tripId") as string;
    const locale = formData.get("locale") as string;

    await ensureAdminOrRedirect(locale);

    try {
        const priceValue = (formData.get("price") as string | null)?.trim() ?? "";
        const parsedPrice = priceValue ? Math.round(parseFloat(priceValue) * 100) : null;

        await createScheduleForTrip({
            tripId,
            startAt: new Date(formData.get("startAt") as string),
            endAt: new Date(formData.get("endAt") as string),
            capacity: parseInt(formData.get("capacity") as string, 10),
            price: parsedPrice,
        });

        revalidatePath(`/${locale}/admin/trips/${tripId}/schedules`);
        redirect(
            buildSchedulesPath(locale, tripId, {
                success: "Agenda criada com sucesso.",
            })
        );
    } catch (error) {
        if (isDomainError(error)) {
            redirect(buildSchedulesPath(locale, tripId, { error: error.message }));
        }

        throw error;
    }
}

export default async function TripSchedulesPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string; locale: string }>;
    searchParams: Promise<{ error?: string; success?: string }>;
}) {
    const { id, locale } = await params;
    const { error, success } = await searchParams;

    const [trip, schedules] = await Promise.all([
        prisma.trip.findUnique({
            where: { id },
            select: {
                id: true,
                title: true,
                priceCents: true,
            },
        }),
        listSchedulesWithOccupancy(id),
    ]);

    if (!trip) return <div>Viagem nao encontrada.</div>;

    return (
        <div className="mx-auto max-w-5xl px-6 py-8">
            <div className="flex items-center gap-4 mb-8">
                <Link href={`/${locale}/admin/trips`} className="text-slate-500 hover:text-slate-800">
                    Voltar
                </Link>
                <h1 className="text-3xl font-bold">
                    Agenda: {getLocalizedField<string>(trip.title as Record<string, string> | string, "pt")}
                </h1>
            </div>

            {error ? (
                <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            ) : null}

            {success ? (
                <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {success}
                </div>
            ) : null}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-blue-600" />
                            Adicionar Data
                        </h2>
                        <form action={createScheduleAction} className="space-y-4">
                            <input type="hidden" name="tripId" value={id} />
                            <input type="hidden" name="locale" value={locale} />

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Inicio</label>
                                <input
                                    name="startAt"
                                    type="datetime-local"
                                    required
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Termino</label>
                                <input
                                    name="endAt"
                                    type="datetime-local"
                                    required
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Capacidade</label>
                                    <input
                                        name="capacity"
                                        type="number"
                                        min="1"
                                        defaultValue={20}
                                        required
                                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Preco (Opcional)</label>
                                    <input
                                        name="price"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder={(trip.priceCents / 100).toString()}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    />
                                </div>
                            </div>

                            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                                Criar Horario
                            </Button>
                        </form>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                                <tr>
                                    <th className="py-3 px-4">Data e Hora</th>
                                    <th className="py-3 px-4 text-center">Status</th>
                                    <th className="py-3 px-4 text-center">Ocupacao</th>
                                    <th className="py-3 px-4 text-center">Preco</th>
                                    <th className="py-3 px-4 text-right">Acoes</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {schedules.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-slate-500">
                                            Nenhuma data configurada para esta viagem.
                                        </td>
                                    </tr>
                                ) : (
                                    schedules.map((sch) => (
                                        <tr key={sch.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="py-3 px-4">
                                                <div className="font-medium text-slate-900">
                                                    {new Date(sch.startAt).toLocaleDateString("pt-BR", {
                                                        weekday: "short",
                                                        day: "2-digit",
                                                        month: "long",
                                                        year: "numeric",
                                                    })}
                                                </div>
                                                <div className="text-xs text-slate-500">
                                                    {new Date(sch.startAt).toLocaleTimeString("pt-BR", {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                    {" - "}
                                                    {sch.endAt
                                                        ? new Date(sch.endAt).toLocaleTimeString("pt-BR", {
                                                              hour: "2-digit",
                                                              minute: "2-digit",
                                                          })
                                                        : "--:--"}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                                        sch.status === "OPEN"
                                                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                                                            : "bg-slate-200 text-slate-800 dark:bg-slate-900/40 dark:text-slate-300"
                                                    }`}
                                                >
                                                    {sch.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                <div className="text-slate-900 font-medium">
                                                    {sch.usedCapacity}/{sch.capacity}
                                                </div>
                                                <div className="text-xs text-slate-500">
                                                    Restantes: {sch.remainingCapacity}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                <span className="text-blue-700 font-medium">
                                                    {new Intl.NumberFormat("pt-BR", {
                                                        style: "currency",
                                                        currency: "BRL",
                                                    }).format(sch.pricePerPersonCents / 100)}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <form action={updateScheduleStatusAction}>
                                                        <input type="hidden" name="scheduleId" value={sch.id} />
                                                        <input type="hidden" name="tripId" value={id} />
                                                        <input type="hidden" name="locale" value={locale} />
                                                        <input type="hidden" name="status" value={sch.status === "OPEN" ? "CLOSED" : "OPEN"} />
                                                        <button
                                                            type="submit"
                                                            className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs hover:bg-slate-50"
                                                        >
                                                            {sch.status === "OPEN" ? (
                                                                <>
                                                                    <Lock className="h-3.5 w-3.5" /> Fechar
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <LockOpen className="h-3.5 w-3.5" /> Reabrir
                                                                </>
                                                            )}
                                                        </button>
                                                    </form>

                                                    <form action={deleteScheduleAction.bind(null, sch.id, id, locale)}>
                                                        <button type="submit" className="text-red-500 hover:text-red-700 p-1">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </form>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
