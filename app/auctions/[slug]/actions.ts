"use server"

import { placeBid } from "@/lib/bidding/placeBid"
import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import { revalidatePath } from "next/cache"

export async function submitBid(
  slug: string,
  amount: number
) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    throw new Error("Unauthorized")
  }

  const auction = await prisma.auction.findUnique({
    where: { slug },
  })

  if (!auction) {
    throw new Error("Auction not found")
  }

  await placeBid({
    auctionId: auction.id,
    userId: session.user.id!,
    amount,
  })

  revalidatePath(`/auctions/${slug}`)
}
