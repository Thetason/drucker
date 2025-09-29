/*
  Warnings:

  - You are about to drop the column `completed` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `dueDate` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `platform` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `stage` on the `Task` table. All the data in the column will be lost.
  - Added the required column `date` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."TaskStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'DELAYED');

-- CreateEnum
CREATE TYPE "public"."TaskPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "public"."ResetStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "public"."ContentPlan" ADD COLUMN     "metadata" JSONB;

-- AlterTable
ALTER TABLE "public"."Task" DROP COLUMN "completed",
DROP COLUMN "dueDate",
DROP COLUMN "notes",
DROP COLUMN "platform",
DROP COLUMN "stage",
ADD COLUMN     "color" TEXT,
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "endTime" TEXT,
ADD COLUMN     "planId" TEXT,
ADD COLUMN     "priority" "public"."TaskPriority" NOT NULL DEFAULT 'MEDIUM',
ADD COLUMN     "reminderMethod" TEXT,
ADD COLUMN     "reminderMinutes" INTEGER,
ADD COLUMN     "startTime" TEXT,
ADD COLUMN     "status" "public"."TaskStatus" NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE "public"."PasswordResetRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "public"."ResetStatus" NOT NULL DEFAULT 'PENDING',
    "resolverEmail" TEXT,
    "resolverNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PasswordResetRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Task" ADD CONSTRAINT "Task_planId_fkey" FOREIGN KEY ("planId") REFERENCES "public"."ContentPlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PasswordResetRequest" ADD CONSTRAINT "PasswordResetRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
