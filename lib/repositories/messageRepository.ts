import { prisma } from "@/lib/db";

export async function getAuctionMessages(auctionId: string) {
  return prisma.message.findMany({
    where: {
      auctionId,
    },
    include: {
      sender: {
        select: {
          id: true,
          email: true,
        },
      },
      receiver: {
        select: {
          id: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}