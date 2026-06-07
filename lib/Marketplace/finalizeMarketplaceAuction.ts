import { prisma } from "@/lib/prisma";

export async function finalizeMarketplaceAuction(
  auctionId: string
) {
  const auction =
    await prisma.marketplaceAuction.findUnique({
      where: {
        id: auctionId,
      },

      include: {
        bids: {
          orderBy: {
            amount: "desc",
          },

          take: 1,
        },

        seller: true,
      },
    });

  if (!auction) return;

  const highestBid =
    auction.bids[0];

  // NO BIDS
  if (!highestBid) {

    await prisma.marketplaceAuction.update({
      where: {
        id: auctionId,
      },

      data: {
        status: "ENDED",
      },
    });

    return;
  }

  // RESERVE CHECK
  const reserveMet =
    !auction.reservePrice ||
    highestBid.amount >=
      auction.reservePrice;

  // RESERVE NOT MET
  if (!reserveMet) {

    await prisma.marketplaceAuction.update({
      where: {
        id: auctionId,
      },

      data: {
        status:
          "RESERVE_NOT_MET",
      },
    });

    return;
  }

  // SUCCESSFUL SALE
  await prisma.marketplaceAuction.update({
    where: {
      id: auctionId,
    },

    data: {
      status: "ENDED",

      winnerId:
        highestBid.bidderId,

      currentBid:
        highestBid.amount,
    },
  });
}