/*
  Warnings:

  - You are about to drop the `SellerApplication` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isMarketplaceSeller" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sellerBio" TEXT,
ADD COLUMN     "sellerCategory" TEXT,
ADD COLUMN     "tiktokUsername" TEXT;

-- DropTable
DROP TABLE "SellerApplication";
