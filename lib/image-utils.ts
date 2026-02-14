/**
 * Normalize trip image paths to ensure they always work
 * Handles incomplete paths and null values gracefully
 */
export function normalizeTripImage(image?: string | null): string {
    // Return placeholder if no image
    if (!image) {
        return "/images/placeholder.svg";
    }

    // If path is incomplete (missing extension), assume .jpg in trips folder
    if (!image.includes(".")) {
        return `/images/trips/${image}.jpg`;
    }

    // If path doesn't start with /, add it
    if (!image.startsWith("/")) {
        return `/${image}`;
    }

    return image;
}

/**
 * Get a fallback image for trip cards
 */
export function getTripImageFallback(): string {
    return "/images/placeholder.svg";
}
