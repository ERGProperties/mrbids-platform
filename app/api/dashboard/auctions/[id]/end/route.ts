import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { finalizeMarketplaceAuction } from "@/lib/marketplace/finalizeMarketplaceAuction";

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

  // Already ended
  if (auction.status === "ENDED") {
    return NextResponse.json(
      {
        error: "Auction has already ended.",
      },
      {
        status: 400,
      }
    );
  }

  // End the auction using the existing auction logic
  await finalizeMarketplaceAuction(
    auction.id
  );

  return NextResponse.json({
    success: true,
  });
}