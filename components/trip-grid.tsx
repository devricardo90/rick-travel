"use client";

import { motion } from "motion/react";
import { TripCard } from "./trips/trip-card";
import { TripCardData } from "@/lib/types";

interface TripGridProps {
    trips: TripCardData[];
}

export function TripGrid({ trips }: TripGridProps) {
    return (
        <div className="space-y-7">
            {trips.length === 0 ? (
                <div className="surface-dark px-6 py-12 text-center text-white/62">
                    Nenhum passeio disponivel no momento.
                </div>
            ) : (
                <motion.div
                    className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-7"
                    variants={{
                        hidden: { opacity: 0 },
                        show: {
                            opacity: 1,
                            transition: { staggerChildren: 0.1 },
                        },
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
                                    transition: { type: "spring", stiffness: 260, damping: 20 },
                                },
                            }}
                        >
                            <TripCard trip={trip} />
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
}
