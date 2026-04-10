import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const auction = await prisma.auction.findUnique({
      where: { slug },
      include: {
        bids: {
          orderBy: { amount: "desc" },
          take: 1,
          include: {
            bidder: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        seller: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!auction) {
      return new Response("Not found", { status: 404 });
    }

    const highestBid =
      auction.bids[0]?.amount ??
      auction.finalPrice ??
      auction.startingBid ??
      0;

    const leadingBidderId =
      auction.bids[0]?.bidder?.id ?? null;

    const lastBidderName =
      auction.bids[0]?.bidder?.name || "Someone";

    return Response.json({
      ...auction, // ✅ THIS IS THE KEY FIX

      highestBid,
      endAt: auction.endAt
        ? auction.endAt.toISOString()
        : null,
      bidCount: auction.bidCount ?? 0,
      leadingBidderId,
      lastBidderName,
    });
  } catch (err) {
    console.error("AUCTION FETCH ERROR:", err);
    return new Response("Server error", { status: 500 });
  }
}