import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TourDetailClient } from "@/components/trips/tour-detail-client";
import { getLocalizedField } from "@/lib/localized-field";
import { asLocalizedList, asLocalizedText } from "@/lib/types";

interface PageProps {
    params: Promise<{ id: string; locale: string }>;
}

type PublicTourSchedule = {
    id: string;
    startAt: Date;
    endAt: Date | null;
    capacity: number;
    pricePerPersonCents: number;
};

export async function generateMetadata(props: PageProps): Promise<Metadata> {
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

    const localizedTitle = getLocalizedField<string>(asLocalizedText(trip.title), params.locale);
    const localizedDescription = getLocalizedField<string>(asLocalizedText(trip.description), params.locale);

    return {
        title: `${localizedTitle} | Rick Travel`,
        description: localizedDescription || `Reserve your spot on ${localizedTitle}`,
        alternates: {
            canonical: `/${params.locale}/tours/${params.id}`,
        },
        openGraph: {
            title: localizedTitle,
            description: localizedDescription,
            url: `/${params.locale}/tours/${params.id}`,
            images: trip.imageUrl ? [trip.imageUrl] : [],
        },
        twitter: {
            title: localizedTitle,
            description: localizedDescription || `Reserve your spot on ${localizedTitle}`,
            images: trip.imageUrl ? [trip.imageUrl] : [],
        },
    };
}

export default async function TourDetailsPage(props: PageProps) {
    const params = await props.params;
    const trip = await prisma.trip.findUnique({
        where: { id: params.id },
        include: {
            schedules: {
                where: { status: "OPEN" },
                orderBy: { startAt: "asc" },
                select: {
                    id: true,
                    startAt: true,
                    endAt: true,
                    capacity: true,
                    pricePerPersonCents: true,
                },
            },
        },
    });

    if (!trip) {
        notFound();
    }

    const startDate = trip.startDate ? trip.startDate : null;

    const schedules = trip.schedules.map((schedule: PublicTourSchedule) => ({
        ...schedule,
        startAt: schedule.startAt.toISOString(),
        endAt: schedule.endAt?.toISOString() ?? null,
    }));

    return (
        <TourDetailClient
            trip={{
                ...trip,
                title: asLocalizedText(trip.title) ?? "",
                description: asLocalizedText(trip.description),
                highlights: asLocalizedList(trip.highlights),
            }}
            startDate={startDate}
            schedules={schedules}
        />
    );
}
