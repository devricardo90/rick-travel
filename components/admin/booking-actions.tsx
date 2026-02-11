"use client";

import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { updateBookingStatus } from "@/app/admin/bookings/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface BookingActionsProps {
    bookingId: string;
    currentStatus: string;
}

export function BookingActions({ bookingId, currentStatus }: BookingActionsProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleStatusChange = async (status: "CONFIRMED" | "CANCELED") => {
        // Optimistic UI check: don't do anything if status is already same
        if (currentStatus === status) return;

        // Simple confirmation for cancellation
        if (status === "CANCELED" && !confirm("Tem certeza que deseja cancelar esta reserva?")) {
            return;
        }

        setIsLoading(true);
        try {
            const result = await updateBookingStatus(bookingId, status);
            if (result.error) {
                alert("Erro ao atualizar reserva: " + result.error);
            } else {
                router.refresh();
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex gap-2 justify-end">
            {currentStatus !== "CONFIRMED" && (
                <Button
                    size="icon"
                    variant="outline"
                    className={cn("h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50", isLoading && "opacity-50")}
                    onClick={() => handleStatusChange("CONFIRMED")}
                    disabled={isLoading}
                    title="Confirmar Reserva"
                >
                    <Check className="h-4 w-4" />
                </Button>
            )}

            {currentStatus !== "CANCELED" && (
                <Button
                    size="icon"
                    variant="outline"
                    className={cn("h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50", isLoading && "opacity-50")}
                    onClick={() => handleStatusChange("CANCELED")}
                    disabled={isLoading}
                    title="Cancelar Reserva"
                >
                    <X className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
}
