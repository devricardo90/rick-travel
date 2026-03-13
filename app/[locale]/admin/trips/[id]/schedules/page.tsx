import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getLocalizedField } from "@/lib/translation-service";
import { Trash2, Calendar, Users, DollarSign } from "lucide-react";
import { revalidatePath } from "next/cache";

async function deleteSchedule(id: string, tripId: string) {
    'use server';
    await prisma.tripSchedule.delete({ where: { id } });
    revalidatePath(`/admin/trips/${tripId}/schedules`);
}

async function createSchedule(formData: FormData) {
    'use server';
    const tripId = formData.get('tripId') as string;
    const startAt = new Date(formData.get('startAt') as string);
    const endAt = new Date(formData.get('endAt') as string);
    const capacity = parseInt(formData.get('capacity') as string);
    const priceCents = parseFloat(formData.get('price') as string) * 100;

    await prisma.tripSchedule.create({
        data: {
            tripId,
            startAt,
            endAt,
            capacity,
            priceCents,
        }
    });
    revalidatePath(`/admin/trips/${tripId}/schedules`);
}

export default async function TripSchedulesPage({
    params
}: {
    params: Promise<{ id: string, locale: string }>
}) {
    const { id, locale } = await params;
    
    const trip = await prisma.trip.findUnique({
        where: { id },
        include: {
            schedules: {
                orderBy: { startAt: 'asc' }
            }
        }
    });

    if (!trip) return <div>Viagem não encontrada.</div>;

    return (
        <div className="mx-auto max-w-5xl px-6 py-8">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/trips" className="text-slate-500 hover:text-slate-800">
                    ← Voltar
                </Link>
                <h1 className="text-3xl font-bold">
                    Agenda: {getLocalizedField<string>(trip.title, 'pt')}
                </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Formulário de Nova Data */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-blue-600" />
                            Adicionar Data
                        </h2>
                        <form action={createSchedule} className="space-y-4">
                            <input type="hidden" name="tripId" value={id} />
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Início</label>
                                <input name="startAt" type="datetime-local" required className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm" />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Término</label>
                                <input name="endAt" type="datetime-local" required className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Capacidade</label>
                                    <input name="capacity" type="number" defaultValue={20} required className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Preço (Opcional)</label>
                                    <input name="price" type="number" step="0.01" placeholder={(trip.priceCents / 100).toString()} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm" />
                                </div>
                            </div>

                            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                                Criar Horário
                            </Button>
                        </form>
                    </div>
                </div>

                {/* Listagem de Datas */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                                <tr>
                                    <th className="py-3 px-4">Data e Hora</th>
                                    <th className="py-3 px-4 text-center">Vagas</th>
                                    <th className="py-3 px-4 text-center">Preço</th>
                                    <th className="py-3 px-4 text-right">Ação</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {trip.schedules.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="py-12 text-center text-slate-500">
                                            Nenhuma data configurada para esta viagem.
                                        </td>
                                    </tr>
                                ) : (
                                    trip.schedules.map((sch) => (
                                        <tr key={sch.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="py-3 px-4">
                                                <div className="font-medium text-slate-900">
                                                    {new Date(sch.startAt).toLocaleDateString("pt-BR", {
                                                        weekday: 'short',
                                                        day: '2-digit',
                                                        month: 'long',
                                                        year: 'numeric'
                                                    })}
                                                </div>
                                                <div className="text-xs text-slate-500">
                                                    {new Date(sch.startAt).toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })} 
                                                    - 
                                                    {new Date(sch.endAt).toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                <span className="inline-flex items-center gap-1 text-slate-700">
                                                    <Users className="w-3 h-3" /> {sch.capacity}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                <span className="text-blue-700 font-medium">
                                                    {new Intl.NumberFormat("pt-BR", {
                                                        style: "currency",
                                                        currency: "BRL",
                                                    }).format(sch.priceCents / 100)}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <form action={deleteSchedule.bind(null, sch.id, id)}>
                                                    <button type="submit" className="text-red-500 hover:text-red-700 p-1">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </form>
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
