"use client";

import { useState } from "react";
import { TripCard } from "./trips/trip-card";
import { toast } from "sonner";
import { motion } from "motion/react";
import { useLocale } from "next-intl";

type Trip = {
    id: string;
    title: Record<string, string>; // JSON multilingual
    city: string;
    location?: string | null;
    description?: Record<string, string> | null; // JSON multilingual
    priceCents: number;
    imageUrl?: string | null;
    startDate?: Date | string | null;
    endDate?: Date | string | null;
    maxGuests?: number | null;
    highlights?: Record<string, string[]> | null; // JSON multilingual array
    createdAt?: Date | string;
    durationDays?: number;
    physicalLevel?: string;
    childrenAllowed?: boolean;
};

interface TripGridProps {
    trips: Trip[];
}

export function TripGrid({ trips }: TripGridProps) {
    const locale = useLocale();
    const [loadingTripId, setLoadingTripId] = useState<string | null>(null);

    // 🔹 reservar
    async function reserve(tripId: string) {
        setLoadingTripId(tripId);

        try {
            const res = await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ tripId }),
            });

            const data = await res.json().catch(() => ({}));

            if (res.status === 401) {
                toast.error("Você precisa fazer login para reservar", {
                    description: "Redirecionando para a página de login...",
                });
                setTimeout(() => {
                    window.location.href = `/${locale}/login`;
                }, 1500);
                return;
            }

            if (res.status === 409) {
                toast.info("Já reservado", {
                    description: data?.error ?? "Você já possui uma reserva ativa para esta data.",
                });
                return;
            }

            if (res.status === 400) {
                toast.info("Escolha uma data", {
                    description: data?.error ?? "Abra o detalhe do passeio para selecionar a agenda disponível.",
                });
                setTimeout(() => {
                    window.location.href = `/${locale}/tours/${tripId}`;
                }, 1200);
                return;
            }

            if (!res.ok) {
                toast.error("Erro ao reservar", {
                    description: data?.error ?? "Tente novamente mais tarde",
                });
                return;
            }

            toast.success("Reserva criada com sucesso! 🎉", {
                description: "Você pode ver suas reservas em suas informações",
            });
            window.dispatchEvent(new Event("bookings:refresh"));
        } catch {
            toast.error("Erro de rede", {
                description: "Verifique sua conexão e tente novamente",
            });
        } finally {
            setLoadingTripId(null);
        }
    }

    return (
        <div className="space-y-6">
            {trips.length === 0 ? (
                <div className="text-center text-muted-foreground py-10">
                    Nenhum passeio disponível no momento.
                </div>
            ) : (
                <motion.div 
                    className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8"
                    variants={{
                        hidden: { opacity: 0 },
                        show: {
                            opacity: 1,
                            transition: { staggerChildren: 0.1 }
                        }
                    }}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-50px" }}
                >
                    {trips.map((trip) => (
                        <motion.div 
                            key={trip.id}
                            variants={{
                                hidden: { opacity: 0, scale: 0.95, y: 20 },
                                show: { 
                                    opacity: 1, 
                                    scale: 1, 
                                    y: 0, 
                                    transition: { type: "spring", stiffness: 260, damping: 20 } 
                                }
                            }}
                        >
                            <TripCard
                                trip={trip}
                                onReserve={reserve}
                                loading={loadingTripId === trip.id}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
}
