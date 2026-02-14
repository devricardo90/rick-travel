"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";
import { cn } from "@/lib/utils";

interface OptimizedImageProps extends Omit<ImageProps, "onError"> {
    fallbackSrc?: string;
}

export function OptimizedImage({
    src,
    alt,
    className,
    fallbackSrc = "/images/placeholder.svg",
    ...props
}: OptimizedImageProps) {
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div className={cn("relative overflow-hidden", className)}>
            <Image
                src={error ? fallbackSrc : src}
                alt={alt}
                className={cn(
                    "duration-700 ease-in-out",
                    isLoading ? "scale-110 blur-xl grayscale" : "scale-100 blur-0 grayscale-0",
                    className
                )}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                    setError(true);
                    setIsLoading(false);
                }}
                {...props}
            />
        </div>
    );
}
