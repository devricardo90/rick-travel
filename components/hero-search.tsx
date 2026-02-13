'use client'

import { useState, useEffect, useRef } from 'react'
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { getLocalizedField } from '@/lib/translation-service'

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

    // Filter trips based on search query
    useEffect(() => {
        if (query.length < 2) {
            setSuggestions([])
            setShowSuggestions(false)
            return
        }

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
        setShowSuggestions(filtered.length > 0)
    }, [query, trips, locale])

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
            <form onSubmit={handleSearch} className="relative">
                <div className="relative flex items-center bg-white dark:bg-gray-900 rounded-full shadow-2xl border-2 border-transparent hover:border-primary/20 focus-within:border-primary transition-all duration-300">
                    <Search className="absolute left-6 h-5 w-5 text-muted-foreground pointer-events-none" />

                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => query.length >= 2 && suggestions.length > 0 && setShowSuggestions(true)}
                        placeholder={t('placeholder')}
                        className="w-full h-14 pl-14 pr-32 bg-transparent text-base text-foreground placeholder:text-muted-foreground focus:outline-none rounded-full"
                    />

                    <button
                        type="submit"
                        disabled={query.length < 2}
                        className="absolute right-2 h-10 px-6 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95"
                    >
                        {t('button')}
                    </button>
                </div>
            </form>

            {/* Autocomplete Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-border overflow-hidden">
                    <div className="p-2">
                        {suggestions.map((trip) => {
                            const title = getLocalizedField<string>(trip.title, locale)
                            return (
                                <button
                                    key={trip.id}
                                    onClick={() => handleSuggestionClick(trip.id)}
                                    className="w-full text-left px-4 py-3 hover:bg-accent rounded-lg transition-colors duration-150 flex items-start gap-3 group"
                                >
                                    <Search className="h-4 w-4 text-muted-foreground mt-1 group-hover:text-primary transition-colors" />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                                            {title}
                                        </p>
                                        <p className="text-sm text-muted-foreground line-clamp-1">
                                            {trip.city}{trip.location && ` • ${trip.location}`}
                                        </p>
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* No results message */}
            {showSuggestions && query.length >= 2 && suggestions.length === 0 && (
                <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-border p-6 text-center">
                    <p className="text-muted-foreground">{t('noResults')}</p>
                </div>
            )}
        </div>
    )
}
