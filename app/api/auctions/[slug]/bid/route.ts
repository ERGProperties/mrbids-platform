import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { emitNotificationEvent } from "@/lib/notifications/emitEvent";
import {
  SOFT_CLOSE_WINDOW_MINUTES,
  SOFT_CLOSE_EXTENSION_MINUTES,
} from "@/lib/auctionConfig";

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

    const result = await prisma.$transaction(async (tx) => {
      // ⭐ Find auction inside transaction
      const auction = await tx.auction.findUnique({
        where: { slug: params.slug },
      });

      if (!auction) {
        throw new Error("Auction not found");
      }

      // ⭐ Prevent bids after auction ends
      if (auction.endAt <= new Date()) {
        throw new Error("Auction has ended");
      }

      // ⭐ Always fetch highest bid fresh
      const previousHighestBid = await tx.bid.findFirst({
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
        throw new Error("Bid must be higher than current bid");
      }

      // ⭐ Create bid
      const newBid = await tx.bid.create({
        data: {
          amount,
          auctionId: auction.id,
          bidderId: user.id,
        },
      });

      // ⭐ SOFT CLOSE LOGIC
      const now = new Date();
      const msRemaining =
        auction.endAt.getTime() - now.getTime();

      const SOFT_CLOSE_WINDOW_MS =
        SOFT_CLOSE_WINDOW_MINUTES * 60 * 1000;

      const SOFT_CLOSE_EXTENSION_MS =
        SOFT_CLOSE_EXTENSION_MINUTES * 60 * 1000;

      let auctionExtended = false;

      if (
        msRemaining > 0 &&
        msRemaining <= SOFT_CLOSE_WINDOW_MS
      ) {
        await tx.auction.update({
          where: { id: auction.id },
          data: {
            endAt: new Date(
              auction.endAt.getTime() +
                SOFT_CLOSE_EXTENSION_MS
            ),
          },
        });

        auctionExtended = true;
      }

      // ⭐ Update bid count
      await tx.auction.update({
        where: { id: auction.id },
        data: {
          bidCount: {
            increment: 1,
          },
        },
      });

      return {
        auction,
        newBid,
        previousHighestBid,
        auctionExtended,
      };
    });

    // ⭐ NEW HIGHEST BID EMAIL
    if (
      !result.previousHighestBid ||
      result.previousHighestBid.bidderId !== user.id
    ) {
      await emitNotificationEvent({
        type: "NEW_HIGHEST_BID",
        userId: user.id,
        auctionId: result.auction.id,
        bidAmount: result.newBid.amount,
      });
    }

    // ⭐ OUTBID EMAIL
    if (
      result.previousHighestBid &&
      result.previousHighestBid.bidderId !== user.id
    ) {
      await emitNotificationEvent({
        type: "OUTBID",
        userId: result.previousHighestBid.bidderId,
        auctionId: result.auction.id,
        bidAmount: result.newBid.amount,
      });
    }

    return NextResponse.json({
      success: true,
      extended: result.auctionExtended,
    });
  } catch (err: any) {
    console.error("BID API ERROR:", err);

    return NextResponse.json(
      { error: err.message || "Server error placing bid" },
      { status: 400 }
    );
  }
}