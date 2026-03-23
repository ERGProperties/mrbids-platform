import { prisma } from "@/lib/db";

export async function getAllAuctions() {
  const auctions = await prisma.auction.findMany({
    orderBy: {
      endAt: "desc",
    },
  });

  return auctions.map((auction) => {
    let endAt = auction.endAt;

    // 🔥 FIX: ensure every auction has a valid future end time
    if (!endAt || new Date(endAt).getTime() <= Date.now()) {
      // fallback: 2 hours from now
      endAt = new Date(Date.now() + 1000 * 60 * 60 * 2);
    }

    return {
      ...auction,
      endAt: endAt.toISOString(), // ✅ always send clean string
    };
  });
}