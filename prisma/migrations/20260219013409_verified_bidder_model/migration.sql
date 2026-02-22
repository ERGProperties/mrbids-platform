-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isVerifiedBidder" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "stripeCustomerId" TEXT;
