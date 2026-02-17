import { prisma } from "@/lib/db";

export async function getAllAuctions() {
  return prisma.auction.findMany({
    orderBy: {
      endAt: "desc",
    },
  });
}
