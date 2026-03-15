"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Mail, X } from "lucide-react";
import { toast } from "sonner";
import { resendBookingEmail } from "@/app/actions/admin";
import { updateBookingStatus } from "@/app/[locale]/admin/bookings/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BookingActionsProps {
  bookingId: string;
  currentStatus: string;
  currentPaymentStatus: string;
}

export function BookingActions({
  bookingId,
  currentStatus,
  currentPaymentStatus,
}: BookingActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSending, setIsEmailSending] = useState(false);
  const canResendEmail = currentStatus === "CONFIRMED" || currentPaymentStatus === "PAID";

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
        toast.success("E-mail reenviado com sucesso!", {
          description:
            result.template === "PAYMENT_CONFIRMED"
              ? "Template: pagamento confirmado"
              : "Template: reserva confirmada",
        });
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
    <div className="flex justify-end gap-2">
      <Button
        size="icon"
        variant="outline"
        className={cn(
          "h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700",
          isEmailSending && "opacity-50"
        )}
        onClick={handleResendEmail}
        disabled={isLoading || isEmailSending || !canResendEmail}
        title="Reenviar e-mail"
      >
        {isEmailSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
      </Button>

      {currentStatus !== "CONFIRMED" && (
        <Button
          size="icon"
          variant="outline"
          className={cn(
            "h-8 w-8 text-green-600 hover:bg-green-50 hover:text-green-700",
            isLoading && "opacity-50"
          )}
          onClick={() => handleStatusChange("CONFIRMED")}
          disabled={isLoading || isEmailSending}
          title="Confirmar reserva"
        >
          <Check className="h-4 w-4" />
        </Button>
      )}

      {currentStatus !== "CANCELED" && (
        <Button
          size="icon"
          variant="outline"
          className={cn(
            "h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700",
            isLoading && "opacity-50"
          )}
          onClick={() => handleStatusChange("CANCELED")}
          disabled={isLoading || isEmailSending}
          title="Cancelar reserva"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
