import { prisma } from "@/lib/db"

export async function closeExpiredAuctions() {
  const now = new Date()

  const auctions = await prisma.auction.findMany({
    where: {
      status: "LIVE",
      endAt: {
        lte: now,
      },
    },
    include: {
      bids: {
        orderBy: { amount: "desc" },
        take: 1,
      },
    },
  })

  for (const auction of auctions) {
    const winningBid =
      auction.bids[0]?.amount ?? auction.startingBid

    await prisma.auction.update({
      where: { id: auction.id },
      data: {
        status: "CLOSED",
        finalPrice: winningBid,
      },
    })
  }

  return auctions.length
}
