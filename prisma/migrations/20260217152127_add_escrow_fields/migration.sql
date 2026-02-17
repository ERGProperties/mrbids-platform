-- AlterTable
ALTER TABLE "Auction" ADD COLUMN "escrowAmount" INTEGER;
ALTER TABLE "Auction" ADD COLUMN "escrowDueBy" DATETIME;
ALTER TABLE "Auction" ADD COLUMN "escrowStatus" TEXT;
