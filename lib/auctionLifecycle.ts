import { prisma } from "@/lib/prisma";

import { finalizeAuction } from "@/lib/auctions/finalizeAuction";

import { finalizeMarketplaceAuction } from "@/lib/marketplace/finalizeMarketplaceAuction";

export async function autoCloseExpiredAuctions() {

  const now = new Date();

  // REAL ESTATE AUCTIONS
  const expiredAuctions =
    await prisma.auction.findMany({
      where: {
        status: "LIVE",

        endAt: {
          lt: now,
        },
      },

      select: {
        id: true,
      },
    });

  for (const auction of expiredAuctions) {

    try {

      await finalizeAuction(
        auction.id
      );

    } catch (err) {

      console.error(
        `Failed to finalize auction ${auction.id}:`,
        err
      );

    }
  }

  // MARKETPLACE AUCTIONS
  const expiredMarketplaceAuctions =
    await prisma.marketplaceAuction.findMany({
      where: {
        status: "LIVE",

        endAt: {
          lt: now,
        },
      },

      select: {
        id: true,
      },
    });

  for (const auction of expiredMarketplaceAuctions) {

    try {

      await finalizeMarketplaceAuction(
        auction.id
      );

    } catch (err) {

      console.error(
        `Failed to finalize marketplace auction ${auction.id}:`,
        err
      );

    }
  }
}