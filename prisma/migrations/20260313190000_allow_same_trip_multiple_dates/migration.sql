-- DropIndex
DROP INDEX "Booking_userId_tripId_key";

-- CreateIndex
CREATE INDEX "Booking_userId_tripId_scheduleId_idx" ON "Booking"("userId", "tripId", "scheduleId");
