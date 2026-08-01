import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  {
    params,
  }: {
    params: {
      id: string;
    };
  }
) {

  const session =
    await getServerSession(authOptions);

  if (!session?.user?.id) {

    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
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
        error: "Auction not found",
      },
      {
        status: 404,
      }
    );

  }

  if (
    auction.sellerId !==
    session.user.id
  ) {

    return NextResponse.json(
      {
        error: "Forbidden",
      },
      {
        status: 403,
      }
    );

  }

  await prisma.marketplaceAuction.update({
    where: {
      id: auction.id,
    },

    data: {
      restartMode: "NEVER",
    },
  });

  return NextResponse.json({
    success: true,
  });

}