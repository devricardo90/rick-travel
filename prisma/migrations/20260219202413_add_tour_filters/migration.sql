-- CreateEnum
CREATE TYPE "PhysicalLevel" AS ENUM ('LIGHT', 'MODERATE', 'HARD', 'EXTREME');

-- AlterTable
ALTER TABLE "Trip" ADD COLUMN     "childrenAllowed" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "durationDays" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "physicalLevel" "PhysicalLevel" NOT NULL DEFAULT 'LIGHT';
