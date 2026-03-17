import { prisma } from "@/lib/db";

export async function finalizeAuction(auctionId: string) {
  const auction = await prisma.auction.findUnique({
    where: { id: auctionId },
    include: {
      bids: {
        orderBy: { amount: "desc" },
        take: 1,
      },
    },
  });

  if (!auction) return;

  const highestBid = auction.bids[0];

  if (!highestBid) {
    // No bids → just close it
    await prisma.auction.update({
      where: { id: auctionId },
      data: {
        status: "CLOSED",
        result: "NO_BIDS",
      },
    });

    return;
  }

  await prisma.auction.update({
    where: { id: auctionId },
    data: {
      status: "CLOSED",
      finalPrice: highestBid.amount,
      result: highestBid.bidderId, // store userId (recommended)
    },
  });
}