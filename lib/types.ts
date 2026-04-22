import { PhysicalLevel } from "@prisma/client";

export type JsonValue = string | number | boolean | null | { [key: string]: JsonValue } | JsonValue[];

export type LocalizedText = Record<string, string>;
export type LocalizedList = Record<string, string[]>;

export type TripFormDataLike = {
    id?: string;
    title?: string | LocalizedText | null;
    titleTranslations?: LocalizedText | null;
    city?: string;
    location?: string | null;
    description?: string | LocalizedText | null;
    descriptionTranslations?: LocalizedText | null;
    priceCents?: number;
    imageUrl?: string | null;
    startDate?: string | Date | null;
    endDate?: string | Date | null;
    maxGuests?: number | null;
    highlights?: string | string[] | LocalizedList | null;
    highlightsTranslations?: LocalizedList | null;
    isPublished?: boolean;
};

export type TripCardData = {
    id: string;
    title: LocalizedText | string;
    city: string;
    location?: string | null;
    description?: LocalizedText | string | null;
    priceCents: number;
    imageUrl?: string | null;
    startDate?: Date | string | null;
    endDate?: Date | string | null;
    maxGuests?: number | null;
    highlights?: LocalizedList | string[] | null;
    isPublished?: boolean;
    createdAt?: Date | string;
    durationDays?: number;
    physicalLevel?: PhysicalLevel | string;
    childrenAllowed?: boolean;
    ratingAvg?: number;
    reviewsCount?: number;
    bookingsCount?: number;
};

export function asLocalizedText(value: unknown): LocalizedText | string | null {
    if (!value) return null;
    if (typeof value === "string") return value;
    if (typeof value === "object" && !Array.isArray(value)) {
        return value as LocalizedText;
    }
    return null;
}

export function asLocalizedList(value: unknown): LocalizedList | string[] | null {
    if (!value) return null;
    if (Array.isArray(value)) return value as string[];
    if (typeof value === "object") {
        return value as LocalizedList;
    }
    return null;
}
