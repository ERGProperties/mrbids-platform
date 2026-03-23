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

    return Response.json({
      highestBid,
      // ✅ FIX: use endAt (consistent everywhere)
      endAt: auction.endAt
        ? auction.endAt.toISOString()
        : null,
      bidCount: auction.bidCount ?? 0,
    });
  } catch (err) {
    console.error("AUCTION FETCH ERROR:", err);

    return new Response("Server error", { status: 500 });
  }
}