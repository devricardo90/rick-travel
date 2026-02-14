import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "rectangular" | "circular" | "text"
}

export function Skeleton({
    className,
    variant = "rectangular",
    ...props
}: SkeletonProps) {
    return (
        <div
            className={cn(
                "animate-pulse bg-muted",
                {
                    "rounded-md": variant === "rectangular",
                    "rounded-full": variant === "circular",
                    "rounded": variant === "text",
                },
                className
            )}
            {...props}
        />
    )
}
