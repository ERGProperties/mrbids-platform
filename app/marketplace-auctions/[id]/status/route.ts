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

    const status =
      body.status;

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

    // ONLY SELLER CAN CONTROL
    if (
      auction.sellerId !==
      user.id
    ) {

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

    const updatedAuction =
      await prisma.marketplaceAuction.update({
        where: {
          id: auction.id,
        },

        data: {
          status,

          // AUTO START TIMER
          ...(status ===
            "LIVE" && {
            startAt:
              new Date(),

            endAt:
              auction.endAt ||
              new Date(
                Date.now() +
                  1000 *
                    60 *
                    60
              ),
          }),
        },
      });

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