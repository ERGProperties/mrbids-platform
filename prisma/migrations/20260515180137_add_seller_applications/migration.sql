-- CreateTable
CREATE TABLE "SellerApplication" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "tiktok" TEXT,
    "category" TEXT NOT NULL,
    "inventory" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "SellerApplication_pkey" PRIMARY KEY ("id")
);
