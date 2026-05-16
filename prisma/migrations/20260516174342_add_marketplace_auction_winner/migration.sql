-- AlterTable
ALTER TABLE "MarketplaceAuction" ADD COLUMN     "winnerId" TEXT;

-- AddForeignKey
ALTER TABLE "MarketplaceAuction" ADD CONSTRAINT "MarketplaceAuction_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
