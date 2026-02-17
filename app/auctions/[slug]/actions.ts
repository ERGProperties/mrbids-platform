"use server";

import { prisma } from "@/lib/db";
import { placeBid } from "@/lib/bidding/placeBid";

export async function submitBid(
  slug: string,
  amount: number
) {
  const auction = await prisma.auction.findUnique({
    where: { slug },
  });

  if (!auction) {
    throw new Error("Auction not found");
  }

  await placeBid(auction.id, amount);
}
