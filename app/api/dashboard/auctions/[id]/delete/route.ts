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

  // Don't allow deleting auctions that have bids
  if (auction.bidCount > 0) {
    return NextResponse.json(
      {
        error:
          "This auction cannot be deleted because bidding has already started.",
      },
      {
        status: 400,
      }
    );
  }

  // Don't allow deleting paid auctions
  if (auction.paymentStatus === "PAID") {
    return NextResponse.json(
      {
        error:
          "Paid auctions cannot be deleted.",
      },
      {
        status: 400,
      }
    );
  }

  // Don't allow deleting shipped auctions
  if (
    auction.fulfillmentStatus === "SHIPPED" ||
    auction.fulfillmentStatus === "DELIVERED"
  ) {
    return NextResponse.json(
      {
        error:
          "Shipped auctions cannot be deleted.",
      },
      {
        status: 400,
      }
    );
  }

  await prisma.marketplaceAuction.delete({
    where: {
      id: auction.id,
    },
  });

  return NextResponse.json({
    success: true,
  });
}