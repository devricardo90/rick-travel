import { prisma } from "@/lib/prisma";
import { getLocalizedField } from "@/lib/localized-field";
import { resend } from "@/lib/resend";
import { asLocalizedText } from "@/lib/types";

type BookingEmailTemplate = "BOOKING_CONFIRMED" | "PAYMENT_CONFIRMED";

function formatCurrency(cents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

function formatDate(date: Date | null | undefined) {
  return date ? new Date(date).toLocaleDateString("pt-BR") : "A combinar";
}

function buildEmailContent(input: {
  template: BookingEmailTemplate;
  userName: string;
  tripTitle: string;
  dateStr: string;
  guestCount: number;
  totalPriceCents: number;
}) {
  if (input.template === "PAYMENT_CONFIRMED") {
    return {
      subject: `Pagamento confirmado: ${input.tripTitle}`,
      html: `
        <h1>Ola, ${input.userName}!</h1>
        <p>Recebemos o pagamento da sua reserva para <strong>${input.tripTitle}</strong>.</p>
        <p><strong>Resumo:</strong></p>
        <ul>
          <li><strong>Data:</strong> ${input.dateStr}</li>
          <li><strong>Pessoas:</strong> ${input.guestCount}</li>
          <li><strong>Valor pago:</strong> ${formatCurrency(input.totalPriceCents)}</li>
        </ul>
        <p>Sua reserva esta confirmada e nossa equipe enviara os detalhes operacionais em seguida.</p>
        <p>Obrigado por escolher a Rick Travel.</p>
      `,
    };
  }

  return {
    subject: `Reserva confirmada: ${input.tripTitle}`,
    html: `
      <h1>Ola, ${input.userName}!</h1>
      <p>Sua reserva para <strong>${input.tripTitle}</strong> foi confirmada com sucesso.</p>
      <p><strong>Detalhes da reserva:</strong></p>
      <ul>
        <li><strong>Data:</strong> ${input.dateStr}</li>
        <li><strong>Pessoas:</strong> ${input.guestCount}</li>
        <li><strong>Valor total:</strong> ${formatCurrency(input.totalPriceCents)}</li>
      </ul>
      <p>Em breve entraremos em contato com mais detalhes sobre ponto de encontro e horarios.</p>
      <p>Obrigado por escolher a Rick Travel.</p>
    `,
  };
}

export async function sendBookingEmail(bookingId: string, template: BookingEmailTemplate) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      user: true,
      trip: true,
      schedule: true,
    },
  });

  if (!booking || !booking.user.email) {
    return { delivered: false, reason: "BOOKING_OR_EMAIL_NOT_FOUND" as const };
  }

  const emailLog = await prisma.emailLog.create({
    data: {
      to: booking.user.email,
      template,
      bookingId: booking.id,
      status: "QUEUED",
    },
  });

  try {
    const tripTitle = getLocalizedField<string>(asLocalizedText(booking.trip.title), "pt") || "Passeio";
    const content = buildEmailContent({
      template,
      userName: booking.user.name,
      tripTitle,
      dateStr: formatDate(booking.schedule?.startAt),
      guestCount: booking.guestCount,
      totalPriceCents: booking.totalPriceCents,
    });

    const { data, error } = await resend.emails.send({
      from: "Rick Travel <reservas@ricktravel.com.br>",
      to: [booking.user.email],
      subject: content.subject,
      html: content.html,
    });

    if (error) {
      throw error;
    }

    await prisma.emailLog.update({
      where: { id: emailLog.id },
      data: {
        status: "SENT",
        sentAt: new Date(),
        providerMessageId: data?.id,
      },
    });

    return { delivered: true as const, template };
  } catch (error: unknown) {
    console.error("Failed to send email:", error);

    await prisma.emailLog.update({
      where: { id: emailLog.id },
      data: {
        status: "FAILED",
        error: error instanceof Error ? error.message : JSON.stringify(error),
      },
    });

    return { delivered: false as const, template };
  }
}

export async function sendBookingConfirmationEmail(bookingId: string) {
  return sendBookingEmail(bookingId, "BOOKING_CONFIRMED");
}

export async function sendPaymentConfirmedEmail(bookingId: string) {
  return sendBookingEmail(bookingId, "PAYMENT_CONFIRMED");
}

export async function getRecommendedBookingEmailTemplate(bookingId: string): Promise<BookingEmailTemplate | null> {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    select: {
      id: true,
      status: true,
      paymentStatus: true,
    },
  });

  if (!booking) {
    return null;
  }

  if (booking.paymentStatus === "PAID") {
    return "PAYMENT_CONFIRMED";
  }

  if (booking.status === "CONFIRMED") {
    return "BOOKING_CONFIRMED";
  }

  return null;
}
