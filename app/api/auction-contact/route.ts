import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { auctionId } = await req.json()

  const auction = await prisma.auction.findUnique({
    where: { id: auctionId },
    include: {
      bids: {
        orderBy: { amount: "desc" },
        take: 1,
        include: { bidder: true },
      },
    },
  })

  if (!auction) {
    return NextResponse.json({ error: "Auction not found" }, { status: 404 })
  }

  const winningBid = auction.bids[0]

  if (!winningBid) {
    return NextResponse.json({ error: "No winner" }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user || user.id !== winningBid.bidderId) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 })
  }

  if (auction.serviceFeeStatus !== "PAID") {
    return NextResponse.json(
      { error: "Service fee not paid" },
      { status: 403 }
    )
  }

  // Replace with real seller data later
  return NextResponse.json({
    sellerEmail: "seller@example.com",
    sellerPhone: "(555) 123-4567",
  })
}
