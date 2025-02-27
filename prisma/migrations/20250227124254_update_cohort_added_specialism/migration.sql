/*
  Warnings:

  - You are about to drop the column `endDate` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `jobTitle` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `specialism` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Cohort" ADD COLUMN     "endDate" TEXT,
ADD COLUMN     "jobTitle" TEXT,
ADD COLUMN     "specialismId" INTEGER,
ADD COLUMN     "startDate" TEXT;

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "endDate",
DROP COLUMN "jobTitle",
DROP COLUMN "specialism",
DROP COLUMN "startDate";

-- CreateTable
CREATE TABLE "Specialism" (
    "id" SERIAL NOT NULL,
    "specialismName" TEXT NOT NULL,

    CONSTRAINT "Specialism_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Cohort" ADD CONSTRAINT "Cohort_specialismId_fkey" FOREIGN KEY ("specialismId") REFERENCES "Specialism"("id") ON DELETE SET NULL ON UPDATE CASCADE;
