import React from "react";
import { cn } from "@/lib/utils";

interface RickTravelLogoProps {
    className?: string;
    variant?: "full" | "icon" | "text";
    size?: "sm" | "md" | "lg";
}

const sizeClasses = {
    sm: {
        full: "h-9 w-auto",
        icon: "h-9 w-9",
        text: "h-7 w-auto",
    },
    md: {
        full: "h-14 w-auto",
        icon: "h-12 w-12",
        text: "h-9 w-auto",
    },
    lg: {
        full: "h-20 w-auto",
        icon: "h-16 w-16",
        text: "h-12 w-auto",
    },
} as const;

function LogoIconSvg({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 170 170"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            role="img"
            aria-label="Rick Travel Logo"
        >
            <path
                d="M30 118C42 126 58 134 76 139C92 143 107 142 121 136"
                stroke="#E4BE2D"
                strokeWidth="12"
                strokeLinecap="round"
            />
            <path
                d="M52 145C70 154 92 159 114 158C123 157 131 155 139 151"
                stroke="#0D78BD"
                strokeWidth="9"
                strokeLinecap="round"
            />
            <path
                d="M24 68C31 37 59 16 92 16C112 16 130 23 144 37"
                stroke="#E4BE2D"
                strokeWidth="8"
                strokeLinecap="round"
            />
            <path
                d="M142 70C143 77 143 84 142 91"
                stroke="#E4BE2D"
                strokeWidth="8"
                strokeLinecap="round"
            />

            <circle cx="79" cy="68" r="36" fill="#0D78BD" />

            <path
                d="M54 46C46 50 42 58 43 68C47 68 51 69 56 71C57 65 61 60 65 57C62 52 59 48 54 46Z"
                fill="#075B64"
            />
            <path
                d="M67 39C70 43 71 48 70 53C75 54 79 57 82 60C87 56 90 50 89 43C83 40 75 38 67 39Z"
                fill="#075B64"
            />
            <path
                d="M55 74C56 82 61 88 66 94C65 99 67 105 71 111C75 107 78 101 80 96C83 92 84 87 83 81C74 77 65 74 55 74Z"
                fill="#075B64"
            />

            <path
                d="M33 122C50 112 69 106 90 105C82 114 71 121 58 126C49 129 41 128 33 122Z"
                fill="#68A34F"
            />

            <path
                d="M86 129C97 120 104 108 108 95C118 86 125 77 127 66C133 69 136 75 136 83C136 106 118 126 86 129Z"
                fill="#E4BE2D"
            />

            <path
                d="M103 58C103 88 101 96 99 109"
                stroke="#68A34F"
                strokeWidth="7"
                strokeLinecap="round"
            />
            <path
                d="M101 58C112 43 129 39 141 44C128 45 118 51 111 61"
                fill="#68A34F"
            />
            <path
                d="M100 57C92 41 76 34 62 38C77 42 88 49 95 60"
                fill="#68A34F"
            />
            <path
                d="M101 60C116 58 128 64 134 73C123 71 113 70 102 68"
                fill="#68A34F"
            />
            <path
                d="M98 61C86 56 72 58 61 66C73 66 84 66 96 69"
                fill="#68A34F"
            />
        </svg>
    );
}

function LogoTextSvg({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 310 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            role="img"
            aria-label="Rick Travel"
        >
            <text
                x="8"
                y="50"
                fill="#0D78BD"
                fontSize="74"
                fontWeight="800"
                letterSpacing="1"
                fontFamily="Arial, Helvetica, sans-serif"
            >
                RICK
            </text>
            <text
                x="12"
                y="104"
                fill="#E4BE2D"
                fontSize="52"
                fontWeight="800"
                letterSpacing="3"
                fontFamily="Arial, Helvetica, sans-serif"
            >
                TRAVEL
            </text>
        </svg>
    );
}

function FullLogoSvg({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 520 170"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            role="img"
            aria-label="Rick Travel - Logo oficial"
        >
            <g transform="translate(0,8)">
                <path
                    d="M30 118C42 126 58 134 76 139C92 143 107 142 121 136"
                    stroke="#E4BE2D"
                    strokeWidth="12"
                    strokeLinecap="round"
                />
                <path
                    d="M52 145C70 154 92 159 114 158C123 157 131 155 139 151"
                    stroke="#0D78BD"
                    strokeWidth="9"
                    strokeLinecap="round"
                />
                <path
                    d="M24 68C31 37 59 16 92 16C112 16 130 23 144 37"
                    stroke="#E4BE2D"
                    strokeWidth="8"
                    strokeLinecap="round"
                />
                <path
                    d="M142 70C143 77 143 84 142 91"
                    stroke="#E4BE2D"
                    strokeWidth="8"
                    strokeLinecap="round"
                />

                <circle cx="79" cy="68" r="36" fill="#0D78BD" />

                <path
                    d="M54 46C46 50 42 58 43 68C47 68 51 69 56 71C57 65 61 60 65 57C62 52 59 48 54 46Z"
                    fill="#075B64"
                />
                <path
                    d="M67 39C70 43 71 48 70 53C75 54 79 57 82 60C87 56 90 50 89 43C83 40 75 38 67 39Z"
                    fill="#075B64"
                />
                <path
                    d="M55 74C56 82 61 88 66 94C65 99 67 105 71 111C75 107 78 101 80 96C83 92 84 87 83 81C74 77 65 74 55 74Z"
                    fill="#075B64"
                />

                <path
                    d="M33 122C50 112 69 106 90 105C82 114 71 121 58 126C49 129 41 128 33 122Z"
                    fill="#68A34F"
                />

                <path
                    d="M86 129C97 120 104 108 108 95C118 86 125 77 127 66C133 69 136 75 136 83C136 106 118 126 86 129Z"
                    fill="#E4BE2D"
                />

                <path
                    d="M103 58C103 88 101 96 99 109"
                    stroke="#68A34F"
                    strokeWidth="7"
                    strokeLinecap="round"
                />
                <path
                    d="M101 58C112 43 129 39 141 44C128 45 118 51 111 61"
                    fill="#68A34F"
                />
                <path
                    d="M100 57C92 41 76 34 62 38C77 42 88 49 95 60"
                    fill="#68A34F"
                />
                <path
                    d="M101 60C116 58 128 64 134 73C123 71 113 70 102 68"
                    fill="#68A34F"
                />
                <path
                    d="M98 61C86 56 72 58 61 66C73 66 84 66 96 69"
                    fill="#68A34F"
                />
            </g>

            <text
                x="175"
                y="86"
                fill="#0D78BD"
                fontSize="98"
                fontWeight="800"
                letterSpacing="1"
                fontFamily="Arial, Helvetica, sans-serif"
            >
                RICK
            </text>
            <text
                x="186"
                y="149"
                fill="#E4BE2D"
                fontSize="70"
                fontWeight="800"
                letterSpacing="4"
                fontFamily="Arial, Helvetica, sans-serif"
            >
                TRAVEL
            </text>
        </svg>
    );
}

export function RickTravelLogo({
    className,
    variant = "full",
    size = "md",
}: RickTravelLogoProps) {
    if (variant === "icon") {
        return <LogoIconSvg className={cn(sizeClasses[size].icon, className)} />;
    }

    if (variant === "text") {
        return <LogoTextSvg className={cn(sizeClasses[size].text, className)} />;
    }

    return <FullLogoSvg className={cn(sizeClasses[size].full, className)} />;
}

export function RickTravelLogoIcon({ className }: { className?: string }) {
    return <RickTravelLogo variant="icon" size="sm" className={className} />;
}

export function RickTravelLogoText({ className }: { className?: string }) {
    return <RickTravelLogo variant="text" size="md" className={className} />;
}
