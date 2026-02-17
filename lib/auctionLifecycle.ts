import { prisma } from "@/lib/db";

export async function autoCloseExpiredAuctions() {
  const now = new Date();

  const expired = await prisma.auction.findMany({
    where: {
      status: "LIVE",
      endAt: { lt: now },
    },
  });

  for (const auction of expired) {
    await prisma.auction.update({
      where: { id: auction.id },
      data: {
        status: "CLOSED",
      },
    });
  }
}
