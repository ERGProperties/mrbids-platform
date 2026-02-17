import { prisma } from "@/lib/db"
import {
  AUCTION_EXTENSION_WINDOW_MINUTES,
  AUCTION_EXTENSION_DURATION_MINUTES,
} from "@/lib/auctionRules"
import { sendOutbidEmail } from "@/lib/email/sendOutbidEmail"

export async function placeBid({
  auctionId,
  userId,
  amount,
}: {
  auctionId: string
  userId: string
  amount: number
}) {
  return prisma.$transaction(async (tx) => {
    const auction = await tx.auction.findUnique({
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
      throw new Error("Auction not found")
    }

    if (auction.status !== "LIVE") {
      throw new Error("Auction is closed")
    }

    const now = new Date()
    if (auction.endAt <= now) {
      throw new Error("Auction has ended")
    }

    const previousBidder = auction.bids[0]?.bidder

    // ✅ FIX: bidderId is REQUIRED
    const bid = await tx.bid.create({
      data: {
        auctionId,
        bidderId: userId,
        amount,
      },
    })

    // Notify previous highest bidder
    if (
      previousBidder &&
      previousBidder.id !== userId &&
      previousBidder.email
    ) {
      await sendOutbidEmail({
        to: previousBidder.email,
        address: auction.addressLine,
        auctionUrl: `${process.env.NEXTAUTH_URL}/auctions/${auction.slug}`,
      })
    }

    // Auto-extend logic
    const minutesRemaining =
      (auction.endAt.getTime() - now.getTime()) / 1000 / 60

    if (
      minutesRemaining <=
      AUCTION_EXTENSION_WINDOW_MINUTES
    ) {
      await tx.auction.update({
        where: { id: auction.id },
        data: {
          endAt: new Date(
            auction.endAt.getTime() +
              AUCTION_EXTENSION_DURATION_MINUTES *
                60 *
                1000
          ),
        },
      })
    }

    return bid
  })
}
