'use client'

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { cancelBookingByAdminAction } from "@/app/actions/admin";

interface CancelBookingButtonProps {
  bookingId: string;
  locale: string;
}

/**
 * RT-014B: Botao de cancelamento de reserva pelo admin.
 * Exibido apenas para status PENDING ou CONFIRMED.
 * Solicita confirmacao via window.confirm antes de agir.
 * Nao altera paymentStatus. Nao envia e-mail. Nao executa reembolso.
 */
export function CancelBookingButton({ bookingId, locale }: CancelBookingButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleCancel() {
    const confirmed = window.confirm(
      "Tem certeza que deseja cancelar esta reserva?\n\nEsta acao nao pode ser desfeita. O pagamento nao sera estornado automaticamente."
    );

    if (!confirmed) return;

    setError(null);

    startTransition(async () => {
      const result = await cancelBookingByAdminAction(bookingId);

      if (result.error) {
        setError(result.error);
        return;
      }

      router.push(`/${locale}/admin/bookings`);
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleCancel}
        disabled={isPending}
        className="inline-flex items-center rounded-md bg-destructive px-3 py-2 text-xs font-semibold text-destructive-foreground shadow-sm hover:bg-destructive/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? "Cancelando..." : "Cancelar Reserva"}
      </button>
      {error && (
        <p className="text-xs text-destructive max-w-[200px] text-right">{error}</p>
      )}
    </div>
  );
}
