'use client'

import { useEffect, useRef, useState } from 'react'
import { Loader2, Search } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'

import { Skeleton } from '@/components/ui/skeleton'
import { useRouter } from '@/i18n/routing'
import { getLocalizedField } from '@/lib/localized-field'

interface Trip {
    id: string
    title: Record<string, string> | string
    description: Record<string, string> | string | null
    city: string
    location: string | null
}

function normalizeText(value: string | null | undefined) {
    return (value ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
}

function getSearchMetaCopy(locale: string) {
    switch (locale) {
        case 'en':
            return {
                helper: 'Search by destination, neighborhood or experience',
                viewAll: 'See all matching tours',
            }
        case 'es':
            return {
                helper: 'Busca por destino, barrio o experiencia',
                viewAll: 'Ver todos los tours relacionados',
            }
        case 'sv':
            return {
                helper: 'Sok efter destination, stadsdel eller upplevelse',
                viewAll: 'Visa alla matchande turer',
            }
        default:
            return {
                helper: 'Busque por destino, bairro ou experiencia',
                viewAll: 'Ver todos os passeios relacionados',
            }
    }
}

export function HeroSearch() {
    const [query, setQuery] = useState('')
    const [trips, setTrips] = useState<Trip[]>([])
    const [suggestions, setSuggestions] = useState<Trip[]>([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(-1)

    const searchRef = useRef<HTMLDivElement>(null)
    const router = useRouter()
    const locale = useLocale()
    const t = useTranslations('HomePage.Search')
    const metaCopy = getSearchMetaCopy(locale)

    useEffect(() => {
        async function loadTrips() {
            try {
                const response = await fetch('/api/trips')
                if (response.ok) {
                    const data = await response.json()
                    setTrips(data)
                }
            } catch (error) {
                console.error('Error loading trips:', error)
            }
        }

        loadTrips()
    }, [])

    useEffect(() => {
        if (query.length < 2) {
            const resetId = setTimeout(() => {
                setSuggestions([])
                setShowSuggestions(false)
                setIsLoading(false)
                setSelectedIndex(-1)
            }, 0)

            return () => clearTimeout(resetId)
        }

        const timeoutId = setTimeout(() => {
            const normalizedQuery = normalizeText(query)
            const filtered = trips.filter((trip) => {
                const titleText = normalizeText(getLocalizedField<string>(trip.title, locale))
                const descriptionText = normalizeText(getLocalizedField<string>(trip.description, locale))
                const cityText = normalizeText(trip.city)
                const locationText = normalizeText(trip.location)

                return (
                    titleText.includes(normalizedQuery) ||
                    descriptionText.includes(normalizedQuery) ||
                    cityText.includes(normalizedQuery) ||
                    locationText.includes(normalizedQuery)
                )
            })

            setSuggestions(filtered.slice(0, 5))
            setShowSuggestions(true)
            setIsLoading(false)
            setSelectedIndex(-1)
        }, 300)

        return () => clearTimeout(timeoutId)
    }, [locale, query, trips])

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSuggestionClick = (tripId: string) => {
        router.push(`/${locale}/tours/${tripId}`)
        setShowSuggestions(false)
        setQuery('')
    }

    const handleSearch = (event: React.FormEvent) => {
        event.preventDefault()

        if (suggestions.length === 1) {
            router.push(`/${locale}/tours/${suggestions[0].id}`)
        } else if (query.trim().length >= 2) {
            router.push(`/${locale}/tours?search=${encodeURIComponent(query)}`)
        }

        setShowSuggestions(false)
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (!showSuggestions || suggestions.length === 0) {
            return
        }

        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault()
                setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev))
                break
            case 'ArrowUp':
                event.preventDefault()
                setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
                break
            case 'Enter':
                event.preventDefault()
                if (selectedIndex >= 0 && suggestions[selectedIndex]) {
                    handleSuggestionClick(suggestions[selectedIndex].id)
                }
                break
            case 'Escape':
                setShowSuggestions(false)
                setSelectedIndex(-1)
                break
        }
    }

    return (
        <div ref={searchRef} className="relative mx-auto w-full max-w-3xl">
            <form onSubmit={handleSearch} role="search" className="relative">
                <label htmlFor="hero-search-input" className="sr-only">
                    {t('placeholder')}
                </label>

                <div className="group relative flex h-14 items-center gap-3 rounded-[24px] border border-white/12 bg-[#0b2233]/58 px-4 shadow-[0_20px_50px_rgba(0,0,0,0.22)] backdrop-blur-xl transition-all duration-300 hover:border-white/18 focus-within:border-[#c8a86b]/45">
                    <Search className="h-5 w-5 text-white/50 transition-colors group-focus-within:text-[#d8c18f]" aria-hidden="true" />

                    <input
                        id="hero-search-input"
                        type="text"
                        value={query}
                        onChange={(event) => {
                            const nextQuery = event.target.value
                            setQuery(nextQuery)
                            setIsLoading(nextQuery.length >= 2)
                        }}
                        onKeyDown={handleKeyDown}
                        onFocus={() => query.length >= 2 && suggestions.length > 0 && setShowSuggestions(true)}
                        placeholder={t('placeholder')}
                        aria-label={t('placeholder')}
                        aria-controls="search-suggestions"
                        aria-autocomplete="list"
                        aria-activedescendant={selectedIndex >= 0 ? `suggestion-${selectedIndex}` : undefined}
                        className="w-full bg-transparent text-[15px] text-white placeholder:text-white/50 outline-none md:text-base"
                    />

                    <button
                        type="submit"
                        disabled={query.length < 2 || isLoading}
                        className="button-press h-10 shrink-0 rounded-full bg-brazil-green-600 px-4 text-sm font-semibold text-white shadow-[0_14px_24px_rgba(18,58,40,0.28)] transition-all duration-200 hover:bg-brazil-green-700 disabled:cursor-not-allowed disabled:opacity-50 sm:h-11 sm:px-6"
                    >
                        <span className="flex items-center gap-2">
                            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                            {t('button')}
                        </span>
                    </button>
                </div>
            </form>

            <p className="mt-3 text-center text-xs font-medium text-white/58 sm:text-sm">
                {metaCopy.helper}
            </p>

            {showSuggestions && query.length >= 2 && (
                <div
                    id="search-suggestions"
                    role="listbox"
                    aria-live="polite"
                    aria-label={t('noResults')}
                    className="fade-in absolute z-40 mt-3 w-full overflow-hidden rounded-[24px] border border-white/10 bg-[#0b2233]/96 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl"
                >
                    <div className="p-2">
                        {isLoading ? (
                            <>
                                {[1, 2, 3].map((item) => (
                                    <div key={item} className="flex items-start gap-3 px-4 py-3">
                                        <Skeleton className="mt-1 h-4 w-4" variant="circular" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-4 w-3/4" variant="text" />
                                            <Skeleton className="h-3 w-1/2" variant="text" />
                                        </div>
                                    </div>
                                ))}
                            </>
                        ) : suggestions.length > 0 ? (
                            <>
                                {suggestions.map((trip, index) => {
                                    const title = getLocalizedField<string>(trip.title, locale)

                                    return (
                                        <button
                                            key={trip.id}
                                            id={`suggestion-${index}`}
                                            type="button"
                                            role="option"
                                            aria-selected={index === selectedIndex}
                                            onClick={() => handleSuggestionClick(trip.id)}
                                            className={`group flex w-full items-start gap-3 rounded-2xl px-4 py-3 text-left transition-all duration-150 ${index === selectedIndex
                                                ? 'border-l-4 border-[#c8a86b] bg-white/10'
                                                : 'hover:bg-white/5'
                                                }`}
                                        >
                                            <Search
                                                className={`mt-1 h-4 w-4 transition-colors ${index === selectedIndex
                                                    ? 'text-[#d8c18f]'
                                                    : 'text-white/40 group-hover:text-white'
                                                    }`}
                                            />

                                            <div className="min-w-0 flex-1">
                                                <p
                                                    className={`line-clamp-1 font-medium transition-colors ${index === selectedIndex
                                                        ? 'text-white'
                                                        : 'text-white/90 group-hover:text-white'
                                                        }`}
                                                >
                                                    {title}
                                                </p>
                                                <p className="line-clamp-1 text-sm text-white/50">
                                                    {trip.city}
                                                    {trip.location ? ` - ${trip.location}` : ''}
                                                </p>
                                            </div>
                                        </button>
                                    )
                                })}

                                <button
                                    type="button"
                                    onClick={() => router.push(`/${locale}/tours?search=${encodeURIComponent(query)}`)}
                                    className="mt-1 flex w-full items-center justify-center rounded-2xl border border-white/8 px-4 py-3 text-sm font-semibold text-white/80 transition-colors hover:bg-white/5 hover:text-white"
                                >
                                    {metaCopy.viewAll}
                                </button>
                            </>
                        ) : (
                            <div className="px-4 py-6 text-center">
                                <p className="text-muted-foreground">{t('noResults')}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
