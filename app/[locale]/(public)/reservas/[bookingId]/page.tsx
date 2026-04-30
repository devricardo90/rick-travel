import { notFound, redirect } from "next/navigation";
import { BookingConfirmation } from "@/components/booking-confirmation";
import { requireSession } from "@/lib/authz";
import { isDomainError } from "@/lib/errors/domain-error";
import { getBookingForUser } from "@/lib/services/booking.service";

interface PageProps {
  params: Promise<{ locale: string; bookingId: string }>;
}

export default async function BookingConfirmationPage(props: PageProps) {
  const { locale, bookingId } = await props.params;
  let booking: Awaited<ReturnType<typeof getBookingForUser>>;

  try {
    const session = await requireSession();
    booking = await getBookingForUser(bookingId, session.user.id);
  } catch (error) {
    if (isDomainError(error) && error.status === 401) {
      redirect(`/${locale}/login`);
    }

    if (isDomainError(error) && error.status === 400) {
      notFound();
    }

    throw error;
  }

  if (!booking) {
    notFound();
  }

  return <BookingConfirmation booking={booking} locale={locale} />;
}
