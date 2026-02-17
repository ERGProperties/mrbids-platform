/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Auction` table. All the data in the column will be lost.
  - Added the required column `imagesPath` to the `Auction` table without a default value. This is not possible if the table is not empty.
  - Made the column `images` on table `Auction` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateTable
CREATE TABLE "Bid" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "auctionId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Bid_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "Auction" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Auction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "addressLine" TEXT NOT NULL,
    "cityStateZip" TEXT NOT NULL,
    "imagesPath" TEXT NOT NULL,
    "images" JSONB NOT NULL,
    "startingBid" INTEGER NOT NULL,
    "bidIncrement" INTEGER NOT NULL,
    "arv" INTEGER,
    "finalPrice" INTEGER,
    "startAt" DATETIME NOT NULL,
    "endAt" DATETIME NOT NULL,
    "status" TEXT NOT NULL,
    "bidCount" INTEGER NOT NULL DEFAULT 0,
    "durationDays" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Auction" ("addressLine", "arv", "bidCount", "bidIncrement", "cityStateZip", "createdAt", "durationDays", "endAt", "finalPrice", "id", "images", "slug", "startAt", "startingBid", "status", "title") SELECT "addressLine", "arv", coalesce("bidCount", 0) AS "bidCount", "bidIncrement", "cityStateZip", "createdAt", "durationDays", "endAt", "finalPrice", "id", "images", "slug", "startAt", "startingBid", "status", "title" FROM "Auction";
DROP TABLE "Auction";
ALTER TABLE "new_Auction" RENAME TO "Auction";
CREATE UNIQUE INDEX "Auction_slug_key" ON "Auction"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "Bid_auctionId_createdAt_idx" ON "Bid"("auctionId", "createdAt");
