import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  const auctions = await prisma.auction.findMany({
    orderBy: { endAt: "asc" },
    include: {
      bids: {
        orderBy: { amount: "desc" },
        take: 1,
      },
    },
  })

  const data = auctions.map((auction) => ({
    id: auction.id,
    slug: auction.slug,
    addressLine: auction.addressLine,
    cityStateZip: auction.cityStateZip,
    status: auction.status,
    startingBid: auction.startingBid,
    bidIncrement: auction.bidIncrement,
    arv: auction.arv,
    endAt: auction.endAt.toISOString(),
    highestBid:
      auction.bids[0]?.amount ??
      auction.finalPrice ??
      auction.startingBid,
  }))

  return NextResponse.json(data)
}
