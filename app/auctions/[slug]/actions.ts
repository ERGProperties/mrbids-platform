"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function submitBid({
  slug,
  amount,
}: {
  slug: string;
  amount: number;
}) {
  const session = await getServerSession(authOptions);

  // ⭐ FIX: check user id instead of email
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

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
    throw new Error("Auction not found");
  }

  const highestBid =
    auction.bids[0]?.amount ??
    auction.finalPrice ??
    auction.startingBid ??
    0;

  const minimumBid =
    highestBid + (auction.bidIncrement ?? 0);

  if (amount < minimumBid) {
    throw new Error(
      `Bid must be at least ${minimumBid}`
    );
  }

  await prisma.bid.create({
    data: {
      amount,
      auctionId: auction.id,
      bidderId: session.user.id,
    },
  });

  await prisma.auction.update({
    where: { id: auction.id },
    data: {
      bidCount: {
        increment: 1,
      },
    },
  });

  return { success: true };
}