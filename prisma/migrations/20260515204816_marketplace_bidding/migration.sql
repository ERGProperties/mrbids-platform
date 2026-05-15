/*
  Warnings:

  - Made the column `currentBid` on table `MarketplaceAuction` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
ALTER TYPE "MarketplaceAuctionStatus" ADD VALUE 'SCHEDULED';

-- AlterTable
ALTER TABLE "MarketplaceAuction" ADD COLUMN     "bidCount" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "currentBid" SET NOT NULL,
ALTER COLUMN "currentBid" SET DEFAULT 0;

-- CreateTable
CREATE TABLE "MarketplaceBid" (
    "id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "auctionId" TEXT NOT NULL,
    "bidderId" TEXT NOT NULL,

    CONSTRAINT "MarketplaceBid_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MarketplaceBid_auctionId_createdAt_idx" ON "MarketplaceBid"("auctionId", "createdAt");

-- CreateIndex
CREATE INDEX "MarketplaceBid_bidderId_idx" ON "MarketplaceBid"("bidderId");

-- AddForeignKey
ALTER TABLE "MarketplaceBid" ADD CONSTRAINT "MarketplaceBid_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "MarketplaceAuction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketplaceBid" ADD CONSTRAINT "MarketplaceBid_bidderId_fkey" FOREIGN KEY ("bidderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
