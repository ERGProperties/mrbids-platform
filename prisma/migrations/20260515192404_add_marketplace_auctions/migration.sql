-- CreateEnum
CREATE TYPE "MarketplaceAuctionStatus" AS ENUM ('DRAFT', 'LIVE', 'ENDED');

-- CreateTable
CREATE TABLE "MarketplaceAuction" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "images" JSONB,
    "coverImage" TEXT,
    "startingBid" INTEGER NOT NULL,
    "bidIncrement" INTEGER NOT NULL DEFAULT 1,
    "currentBid" INTEGER,
    "startAt" TIMESTAMP(3),
    "endAt" TIMESTAMP(3),
    "status" "MarketplaceAuctionStatus" NOT NULL DEFAULT 'DRAFT',
    "sellerId" TEXT NOT NULL,

    CONSTRAINT "MarketplaceAuction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MarketplaceAuction_sellerId_idx" ON "MarketplaceAuction"("sellerId");

-- CreateIndex
CREATE INDEX "MarketplaceAuction_status_idx" ON "MarketplaceAuction"("status");

-- AddForeignKey
ALTER TABLE "MarketplaceAuction" ADD CONSTRAINT "MarketplaceAuction_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
