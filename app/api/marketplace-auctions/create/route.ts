import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import { prisma } from "@/lib/prisma";

import { authOptions } from "@/lib/authOptions";

export async function POST(
  req: Request
) {
  try {
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

    let user =
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

    // AUTO-CONVERT USER TO MARKETPLACE SELLER
    if (
      !user.isMarketplaceSeller
    ) {
      user =
        await prisma.user.update({
          where: {
            id: user.id,
          },

          data: {
            isMarketplaceSeller:
              true,
          },
        });
    }

    const body =
      await req.json();

    const {
      title,
      description,
      category,

      retailPrice,

      coverImage,

      images,

      startingBid,

      bidIncrement,

      durationMinutes,
    } = body;

    // VALIDATION
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

    // CREATE AUCTION
    const auction =
      await prisma.marketplaceAuction.create({

        data: {

          title,

          description,

          category,

          // RETAIL PRICE
          retailPrice:
            retailPrice
              ? Number(
                  retailPrice
                )
              : null,

          coverImage,

          images:
            images?.length
              ? images
              : [coverImage],

          startingBid:
            Number(
              startingBid
            ),

          bidIncrement:
            Number(
              bidIncrement
            ),

          currentBid:
            Number(
              startingBid
            ),

          sellerId:
            user.id,

          // AUCTION STARTS AS SCHEDULED
          status:
            "SCHEDULED",

          // STARTS WHEN SELLER CLICKS LIVE
          startAt:
            null,

          // SET WHEN LIVE STARTS
          endAt:
            null,

          // STORE DURATION
          durationMinutes:
            Number(
              durationMinutes || 5
            ),

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