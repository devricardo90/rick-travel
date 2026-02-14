import { Skeleton } from "@/components/ui/skeleton"

export function TripCardSkeleton() {
    return (
        <div className="overflow-hidden rounded-2xl border bg-white dark:bg-card shadow-sm">
            {/* Image skeleton */}
            <div className="relative aspect-video w-full overflow-hidden bg-gray-100 dark:bg-muted">
                <Skeleton className="h-full w-full" />
            </div>

            <div className="p-5 space-y-4">
                {/* Title and location */}
                <div>
                    <Skeleton className="h-6 w-3/4 mb-2" variant="text" />
                    <Skeleton className="h-4 w-1/2" variant="text" />
                </div>

                {/* Date and guests badges */}
                <div className="flex gap-3">
                    <Skeleton className="h-7 w-24" />
                    <Skeleton className="h-7 w-20" />
                </div>

                {/* Price and button */}
                <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <Skeleton className="h-3 w-20 mb-1" variant="text" />
                            <Skeleton className="h-6 w-24" variant="text" />
                        </div>
                        <Skeleton className="h-9 w-24" />
                    </div>

                    <div className="mt-4 flex justify-end">
                        <Skeleton className="h-4 w-28" variant="text" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export function TripGridSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: count }).map((_, i) => (
                <TripCardSkeleton key={i} />
            ))}
        </div>
    )
}
