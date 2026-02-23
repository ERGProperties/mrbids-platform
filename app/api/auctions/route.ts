import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const auctions = await prisma.auction.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      bids: {
        orderBy: { amount: "desc" },
        take: 1,
      },
    },
  });

  const data = auctions.map((a) => ({
    id: a.id,
    slug: a.slug,
    title: a.title,
    addressLine: a.addressLine,
    cityStateZip: a.cityStateZip,
    status: a.status,
    result: a.result,

    startingBid: a.startingBid,
    bidIncrement: a.bidIncrement,
    arv: a.arv,

    // ⭐ SAFE NULL HANDLING
    startAt: a.startAt
      ? a.startAt.toISOString()
      : null,

    endAt: a.endAt
      ? a.endAt.toISOString()
      : null,

    createdAt: a.createdAt.toISOString(),

    highestBid:
      a.bids[0]?.amount ??
      a.finalPrice ??
      a.startingBid ??
      0,
  }));

  return NextResponse.json(data);
}