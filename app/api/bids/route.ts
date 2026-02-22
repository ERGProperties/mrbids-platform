import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const BID_COOLDOWN_SECONDS = 5;
const AUTO_EXTEND_WINDOW_SECONDS = 60;
const AUTO_EXTEND_BY_SECONDS = 120;

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // 🔒 Fetch user to check verification
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user || !user.isVerifiedBidder) {
    return NextResponse.json(
      { error: "You must verify your payment method before bidding." },
      { status: 403 }
    );
  }

  const body = await req.json();
  const auctionId = body?.auctionId;
  const amount = Number(body?.amount);

  if (!auctionId || !Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json(
      { error: "Invalid bid data" },
      { status: 400 }
    );
  }

  const auction = await prisma.auction.findUnique({
    where: { id: auctionId },
    include: {
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

  if (auction.status !== "LIVE") {
    return NextResponse.json(
      { error: "Auction is not live" },
      { status: 400 }
    );
  }

  const now = new Date();

  if (auction.endAt <= now) {
    return NextResponse.json(
      { error: "Auction has ended" },
      { status: 400 }
    );
  }

  const highestBid = auction.bids[0];

  // 🚫 Prevent self-outbidding
  if (highestBid && highestBid.bidderId === session.user.id) {
    return NextResponse.json(
      { error: "You are already the highest bidder." },
      { status: 400 }
    );
  }

  const minAllowedBid = highestBid
    ? highestBid.amount + auction.bidIncrement
    : auction.startingBid;

  if (amount < minAllowedBid) {
    return NextResponse.json(
      { error: `Bid must be at least ${minAllowedBid}` },
      { status: 400 }
    );
  }

  const recentBid = await prisma.bid.findFirst({
    where: {
      auctionId,
      bidderId: session.user.id,
    },
    orderBy: { createdAt: "desc" },
  });

  if (recentBid) {
    const secondsSinceLastBid =
      (Date.now() - recentBid.createdAt.getTime()) / 1000;

    if (secondsSinceLastBid < BID_COOLDOWN_SECONDS) {
      return NextResponse.json(
        {
          error: `Please wait ${Math.ceil(
            BID_COOLDOWN_SECONDS - secondsSinceLastBid
          )}s before bidding again.`,
        },
        { status: 429 }
      );
    }
  }

  const secondsRemaining =
    (auction.endAt.getTime() - now.getTime()) / 1000;

  const shouldExtend =
    secondsRemaining <= AUTO_EXTEND_WINDOW_SECONDS;

  const bid = await prisma.$transaction(async (tx) => {
    const newBid = await tx.bid.create({
      data: {
        amount,
        auctionId: auction.id,
        bidderId: session.user.id,
      },
    });

    await tx.auction.update({
      where: { id: auction.id },
      data: {
        bidCount: { increment: 1 },
        ...(shouldExtend && {
          endAt: new Date(
            auction.endAt.getTime() +
              AUTO_EXTEND_BY_SECONDS * 1000
          ),
        }),
      },
    });

    return newBid;
  });

  return NextResponse.json({
    success: true,
    extended: shouldExtend,
    bid,
  });
}
