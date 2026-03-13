"use client";

import { Button } from "@/components/ui/button";
import { Check, X, Mail, Loader2 } from "lucide-react";
import { updateBookingStatus } from "@/app/[locale]/admin/bookings/actions";
import { resendBookingEmail } from "@/app/actions/admin";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface BookingActionsProps {
    bookingId: string;
    currentStatus: string;
}

export function BookingActions({ bookingId, currentStatus }: BookingActionsProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isEmailSending, setIsEmailSending] = useState(false);

    const handleStatusChange = async (status: "CONFIRMED" | "CANCELED") => {
        if (currentStatus === status) return;

        if (status === "CANCELED" && !confirm("Tem certeza que deseja cancelar esta reserva?")) {
            return;
        }

        setIsLoading(true);
        try {
            const result = await updateBookingStatus(bookingId, status);
            if (result.error) {
                toast.error("Erro ao atualizar reserva", { description: result.error });
            } else {
                toast.success("Status atualizado com sucesso!");
                router.refresh();
            }
        } catch {
            toast.error("Erro inesperado ao atualizar status");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendEmail = async () => {
        setIsEmailSending(true);
        try {
            const result = await resendBookingEmail(bookingId);
            if (result.success) {
                toast.success("E-mail reenviado com sucesso!");
                router.refresh();
            } else {
                toast.error("Erro ao enviar e-mail", { description: result.error });
            }
        } catch {
            toast.error("Erro inesperado ao enviar e-mail");
        } finally {
            setIsEmailSending(false);
        }
    };

    return (
        <div className="flex gap-2 justify-end">
            <Button
                size="icon"
                variant="outline"
                className={cn("h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50", isEmailSending && "opacity-50")}
                onClick={handleResendEmail}
                disabled={isLoading || isEmailSending}
                title="Reenviar E-mail de Confirmação"
            >
                {isEmailSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
            </Button>

            {currentStatus !== "CONFIRMED" && (
                <Button
                    size="icon"
                    variant="outline"
                    className={cn("h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50", isLoading && "opacity-50")}
                    onClick={() => handleStatusChange("CONFIRMED")}
                    disabled={isLoading || isEmailSending}
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
                    disabled={isLoading || isEmailSending}
                    title="Cancelar Reserva"
                >
                    <X className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
}
