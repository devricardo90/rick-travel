
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, MapPin, Users, Clock, CheckCircle2, ChevronLeft } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { TourActions } from "@/components/trips/tour-actions";
import { TourDetailClient } from "@/components/trips/tour-detail-client";

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata(props: PageProps) {
    const params = await props.params;
    const trip = await prisma.trip.findUnique({
        where: { id: params.id },
        select: { title: true, description: true, imageUrl: true },
    });

    if (!trip) {
        return {
            title: "Tour not found | Rick Travel",
        };
    }

    return {
        title: `${trip.title} | Rick Travel`,
        description: trip.description || `Reserve your spot on ${trip.title}`,
        openGraph: {
            title: trip.title,
            description: trip.description,
            images: trip.imageUrl ? [trip.imageUrl] : [],
        },
    };
}

export default async function TourDetailsPage(props: PageProps) {
    const params = await props.params;
    const trip = await prisma.trip.findUnique({
        where: { id: params.id },
    });

    if (!trip) {
        notFound();
    }

    const startDate = trip.startDate ? trip.startDate : null;
    const endDate = trip.endDate ? trip.endDate : null;

    return (
        <TourDetailClient trip={trip} startDate={startDate} endDate={endDate} />
    );
}
