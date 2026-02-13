
import { prisma } from "@/lib/prisma";
import TripForm from "@/components/admin/trip-form";
import { notFound } from "next/navigation";

interface EditTripPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditTripPage({ params }: EditTripPageProps) {
    const { id } = await params;
    const trip = await prisma.trip.findUnique({
        where: { id },
    });

    if (!trip) {
        notFound();
    }

    // Serializar datas para passar para o Client Component se necessário,
    // mas o Next.js App Router serializa automaticamente objetos simples.
    // TripForm espera datas como strings ou Date objects que o JSON aceita.
    // Vamos garantir que seja passável.

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Editar Viagem</h1>
            <TripForm initialData={trip} />
        </div>
    );
}
