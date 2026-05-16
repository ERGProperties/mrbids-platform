import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";

import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: {
    params: {
      id: string;
    };
  }
) {

  try {

    const session =
      await getServerSession(
        authOptions
      );

    if (!session?.user?.email) {

      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );

    }

    const body =
      await req.json();

    const amount =
      Number(body.amount);

    if (
      !amount ||
      amount <= 0
    ) {

      return NextResponse.json(
        {
          error:
            "Invalid bid amount",
        },
        {
          status: 400,
        }
      );

    }

    // GET USER
    const user =
      await prisma.user.findUnique({
        where: {
          email:
            session.user.email,
        },
      });

    if (!user) {

      return NextResponse.json(
        {
          error:
            "User not found",
        },
        {
          status: 404,
        }
      );

    }

    // GET AUCTION
    const auction =
      await prisma.marketplaceAuction.findUnique({
        where: {
          id: params.id,
        },
      });

    if (!auction) {

      return NextResponse.json(
        {
          error:
            "Auction not found",
        },
        {
          status: 404,
        }
      );

    }

    // AUCTION MUST BE LIVE
    if (
      auction.status !==
      "LIVE"
    ) {

      return NextResponse.json(
        {
          error:
            "Auction is not live",
        },
        {
          status: 400,
        }
      );

    }

    // AUCTION MUST NOT BE ENDED
    if (
      auction.endAt &&
      new Date() >
        auction.endAt
    ) {

      return NextResponse.json(
        {
          error:
            "Auction has ended",
        },
        {
          status: 400,
        }
      );

    }

    // SELLER CANNOT BID
    if (
      auction.sellerId ===
      user.id
    ) {

      return NextResponse.json(
        {
          error:
            "You cannot bid on your own auction",
        },
        {
          status: 400,
        }
      );

    }

    // CALCULATE MINIMUM BID
    const currentBid =
      auction.currentBid &&
      auction.currentBid > 0
        ? auction.currentBid
        : auction.startingBid;

    const minimumBid =
      currentBid +
      auction.bidIncrement;

    if (
      amount < minimumBid
    ) {

      return NextResponse.json(
        {
          error: `Minimum bid is ${minimumBid}`,
        },
        {
          status: 400,
        }
      );

    }

    // CREATE BID
    const bid =
      await prisma.marketplaceBid.create({
        data: {
          amount,

          auctionId:
            auction.id,

          bidderId:
            user.id,
        },
      });

    // ANTI-SNIPE LOGIC
    let updatedEndAt =
      auction.endAt;

    if (auction.endAt) {

      const now =
        Date.now();

      const endTime =
        new Date(
          auction.endAt
        ).getTime();

      const secondsRemaining =
        Math.floor(
          (endTime - now) /
            1000
        );

      // EXTEND IF UNDER 15 SECONDS
      if (
        secondsRemaining <=
        15
      ) {

        updatedEndAt =
          new Date(
            endTime +
              15 * 1000
          );

      }
    }

    // UPDATE AUCTION
    await prisma.marketplaceAuction.update({
      where: {
        id: auction.id,
      },

      data: {
        currentBid:
          amount,

        bidCount: {
          increment: 1,
        },

        endAt:
          updatedEndAt,
      },
    });

    return NextResponse.json({
      success: true,
      bid,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Something went wrong",
      },
      {
        status: 500,
      }
    );

  }
}