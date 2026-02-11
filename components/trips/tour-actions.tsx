"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface TourActionsProps {
    tripId: string;
    priceCents: number;
}

export function TourActions({ tripId, priceCents }: TourActionsProps) {
    const [loading, setLoading] = useState(false);
    const [reserved, setReserved] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    // Check if reserved on mount
    useEffect(() => {
        async function checkReservation() {
            try {
                const res = await fetch("/api/bookings/my-trip-ids");
                if (res.ok) {
                    const ids = await res.json();
                    if (Array.isArray(ids) && ids.includes(tripId)) {
                        setReserved(true);
                    }
                }
            } catch (e) {
                console.error("Failed to check reservation", e);
            }
        }
        checkReservation();
    }, [tripId]);

    async function handleReserve() {
        setLoading(true);
        setMessage(null);

        try {
            const res = await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tripId }),
            });

            if (res.status === 401) {
                window.location.href = "/login?redirect=/tours/" + tripId;
                return;
            }

            if (res.status === 409) {
                setMessage("Você já tem uma reserva para este tour!");
                setReserved(true);
                return;
            }

            if (!res.ok) {
                setMessage("Erro ao realizar reserva.");
                return;
            }

            setReserved(true);
            setMessage("Reserva realizada com sucesso!");
        } catch (error) {
            setMessage("Erro de conexão.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-4 rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Preço por pessoa</span>
                <span className="text-2xl font-bold text-primary">
                    {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                    }).format(priceCents / 100)}
                </span>
            </div>

            <Button
                className="w-full"
                size="lg"
                onClick={handleReserve}
                disabled={loading || reserved}
                variant={reserved ? "outline" : "default"}
            >
                {loading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processando...
                    </>
                ) : reserved ? (
                    "Reservado"
                ) : (
                    "Reservar Agora"
                )}
            </Button>

            {message && (
                <p className={`text-center text-sm ${reserved ? "text-green-600" : "text-red-500"}`}>
                    {message}
                </p>
            )}

            <p className="text-center text-xs text-muted-foreground">
                Cancelamento grátis até 24h antes.
            </p>
        </div>
    );
}
