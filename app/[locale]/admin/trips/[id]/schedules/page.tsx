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

function scheduleStatusClass(status: "OPEN" | "CLOSED") {
    return status === "OPEN"
        ? "border-emerald-400/18 bg-emerald-500/10 text-emerald-200"
        : "border-slate-300/14 bg-slate-400/10 text-slate-200";
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

    if (!trip) {
        return <div className="mx-auto max-w-5xl px-6 py-8 text-white/72">Viagem nao encontrada.</div>;
    }

    const tripTitle = getLocalizedField<string>(trip.title as Record<string, string> | string, "pt");

    return (
        <div className="mx-auto max-w-6xl px-6 py-8 md:py-10">
            <div className="mb-8 rounded-[30px] border border-white/8 bg-[#0d2436] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.22)] md:p-8">
                <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                    <div>
                        <Link
                            href={`/${locale}/admin/trips`}
                            className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/58 transition-colors hover:bg-white/[0.08] hover:text-white"
                        >
                            Voltar para viagens
                        </Link>
                        <h1 className="mt-6 text-4xl font-semibold tracking-[-0.05em] text-white md:text-5xl">
                            Agenda: {tripTitle}
                        </h1>
                        <p className="mt-4 max-w-3xl text-[15px] leading-8 text-white/64 md:text-lg">
                            Configure datas, capacidade e disponibilidade do passeio com uma leitura mais organizada para controle operacional.
                        </p>
                    </div>

                    <div className="rounded-[24px] border border-white/8 bg-[#091d2c] px-5 py-4">
                        <div className="text-[11px] uppercase tracking-[0.14em] text-white/44">Preco base</div>
                        <div className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
                            {new Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                            }).format(trip.priceCents / 100)}
                        </div>
                    </div>
                </div>
            </div>

            {error ? (
                <div className="mb-6 rounded-[22px] border border-red-400/20 bg-red-500/10 px-5 py-4 text-sm text-red-100">
                    {error}
                </div>
            ) : null}

            {success ? (
                <div className="mb-6 rounded-[22px] border border-emerald-400/20 bg-emerald-500/10 px-5 py-4 text-sm text-emerald-100">
                    {success}
                </div>
            ) : null}

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[360px_minmax(0,1fr)]">
                <div>
                    <div className="rounded-[28px] border border-white/8 bg-[#0d2436] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.22)]">
                        <h2 className="flex items-center gap-2 text-lg font-semibold tracking-[-0.03em] text-white">
                            <Calendar className="h-5 w-5 text-[#d8c18f]" />
                            Adicionar data
                        </h2>
                        <p className="mt-3 text-sm leading-7 text-white/56">
                            Cadastre um novo horario com capacidade e preco opcional sobrescrito para esta agenda.
                        </p>

                        <form action={createScheduleAction} className="mt-5 space-y-4">
                            <input type="hidden" name="tripId" value={id} />
                            <input type="hidden" name="locale" value={locale} />

                            <div>
                                <label className="mb-2 block text-sm font-medium text-white/74">Inicio</label>
                                <input
                                    name="startAt"
                                    type="datetime-local"
                                    required
                                    className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition-colors hover:bg-white/[0.06] focus:border-white/18"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-white/74">Termino</label>
                                <input
                                    name="endAt"
                                    type="datetime-local"
                                    required
                                    className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition-colors hover:bg-white/[0.06] focus:border-white/18"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-white/74">Capacidade</label>
                                    <input
                                        name="capacity"
                                        type="number"
                                        min="1"
                                        defaultValue={20}
                                        required
                                        className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition-colors hover:bg-white/[0.06] focus:border-white/18"
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-white/74">Preco</label>
                                    <input
                                        name="price"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder={(trip.priceCents / 100).toString()}
                                        className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition-colors placeholder:text-white/34 hover:bg-white/[0.06] focus:border-white/18"
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="h-12 w-full rounded-2xl bg-[#123a28] text-sm font-semibold text-white transition-colors hover:bg-[#184731]"
                            >
                                Criar horario
                            </Button>
                        </form>
                    </div>
                </div>

                <div>
                    <div className="overflow-hidden rounded-[28px] border border-white/8 bg-[#0d2436] shadow-[0_20px_60px_rgba(0,0,0,0.22)]">
                        <div className="hidden grid-cols-[1.2fr_0.7fr_0.9fr_0.65fr_0.85fr] gap-4 border-b border-white/8 px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40 md:grid">
                            <div>Data e hora</div>
                            <div className="text-center">Status</div>
                            <div className="text-center">Ocupacao</div>
                            <div className="text-center">Preco</div>
                            <div className="text-right">Acoes</div>
                        </div>

                        {schedules.length === 0 ? (
                            <div className="px-5 py-12 text-center text-sm text-white/56">
                                Nenhuma data configurada para esta viagem.
                            </div>
                        ) : (
                            <div className="divide-y divide-white/8">
                                {schedules.map((sch) => (
                                    <div
                                        key={sch.id}
                                        className="grid gap-5 px-5 py-5 transition-colors hover:bg-white/[0.02] md:grid-cols-[1.2fr_0.7fr_0.9fr_0.65fr_0.85fr] md:items-center"
                                    >
                                        <div>
                                            <div className="font-medium text-white">
                                                {new Date(sch.startAt).toLocaleDateString("pt-BR", {
                                                    weekday: "short",
                                                    day: "2-digit",
                                                    month: "long",
                                                    year: "numeric",
                                                })}
                                            </div>
                                            <div className="mt-1 text-xs text-white/46">
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
                                        </div>

                                        <div className="md:text-center">
                                            <span
                                                className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${scheduleStatusClass(sch.status)}`}
                                            >
                                                {sch.status}
                                            </span>
                                        </div>

                                        <div className="md:text-center">
                                            <div className="font-medium text-white">
                                                {sch.usedCapacity}/{sch.capacity}
                                            </div>
                                            <div className="mt-1 text-xs text-white/46">
                                                Restantes: {sch.remainingCapacity}
                                            </div>
                                        </div>

                                        <div className="text-sm font-medium text-white md:text-center">
                                            {new Intl.NumberFormat("pt-BR", {
                                                style: "currency",
                                                currency: "BRL",
                                            }).format(sch.pricePerPersonCents / 100)}
                                        </div>

                                        <div className="flex justify-start gap-2 md:justify-end">
                                            <form action={updateScheduleStatusAction}>
                                                <input type="hidden" name="scheduleId" value={sch.id} />
                                                <input type="hidden" name="tripId" value={id} />
                                                <input type="hidden" name="locale" value={locale} />
                                                <input type="hidden" name="status" value={sch.status === "OPEN" ? "CLOSED" : "OPEN"} />
                                                <button
                                                    type="submit"
                                                    className="inline-flex h-9 items-center gap-1 rounded-2xl border border-white/10 bg-white/[0.04] px-3 text-xs font-medium text-white/72 transition-colors hover:bg-white/[0.08] hover:text-white"
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
                                                <button
                                                    type="submit"
                                                    className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-red-400/18 bg-red-500/10 text-red-200 transition-colors hover:bg-red-500/16 hover:text-red-100"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
