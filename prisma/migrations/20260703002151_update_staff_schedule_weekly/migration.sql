/*
  Warnings:

  - You are about to drop the column `date` on the `StaffSchedule` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[staffId,dayOfWeek]` on the table `StaffSchedule` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dayOfWeek` to the `StaffSchedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `StaffSchedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StaffSchedule" DROP COLUMN "date",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "dayOfWeek" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "startTime" DROP NOT NULL,
ALTER COLUMN "endTime" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "StaffSchedule_staffId_dayOfWeek_key" ON "StaffSchedule"("staffId", "dayOfWeek");

-- AddForeignKey
ALTER TABLE "StaffSchedule" ADD CONSTRAINT "StaffSchedule_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
