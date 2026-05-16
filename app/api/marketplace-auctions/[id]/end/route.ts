import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { pusherServer } from "@/lib/pusher";

export async function POST(
  req: Request,
  {
    params,
  }: {
    params: {
      id: string;
    };
  }
) {

  try {

    const auction =
      await prisma.marketplaceAuction.findUnique({
        where: {
          id: params.id,
        },

        include: {
          bids: {
            orderBy: {
              amount:
                "desc",
            },

            take: 1,
          },
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

    if (
      auction.status ===
      "ENDED"
    ) {

      return NextResponse.json({
        success: true,
      });

    }

    const winningBid =
      auction.bids[0];

    const updatedAuction =
      await prisma.marketplaceAuction.update({
        where: {
          id: auction.id,
        },

        data: {
          status:
            "ENDED",

          winnerId:
            winningBid?.bidderId,
        },

        include: {
          seller: true,

          winner: true,

          bids: {
            include: {
              bidder: true,
            },

            orderBy: {
              createdAt:
                "desc",
            },

            take: 10,
          },
        },
      });

    await pusherServer.trigger(
      `auction-${auction.id}`,
      "auction-ended",
      updatedAuction
    );

    return NextResponse.json({
      success: true,
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