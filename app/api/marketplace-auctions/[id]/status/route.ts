import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { pusherServer } from "@/lib/pusher";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";

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

    // AUTH
    const session =
      await getServerSession(
        authOptions
      );

    if (!session?.user?.email) {

      return NextResponse.json(
        {
          error:
            "Unauthorized",
        },
        {
          status: 401,
        }
      );

    }

    // FIND USER
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

    // FIND AUCTION
    const auction =
      await prisma.marketplaceAuction.findUnique({
        where: {
          id: params.id,
        },

        include: {
          seller: true,

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

    // ONLY SELLER CAN CONTROL
    if (
      auction.sellerId !==
      user.id
    ) {

      return NextResponse.json(
        {
          error:
            "Not authorized",
        },
        {
          status: 403,
        }
      );

    }

    const body =
      await req.json();

    const {
      status,
    } = body;

    // VALIDATE
    if (
      ![
        "LIVE",
        "ENDED",
      ].includes(status)
    ) {

      return NextResponse.json(
        {
          error:
            "Invalid status",
        },
        {
          status: 400,
        }
      );

    }

    let updateData: any = {
      status,
    };

    // START LIVE
    if (
      status === "LIVE"
    ) {

      const startAt =
        new Date();

      const endAt =
        new Date(
          Date.now() +
          auction.durationMinutes *
            60 *
            1000
        );

      updateData = {
        status:
          "LIVE",

        startAt,

        endAt,
      };

    }

    // END AUCTION
    if (
      status === "ENDED"
    ) {

      updateData = {
        status:
          "ENDED",
      };

    }

    // UPDATE
    const updatedAuction =
      await prisma.marketplaceAuction.update({
        where: {
          id: auction.id,
        },

        data:
          updateData,

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

    // REALTIME PUSH
    await pusherServer.trigger(
      `auction-${auction.id}`,
      "auction-updated",
      updatedAuction
    );

    return NextResponse.json({
      success: true,
      auction:
        updatedAuction,
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