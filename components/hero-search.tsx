'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { getLocalizedField } from '@/lib/translation-service'
import { Skeleton } from '@/components/ui/skeleton'

interface Trip {
    id: string
    title: any
    description: any
    city: string
    location: string | null
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

    // Load all trips on mount
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

    // Filter trips based on search query com DEBOUNCE
    useEffect(() => {
        if (query.length < 2) {
            setSuggestions([])
            setShowSuggestions(false)
            setIsLoading(false)
            return
        }

        setIsLoading(true)

        // Debounce de 300ms
        const timeoutId = setTimeout(() => {
            const filtered = trips.filter(trip => {
                const titleText = getLocalizedField<string>(trip.title, locale).toLowerCase()
                const descriptionText = getLocalizedField<string>(trip.description, locale).toLowerCase()
                const searchQuery = query.toLowerCase()

                return (
                    titleText.includes(searchQuery) ||
                    descriptionText.includes(searchQuery) ||
                    trip.city.toLowerCase().includes(searchQuery) ||
                    trip.location?.toLowerCase().includes(searchQuery)
                )
            })

            setSuggestions(filtered.slice(0, 5)) // Show max 5 suggestions
            setShowSuggestions(true) // Mostrar sempre durante busca
            setIsLoading(false)
            setSelectedIndex(-1) // Reset selection on new results
        }, 300)

        return () => {
            clearTimeout(timeoutId)
            setIsLoading(false)
        }
    }, [query, trips, locale])

    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!showSuggestions || suggestions.length === 0) return

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault()
                setSelectedIndex(prev =>
                    prev < suggestions.length - 1 ? prev + 1 : prev
                )
                break
            case 'ArrowUp':
                e.preventDefault()
                setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
                break
            case 'Enter':
                e.preventDefault()
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

    // Close suggestions when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()

        if (suggestions.length === 1) {
            // If only one result, go directly to it
            router.push(`/tours/${suggestions[0].id}`)
        } else if (suggestions.length > 0) {
            // Multiple results, go to tours page with search filter
            router.push(`/tours?search=${encodeURIComponent(query)}`)
        }

        setShowSuggestions(false)
    }

    const handleSuggestionClick = (tripId: string) => {
        router.push(`/tours/${tripId}`)
        setShowSuggestions(false)
        setQuery('')
    }

    return (
        <div ref={searchRef} className="relative w-full max-w-3xl mx-auto">
            <form onSubmit={handleSearch} role="search" className="relative">
                <label htmlFor="hero-search-input" className="sr-only">
                    {t('placeholder')}
                </label>
                <div className="relative flex items-center bg-white/10 backdrop-blur-md rounded-full shadow-2xl border border-white/12 hover:border-white/20 focus-within:border-white/30 focus-within:ring-4 focus-within:ring-white/5 transition-all duration-300">
                    <Search className="absolute left-6 h-5 w-5 text-white/50 pointer-events-none" aria-hidden="true" />

                    <input
                        id="hero-search-input"
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => query.length >= 2 && suggestions.length > 0 && setShowSuggestions(true)}
                        placeholder={t('placeholder')}
                        aria-label={t('placeholder')}
                        aria-expanded={showSuggestions && query.length >= 2}
                        aria-controls="search-suggestions"
                        aria-autocomplete="list"
                        aria-activedescendant={selectedIndex >= 0 ? `suggestion-${selectedIndex}` : undefined}
                        className="w-full h-14 pl-14 pr-32 bg-transparent text-base text-white placeholder:text-white/40 focus:outline-none rounded-full"
                    />


                    <button
                        type="submit"
                        disabled={query.length < 2 || isLoading}
                        className="absolute right-2 h-10 px-6 bg-brazil-green-600 text-white rounded-full font-semibold hover:bg-brazil-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 button-press flex items-center gap-2 shadow-lg"
                    >
                        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                        {t('button')}
                    </button>
                </div>
            </form>

            {/* Autocomplete Suggestions com Loading Skeleton e Fade-in */}
            {showSuggestions && query.length >= 2 && (
                <div
                    id="search-suggestions"
                    role="listbox"
                    aria-live="polite"
                    aria-label={t('noResults')}
                    className="absolute z-40 w-full mt-3 bg-navy-900/95 backdrop-blur-xl rounded-2xl shadow-hero border border-white/10 overflow-hidden fade-in"
                >
                    <div className="p-2">
                        {isLoading ? (
                            // Skeleton durante loading
                            <>
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="px-4 py-3 flex items-start gap-3">
                                        <Skeleton className="h-4 w-4 mt-1" variant="circular" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-4 w-3/4" variant="text" />
                                            <Skeleton className="h-3 w-1/2" variant="text" />
                                        </div>
                                    </div>
                                ))}
                            </>
                        ) : suggestions.length > 0 ? (
                            // Resultados
                            suggestions.map((trip, index) => {
                                const title = getLocalizedField<string>(trip.title, locale)
                                return (
                                    <button
                                        key={trip.id}
                                        id={`suggestion-${index}`}
                                        type="button"
                                        role="option"
                                        aria-selected={index === selectedIndex}
                                        onClick={() => handleSuggestionClick(trip.id)}
                                        className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-150 flex items-start gap-3 group ${index === selectedIndex
                                            ? 'bg-white/10 border-l-4 border-brazil-green-600'
                                            : 'hover:bg-white/5'
                                            }`}
                                    >
                                        <Search className={`h-4 w-4 mt-1 transition-colors ${index === selectedIndex
                                            ? 'text-brazil-green-600'
                                            : 'text-white/40 group-hover:text-white'
                                            }`} />
                                        <div className="flex-1 min-w-0">
                                            <p className={`font-medium transition-colors line-clamp-1 ${index === selectedIndex
                                                ? 'text-white'
                                                : 'text-white/90 group-hover:text-white'
                                                }`}>
                                                {title}
                                            </p>
                                            <p className="text-sm text-white/50 line-clamp-1">
                                                {trip.city}{trip.location && ` • ${trip.location}`}
                                            </p>
                                        </div>
                                    </button>
                                )
                            })
                        ) : (
                            // Sem resultados
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
