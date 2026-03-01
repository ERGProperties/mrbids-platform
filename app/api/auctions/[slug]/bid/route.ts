import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { emitNotificationEvent } from "@/lib/notifications/emitEvent";

export async function POST(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { amount } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid bid amount" },
        { status: 400 }
      );
    }

    // ⭐ Find auction
    const auction = await prisma.auction.findUnique({
      where: { slug: params.slug },
    });

    if (!auction) {
      return NextResponse.json(
        { error: "Auction not found" },
        { status: 404 }
      );
    }

    // ⭐ NEW — prevent bids after auction ends
    if (auction.endAt <= new Date()) {
      return NextResponse.json(
        { error: "Auction has ended" },
        { status: 400 }
      );
    }

    // ⭐ ALWAYS fetch previous highest bid fresh
    const previousHighestBid = await prisma.bid.findFirst({
      where: { auctionId: auction.id },
      orderBy: { amount: "desc" },
      select: {
        id: true,
        amount: true,
        bidderId: true,
      },
    });

    const highestBid = previousHighestBid?.amount || 0;

    if (amount <= highestBid) {
      return NextResponse.json(
        { error: "Bid must be higher than current bid" },
        { status: 400 }
      );
    }

    // ⭐ Find user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // ⭐ Create bid
    const newBid = await prisma.bid.create({
      data: {
        amount,
        auctionId: auction.id,
        bidderId: user.id,
      },
    });

    // ⭐ Update bid count
    await prisma.auction.update({
      where: { id: auction.id },
      data: {
        bidCount: {
          increment: 1,
        },
      },
    });

    // ⭐ NEW HIGHEST BID EMAIL
    if (
      !previousHighestBid ||
      previousHighestBid.bidderId !== user.id
    ) {
      await emitNotificationEvent({
        type: "NEW_HIGHEST_BID",
        userId: user.id,
        auctionId: auction.id,
        bidAmount: newBid.amount,
      });
    }

    // ⭐ OUTBID EMAIL
    if (
      previousHighestBid &&
      previousHighestBid.bidderId !== user.id
    ) {
      await emitNotificationEvent({
        type: "OUTBID",
        userId: previousHighestBid.bidderId,
        auctionId: auction.id,
        bidAmount: newBid.amount,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("BID API ERROR:", err);

    return NextResponse.json(
      { error: "Server error placing bid" },
      { status: 500 }
    );
  }
}