import { NextRequest, NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";

import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  {
    params,
  }: {
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

    if (!session?.user?.id) {

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

    const body =
      await req.json();

    const {
      shippingCost,
      shippingCarrier,
    } = body;

    if (
      shippingCost ===
        undefined ||
      shippingCost < 0
    ) {

      return NextResponse.json(
        {
          error:
            "Invalid shipping cost",
        },
        {
          status: 400,
        }
      );

    }

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

    // ONLY SELLER CAN UPDATE
    if (
      auction.sellerId !==
      session.user.id
    ) {

      return NextResponse.json(
        {
          error:
            "Unauthorized",
        },
        {
          status: 403,
        }
      );

    }

    const updatedAuction =
      await prisma.marketplaceAuction.update({
        where: {
          id: auction.id,
        },

        data: {
          shippingCost:
            Number(
              shippingCost
            ),
        },
      });

    return NextResponse.json({
      success: true,
      auction:
        updatedAuction,
    });

  } catch (error) {

    console.error(
      "[SHIPPING_UPDATE_ERROR]",
      error
    );

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