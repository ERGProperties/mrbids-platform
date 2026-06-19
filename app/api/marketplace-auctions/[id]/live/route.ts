import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(
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
          seller: true,

          bids: {
            orderBy: {
              createdAt: "desc",
            },

            include: {
              bidder: true,
            },
          },
        },
      });

    if (!auction) {

      return NextResponse.json(
        {
          error: "Auction not found",
        },
        {
          status: 404,
        }
      );

    }

    return NextResponse.json(
      auction
    );

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Failed to fetch auction",
      },
      {
        status: 500,
      }
    );

  }

}