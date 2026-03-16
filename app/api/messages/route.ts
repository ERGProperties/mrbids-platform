import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {

  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { auctionId, body } = await req.json();

  if (!auctionId || !body) {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }

  const sender = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!sender) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );
  }

  const auction = await prisma.auction.findUnique({
    where: { id: auctionId },
    include: {
      seller: true,
      bids: {
        orderBy: { amount: "desc" },
        take: 1,
      },
    },
  });

  if (!auction) {
    return NextResponse.json(
      { error: "Auction not found" },
      { status: 404 }
    );
  }

  const winnerId = auction.bids[0]?.bidderId;

  if (!winnerId) {
    return NextResponse.json(
      { error: "No winning bidder" },
      { status: 400 }
    );
  }

  // Only seller or winner allowed
  if (sender.id !== winnerId && sender.id !== auction.sellerId) {
    return NextResponse.json(
      { error: "Not authorized" },
      { status: 403 }
    );
  }

  const receiverId =
    sender.id === winnerId
      ? auction.sellerId
      : winnerId;

  const message = await prisma.message.create({
    data: {
      auctionId,
      senderId: sender.id,
      receiverId: receiverId!,
      body,
    },
  });

  return NextResponse.json(message);
}