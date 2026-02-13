import TripList from "./trip-list";
import { MyBookings } from "./my-bookings";
import { ReservationHeaders } from "./reservation-headers";
import { SectionTitles } from "./section-titles";

// Server Component - can use Prisma
export function ReservationsSection() {
  return (
    <ReservationHeaders>
      <div className="mb-10">
        <SectionTitles section="myBookings" />
        <MyBookings />
      </div>

      <div>
        <SectionTitles section="availableTrips" />
        <TripList />
      </div>
    </ReservationHeaders>
  );
}
