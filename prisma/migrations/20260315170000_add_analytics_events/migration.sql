CREATE TYPE "AnalyticsEventType" AS ENUM (
    'TOUR_VIEWED',
    'RESERVE_CLICKED',
    'CHECKOUT_STARTED',
    'PIX_GENERATED',
    'PAYMENT_CONFIRMED'
);

CREATE TABLE "AnalyticsEvent" (
    "id" TEXT NOT NULL,
    "type" "AnalyticsEventType" NOT NULL,
    "userId" TEXT,
    "tripId" TEXT,
    "bookingId" TEXT,
    "paymentAttemptId" TEXT,
    "sessionId" TEXT,
    "path" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnalyticsEvent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AnalyticsEvent_type_createdAt_idx" ON "AnalyticsEvent"("type", "createdAt");
CREATE INDEX "AnalyticsEvent_tripId_type_createdAt_idx" ON "AnalyticsEvent"("tripId", "type", "createdAt");
CREATE INDEX "AnalyticsEvent_bookingId_type_createdAt_idx" ON "AnalyticsEvent"("bookingId", "type", "createdAt");
CREATE INDEX "AnalyticsEvent_sessionId_createdAt_idx" ON "AnalyticsEvent"("sessionId", "createdAt");

ALTER TABLE "AnalyticsEvent"
ADD CONSTRAINT "AnalyticsEvent_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "AnalyticsEvent"
ADD CONSTRAINT "AnalyticsEvent_tripId_fkey"
FOREIGN KEY ("tripId") REFERENCES "Trip"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "AnalyticsEvent"
ADD CONSTRAINT "AnalyticsEvent_bookingId_fkey"
FOREIGN KEY ("bookingId") REFERENCES "Booking"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "AnalyticsEvent"
ADD CONSTRAINT "AnalyticsEvent_paymentAttemptId_fkey"
FOREIGN KEY ("paymentAttemptId") REFERENCES "PaymentAttempt"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
