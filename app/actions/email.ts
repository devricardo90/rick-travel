import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";
import { getLocalizedField } from "@/lib/translation-service";

export async function sendBookingConfirmationEmail(bookingId: string) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      user: true,
      trip: true,
      schedule: true,
    },
  });

  if (!booking || !booking.user.email) return;

  const emailLog = await prisma.emailLog.create({
    data: {
      to: booking.user.email,
      template: "BOOKING_CONFIRMED",
      bookingId: booking.id,
      status: "QUEUED",
    },
  });

  try {
    const tripTitle = getLocalizedField<string>(booking.trip.title, 'pt') || "Passeio";
    const dateStr = booking.schedule 
      ? new Date(booking.schedule.startAt).toLocaleDateString('pt-BR')
      : "A combinar";

    const { data, error } = await resend.emails.send({
      from: 'Rick Travel <reservas@ricktravel.com.br>',
      to: [booking.user.email],
      subject: `Reserva Confirmada: ${tripTitle}`,
      html: `
        <h1>Olá, ${booking.user.name}!</h1>
        <p>Sua reserva para <strong>${tripTitle}</strong> foi confirmada com sucesso.</p>
        <p><strong>Detalhes da Reserva:</strong></p>
        <ul>
          <li><strong>Data:</strong> ${dateStr}</li>
          <li><strong>Pessoas:</strong> ${booking.guestCount}</li>
          <li><strong>Valor Total:</strong> ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(booking.totalPriceCents / 100)}</li>
        </ul>
        <p>Em breve entraremos em contato com mais detalhes sobre o ponto de encontro e horários.</p>
        <p>Obrigado por escolher a Rick Travel!</p>
      `,
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
  } catch (err: any) {
    console.error("Failed to send email:", err);
    await prisma.emailLog.update({
      where: { id: emailLog.id },
      data: {
        status: "FAILED",
        error: err.message || JSON.stringify(err),
      },
    });
  }
}
