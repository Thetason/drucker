-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "lastLoginAt" TIMESTAMP(3),
ADD COLUMN     "loginCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "public"."LoginActivity" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LoginActivity_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."LoginActivity" ADD CONSTRAINT "LoginActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
