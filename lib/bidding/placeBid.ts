import { prisma } from "@/lib/db";

// Anti-sniping configuration
const SNIPING_WINDOW_MINUTES = 5;
const EXTEND_BY_MINUTES = 5;

export async function placeBid(
  auctionId: string,
  amount: number
) {
  const auction = await prisma.auction.findUnique({
    where: { id: auctionId },
    include: {
      bids: {
        orderBy: { amount: "desc" },
        take: 1,
      },
    },
  });

  if (!auction) {
    throw new Error("Auction not found");
  }

  if (auction.status !== "LIVE") {
    throw new Error("Auction is not live");
  }

  const now = new Date();

  if (now > auction.endAt) {
    throw new Error("Auction has ended");
  }

  const highestBid =
    auction.bids[0]?.amount ??
    auction.finalPrice ??
    auction.startingBid;

  const minimumNextBid =
    highestBid + auction.bidIncrement;

  if (amount < minimumNextBid) {
    throw new Error(
      `Bid must be at least $${minimumNextBid.toLocaleString()}`
    );
  }

  // ⏱ Anti-sniping logic
  const msRemaining =
    auction.endAt.getTime() - now.getTime();

  const minutesRemaining =
    msRemaining / (1000 * 60);

  let newEndAt: Date | null = null;

  if (minutesRemaining <= SNIPING_WINDOW_MINUTES) {
    newEndAt = new Date(
      auction.endAt.getTime() +
        EXTEND_BY_MINUTES * 60 * 1000
    );
  }

  // 🔒 Atomic transaction
  await prisma.$transaction([
    prisma.bid.create({
      data: {
        auctionId,
        amount,
      },
    }),

    prisma.auction.update({
      where: { id: auctionId },
      data: {
        bidCount: { increment: 1 },
        finalPrice: amount,
        ...(newEndAt ? { endAt: newEndAt } : {}),
      },
    }),
  ]);
}
