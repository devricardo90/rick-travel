
'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

type Trip = {
  id: string
  title: string
  city: string
  description?: string | null
  priceCents: number
}

export function TripList() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('/api/trips')
      .then((res) => res.json())
      .then(setTrips)
      .finally(() => setLoading(false))
  }, [])

  async function handleReserve(tripId: string) {
    setMessage('')

    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, tripId }),
    })

    const data = await res.json().catch(() => null)

    if (!res.ok) {
      setMessage(data?.error ?? 'Erro ao reservar')
      return
    }

    setMessage('Reserva criada com sucesso ✅')
  }

  if (loading) {
    return <p className="text-center text-muted-foreground">Carregando passeios…</p>
  }

  if (trips.length === 0) {
    return <p className="text-center text-muted-foreground">Nenhum passeio cadastrado.</p>
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border p-4">
        <p className="mb-2 text-sm text-muted-foreground">
          (Temporário) Cole um <strong>User ID</strong> para reservar
        </p>
        <input
          className="w-full rounded-lg border px-3 py-2 text-sm"
          placeholder="Cole o userId aqui"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
      </div>

      {trips.map((trip) => (
        <div
          key={trip.id}
          className="flex flex-col gap-4 rounded-xl border p-6 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <h3 className="font-semibold">{trip.title}</h3>
            <p className="text-sm text-muted-foreground">{trip.city}</p>
            {trip.description ? <p className="mt-2 text-sm">{trip.description}</p> : null}
          </div>

          <div className="flex items-center gap-4">
            <span className="font-medium">R$ {(trip.priceCents / 100).toFixed(2)}</span>
            <Button disabled={!userId.trim()} onClick={() => handleReserve(trip.id)}>
              Reservar
            </Button>
          </div>
        </div>
      ))}

      {message ? <p className="text-center text-sm font-medium">{message}</p> : null}
    </div>
  )
}
