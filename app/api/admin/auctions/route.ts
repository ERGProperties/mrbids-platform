import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  const auctions = await prisma.auction.findMany({
    orderBy: { endAt: "asc" },
    include: {
      bids: {
        orderBy: { amount: "desc" },
        take: 1,
      },
    },
  })

  const data = auctions.map((a) => ({
    id: a.id,
    slug: a.slug,
    addressLine: a.addressLine,
    cityStateZip: a.cityStateZip,
    status: a.status,
    result: a.result,
    escrowStatus: a.escrowStatus,
    escrowAmount: a.escrowAmount,
    escrowDueBy: a.escrowDueBy
      ? a.escrowDueBy.toISOString()
      : null,
    startingBid: a.startingBid,
    bidIncrement: a.bidIncrement,
    arv: a.arv,
    endAt: a.endAt.toISOString(),
    highestBid:
      a.bids[0]?.amount ??
      a.finalPrice ??
      a.startingBid,
  }))

  return NextResponse.json(data)
}

