import { prisma } from "@/lib/db"
import Stripe from "stripe"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

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
      },
    },
  })

  if (!auction) {
    return NextResponse.json({ error: "Auction not found" }, { status: 404 })
  }

  if (auction.status !== "CLOSED") {
    return NextResponse.json({ error: "Auction not closed" }, { status: 400 })
  }

  const highestBid = auction.bids[0]

  if (!highestBid) {
    return NextResponse.json({ error: "No winning bid" }, { status: 400 })
  }

  // Ensure only winning bidder can pay
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user || highestBid.bidderId !== user.id) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 })
  }

  if (!auction.serviceFeeAmount) {
    return NextResponse.json({ error: "Service fee not set" }, { status: 400 })
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "MrBids Service Fee (1%)",
          },
          unit_amount: auction.serviceFeeAmount,
        },
        quantity: 1,
      },
    ],
    metadata: {
      auctionId: auction.id,
      type: "service_fee",
    },
    success_url: `${process.env.NEXTAUTH_URL}/auction/${auction.slug}?fee=success`,
    cancel_url: `${process.env.NEXTAUTH_URL}/auction/${auction.slug}?fee=cancel`,
  })

  return NextResponse.json({ url: checkoutSession.url })
}
