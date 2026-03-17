import { prisma } from "@/lib/db";
import { finalizeAuction } from "@/lib/auctions/finalizeAuction";

export async function autoCloseExpiredAuctions() {
  const now = new Date();

  const expired = await prisma.auction.findMany({
    where: {
      status: "LIVE",
      endAt: { lt: now },
    },
    select: {
      id: true,
    },
  });

  for (const auction of expired) {
    try {
      await finalizeAuction(auction.id);
    } catch (err) {
      console.error(
        `Failed to finalize auction ${auction.id}:`,
        err
      );
    }
  }
}