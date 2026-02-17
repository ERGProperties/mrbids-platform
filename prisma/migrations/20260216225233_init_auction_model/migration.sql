-- CreateTable
CREATE TABLE "Auction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "addressLine" TEXT NOT NULL,
    "cityStateZip" TEXT NOT NULL,
    "startAt" DATETIME NOT NULL,
    "endAt" DATETIME NOT NULL,
    "startingBid" INTEGER NOT NULL,
    "bidIncrement" INTEGER NOT NULL,
    "arv" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "finalPrice" INTEGER,
    "bidCount" INTEGER,
    "durationDays" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Auction_slug_key" ON "Auction"("slug");
