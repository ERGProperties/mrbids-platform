import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function GET() {
  const now = new Date()

  // =========================
  // AUTO-CLOSE EXPIRED AUCTIONS
  // =========================
  const expiredAuctions = await prisma.auction.findMany({
    where: {
      status: "LIVE",
      endAt: {
        lt: now,
      },
    },
  })

  for (const auction of expiredAuctions) {
    const highestBid = await prisma.bid.findFirst({
      where: { auctionId: auction.id },
      orderBy: { amount: "desc" },
      include: { bidder: true },
    })

    if (!highestBid) {
      await prisma.auction.update({
        where: { id: auction.id },
        data: {
          status: "CLOSED",
          result: "NO_SALE",
        },
      })
      continue
    }

    const serviceFeeAmount = Math.ceil(
      highestBid.amount * 0.01
    )

    await prisma.auction.update({
      where: { id: auction.id },
      data: {
        status: "CLOSED",
        result: "SOLD",
        finalPrice: highestBid.amount,
        serviceFeeAmount,
        serviceFeeStatus: "PENDING",
      },
    })

    // 🔔 Email winner
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: highestBid.bidder.email,
      subject: "You won the auction — Action Required",
      html: `
        <h2>Congratulations!</h2>
        <p>You won the auction for <strong>${auction.addressLine}</strong>.</p>
        <p>Final Price: $${(highestBid.amount / 100).toLocaleString()}</p>
        <p>A 1% service fee is required to access seller contact information.</p>
        <p><a href="${process.env.NEXTAUTH_URL}/auctions/${auction.slug}/result">Click here to complete payment</a></p>
      `,
    })
  }

  // =========================
  // FETCH LIVE AUCTIONS
  // =========================
  const auctions = await prisma.auction.findMany({
    orderBy: { endAt: "asc" },
    include: {
      bids: {
        orderBy: { amount: "desc" },
        take: 1,
      },
    },
  })

  // =========================
  // RESPONSE DATA
  // =========================
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

    // 🔥 NEW: live bidding activity
    bidCount: auction.bidCount,

    highestBid:
      auction.bids[0]?.amount ??
      auction.finalPrice ??
      auction.startingBid,
  }))

  return NextResponse.json(data)
}
