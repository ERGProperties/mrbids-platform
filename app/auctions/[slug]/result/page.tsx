import { notFound } from "next/navigation"
import { prisma } from "@/lib/db"
import ResultClient from "./ResultClient"

export const dynamic = "force-dynamic"

export default async function AuctionResult({
  params,
}: {
  params: { slug: string }
}) {
  const auction = await prisma.auction.findUnique({
    where: { slug: params.slug },
    include: {
      bids: {
        orderBy: { amount: "desc" },
        take: 1,
        include: { bidder: true },
      },
    },
  })

  if (!auction) {
    notFound()
  }

  const winningBid = auction.bids[0] ?? null

  return (
    <ResultClient
      auction={{
        id: auction.id,
        slug: auction.slug,
        addressLine: auction.addressLine,
        cityStateZip: auction.cityStateZip,
        finalPrice:
          auction.finalPrice ??
          winningBid?.amount ??
          auction.startingBid,
        status: auction.status,
        result: auction.result,
        winnerEmail: winningBid?.bidder?.email ?? null,
        escrowStatus: auction.escrowStatus,
        escrowAmount: auction.escrowAmount,
        escrowDueBy: auction.escrowDueBy
          ? auction.escrowDueBy.toISOString()
          : null,
      }}
    />
  )
}

