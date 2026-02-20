'use client'

import { Heart, Star } from 'lucide-react'
import { useState } from 'react'

interface TourMediaBadgesProps {
    rating?: number       // ex: 4.9
    reviews?: number      // ex: 128
    bookings?: number     // ex: 2340
    showFavorite?: boolean
}

/**
 * Prova social na área da imagem do card de tour.
 * Rating + avaliações (canto inferior esquerdo)
 * Reservas (logo abaixo, só se bookings passado)
 * Botão favoritar com glassmorphism (canto superior direito)
 *
 * Nenhum verde — verde = CTA (reservar). Prova social = neutro/elegante.
 */
export function TourMediaBadges({
    rating,
    reviews,
    bookings,
    showFavorite = true,
}: TourMediaBadgesProps) {
    const [isFavorite, setIsFavorite] = useState(false)

    const hasRating = typeof rating === 'number' && typeof reviews === 'number'
    const hasBookings = typeof bookings === 'number'

    return (
        <>
            {/* ── Social proof (rating + reviews + reservas) ── */}
            {(hasRating || hasBookings) && (
                <div className="absolute left-3 bottom-3 flex flex-col gap-1.5">
                    {hasRating && (
                        <div className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/40 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                            <Star className="h-3 w-3 fill-white text-white" />
                            <span>{rating!.toFixed(1)}</span>
                            <span className="text-white/55">•</span>
                            <span className="text-white/80">{reviews!.toLocaleString('pt-BR')} aval.</span>
                        </div>
                    )}

                    {hasBookings && (
                        <div className="w-fit rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-[10px] font-medium text-white/75 backdrop-blur-sm">
                            {bookings! >= 1000
                                ? `${(bookings! / 1000).toFixed(1).replace('.', ',')}k reservas`
                                : `${bookings!.toLocaleString('pt-BR')} reservas`}
                        </div>
                    )}
                </div>
            )}

            {/* ── Botão Favoritar ── */}
            {showFavorite && (
                <button
                    type="button"
                    onClick={() => setIsFavorite((v) => !v)}
                    className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-black/35 text-white backdrop-blur-sm transition duration-200 hover:bg-black/50 hover:scale-110 active:scale-95"
                    aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                >
                    <Heart
                        className={`h-4 w-4 transition-all duration-200 ${isFavorite
                            ? 'fill-white stroke-white'
                            : 'fill-transparent stroke-white'
                            }`}
                    />
                </button>
            )}
        </>
    )
}
