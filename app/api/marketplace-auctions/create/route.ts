import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import { prisma } from "@/lib/prisma";

import { authOptions } from "@/lib/authOptions";

export async function POST(req: Request) {

  try {

    const session = await getServerSession(
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

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {

      return NextResponse.json(
        {
          error: "User not found",
        },
        {
          status: 404,
        }
      );

    }

    if (!user.isMarketplaceSeller) {

      return NextResponse.json(
        {
          error:
            "Marketplace seller account required",
        },
        {
          status: 403,
        }
      );

    }

    const body = await req.json();

    const {
      title,
      description,
      category,
      coverImage,
      startingBid,
      bidIncrement,
    } = body;

    if (
      !title ||
      !category ||
      !coverImage
    ) {

      return NextResponse.json(
        {
          error:
            "Missing required fields",
        },
        {
          status: 400,
        }
      );

    }

    const auction =
      await prisma.marketplaceAuction.create({

        data: {

          title,

          description,

          category,

          coverImage,

          images: [coverImage],

          startingBid,

          bidIncrement,

          currentBid: startingBid,

          sellerId: user.id,

        },

      });

    return NextResponse.json({
      success: true,
      auction,
    });

  } catch (error) {

    console.error(
      "Marketplace auction error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to create auction",
      },
      {
        status: 500,
      }
    );

  }
}