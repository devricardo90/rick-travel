import React from 'react'
import { cn } from '@/lib/utils'

interface RickTravelLogoProps {
    className?: string
    variant?: 'full' | 'icon' | 'text'
    size?: 'sm' | 'md' | 'lg'
}

/**
 * Componente do logo Rick Travel
 * 
 * Variantes disponíveis:
 * - 'full': Logo completo (ícone + texto)
 * - 'icon': Apenas o ícone circular
 * - 'text': Apenas o texto "RICK TRAVEL"
 * 
 * Tamanhos disponíveis:
 * - 'sm': Pequeno (para mobile/header)
 * - 'md': Médio (padrão)
 * - 'lg': Grande (para hero sections)
 */
export function RickTravelLogo({
    className,
    variant = 'full',
    size = 'md',
}: RickTravelLogoProps) {
    const sizeClasses = {
        sm: 'h-8 w-auto',
        md: 'h-12 w-auto',
        lg: 'h-16 w-auto',
    }

    const iconSizeClasses = {
        sm: 'h-8 w-8',
        md: 'h-12 w-12',
        lg: 'h-16 w-16',
    }

    const textSizeClasses = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-xl',
    }

    if (variant === 'icon') {
        return (
            <div className={cn('flex items-center justify-center', className)}>
                <svg
                    viewBox="0 0 120 120"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={cn(iconSizeClasses[size])}
                    role="img"
                    aria-label="Rick Travel Logo"
                >
                    {/* Círculo de fundo com contorno amarelo */}
                    <circle
                        cx="60"
                        cy="60"
                        r="58"
                        fill="#0d5d31"
                        stroke="#FFD700"
                        strokeWidth="4"
                    />

                    {/* Elementos ondulados inferiores (terreno/águas) */}
                    <path
                        d="M20 90 Q30 85, 40 90 T60 90 T80 90 T100 90"
                        stroke="#4CAF50"
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                    />
                    <path
                        d="M15 95 Q30 90, 45 95 T75 95 T105 95"
                        stroke="#FFD700"
                        strokeWidth="2.5"
                        fill="none"
                        strokeLinecap="round"
                    />
                    <path
                        d="M10 100 Q28 95, 46 100 T82 100 T118 100"
                        stroke="#66BB6A"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                    />

                    {/* Globo Terra */}
                    <circle
                        cx="60"
                        cy="50"
                        r="25"
                        fill="#2196F3"
                        stroke="#1976D2"
                        strokeWidth="2"
                    />

                    {/* Continentes (simplificado - Américas) */}
                    <path
                        d="M50 40 Q45 45, 48 50 Q45 55, 50 60 Q52 58, 55 56 Q52 52, 50 48 Z"
                        fill="#1565C0"
                    />
                    <path
                        d="M65 42 Q68 48, 72 52 Q70 56, 68 60 Q65 58, 63 55 Q64 50, 65 45 Z"
                        fill="#1565C0"
                    />

                    {/* Palmeira */}
                    <g>
                        {/* Tronco */}
                        <path
                            d="M75 55 L75 65 L77 65 L77 55 Z"
                            fill="#4CAF50"
                        />
                        {/* Folhas superiores */}
                        <path
                            d="M76 55 Q80 50, 82 52 Q79 48, 76 52"
                            fill="#66BB6A"
                            stroke="#2E7D32"
                            strokeWidth="1"
                        />
                        <path
                            d="M76 55 Q72 50, 70 52 Q73 48, 76 52"
                            fill="#66BB6A"
                            stroke="#2E7D32"
                            strokeWidth="1"
                        />
                        <path
                            d="M76 55 Q78 48, 80 50"
                            fill="#66BB6A"
                            stroke="#2E7D32"
                            strokeWidth="1"
                        />
                        <path
                            d="M76 55 Q74 48, 72 50"
                            fill="#66BB6A"
                            stroke="#2E7D32"
                            strokeWidth="1"
                        />
                    </g>
                </svg>
            </div>
        )
    }

    if (variant === 'text') {
        return (
            <div className={cn('flex flex-col items-center justify-center', className)}>
                <svg
                    viewBox="0 0 200 80"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={cn(sizeClasses[size])}
                    role="img"
                    aria-label="Rick Travel"
                >
                    <text
                        x="100"
                        y="35"
                        textAnchor="middle"
                        className="font-bold fill-[#2196F3]"
                        fontSize="28"
                        fontFamily="Inter, system-ui, sans-serif"
                        fontWeight="700"
                    >
                        RICK
                    </text>
                    <text
                        x="100"
                        y="65"
                        textAnchor="middle"
                        className="font-bold fill-[#FFD700]"
                        fontSize="28"
                        fontFamily="Inter, system-ui, sans-serif"
                        fontWeight="700"
                    >
                        TRAVEL
                    </text>
                </svg>
            </div>
        )
    }

    // Variante 'full' - Logo completo
    return (
        <div
            className={cn(
                'flex items-center gap-3',
                className
            )}
            role="img"
            aria-label="Rick Travel - City Tour no Rio de Janeiro"
        >
            {/* Ícone */}
            <div className="flex-shrink-0">
                <svg
                    viewBox="0 0 120 120"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={cn(iconSizeClasses[size])}
                >
                    <circle
                        cx="60"
                        cy="60"
                        r="58"
                        fill="#0d5d31"
                        stroke="#FFD700"
                        strokeWidth="4"
                    />
                    <path
                        d="M20 90 Q30 85, 40 90 T60 90 T80 90 T100 90"
                        stroke="#4CAF50"
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                    />
                    <path
                        d="M15 95 Q30 90, 45 95 T75 95 T105 95"
                        stroke="#FFD700"
                        strokeWidth="2.5"
                        fill="none"
                        strokeLinecap="round"
                    />
                    <path
                        d="M10 100 Q28 95, 46 100 T82 100 T118 100"
                        stroke="#66BB6A"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                    />
                    <circle
                        cx="60"
                        cy="50"
                        r="25"
                        fill="#2196F3"
                        stroke="#1976D2"
                        strokeWidth="2"
                    />
                    <path
                        d="M50 40 Q45 45, 48 50 Q45 55, 50 60 Q52 58, 55 56 Q52 52, 50 48 Z"
                        fill="#1565C0"
                    />
                    <path
                        d="M65 42 Q68 48, 72 52 Q70 56, 68 60 Q65 58, 63 55 Q64 50, 65 45 Z"
                        fill="#1565C0"
                    />
                    <g>
                        <path
                            d="M75 55 L75 65 L77 65 L77 55 Z"
                            fill="#4CAF50"
                        />
                        <path
                            d="M76 55 Q80 50, 82 52 Q79 48, 76 52"
                            fill="#66BB6A"
                            stroke="#2E7D32"
                            strokeWidth="1"
                        />
                        <path
                            d="M76 55 Q72 50, 70 52 Q73 48, 76 52"
                            fill="#66BB6A"
                            stroke="#2E7D32"
                            strokeWidth="1"
                        />
                        <path
                            d="M76 55 Q78 48, 80 50"
                            fill="#66BB6A"
                            stroke="#2E7D32"
                            strokeWidth="1"
                        />
                        <path
                            d="M76 55 Q74 48, 72 50"
                            fill="#66BB6A"
                            stroke="#2E7D32"
                            strokeWidth="1"
                        />
                    </g>
                </svg>
            </div>

            {/* Texto */}
            <div className={cn('flex flex-col justify-center', textSizeClasses[size])}>
                <span className="font-bold text-[#2196F3] leading-tight">
                    RICK
                </span>
                <span className="font-bold text-[#FFD700] leading-tight">
                    TRAVEL
                </span>
            </div>
        </div>
    )
}

/**
 * Versão simplificada do logo para uso em espaços pequenos
 */
export function RickTravelLogoIcon({ className }: { className?: string }) {
    return <RickTravelLogo variant="icon" size="sm" className={className} />
}

/**
 * Versão do logo apenas com texto
 */
export function RickTravelLogoText({ className }: { className?: string }) {
    return <RickTravelLogo variant="text" size="md" className={className} />
}




