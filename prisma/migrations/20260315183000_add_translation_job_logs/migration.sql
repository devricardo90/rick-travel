CREATE TYPE "TranslationOperation" AS ENUM (
    'CREATE',
    'UPDATE'
);

CREATE TYPE "TranslationJobStatus" AS ENUM (
    'SUCCESS',
    'PARTIAL_FALLBACK',
    'FULL_FALLBACK'
);

CREATE TABLE "TranslationJobLog" (
    "id" TEXT NOT NULL,
    "tripId" TEXT,
    "entityType" TEXT NOT NULL,
    "operation" "TranslationOperation" NOT NULL,
    "provider" TEXT NOT NULL,
    "status" "TranslationJobStatus" NOT NULL,
    "sourceLocale" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TranslationJobLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "TranslationJobLog_tripId_createdAt_idx" ON "TranslationJobLog"("tripId", "createdAt");
CREATE INDEX "TranslationJobLog_status_createdAt_idx" ON "TranslationJobLog"("status", "createdAt");

ALTER TABLE "TranslationJobLog"
ADD CONSTRAINT "TranslationJobLog_tripId_fkey"
FOREIGN KEY ("tripId") REFERENCES "Trip"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
