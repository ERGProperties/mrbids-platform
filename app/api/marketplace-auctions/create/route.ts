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

    const body =
      await req.json();

    const {

      title,

      description,

      category,

      subcategory,

      retailPrice,

      coverImage,

      images,

      startingBid,

      reservePrice,

      bidIncrement,

      durationMinutes,

      // SHIPPING
      shippingType,

      shippingPreset,

      shippingLabel,

      shippingCost,

      freeShipping,

      localPickup,

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

    const duration =
      Number(
        durationMinutes || 5
      );

    const now =
      new Date();

    const endDate =
      new Date(
        Date.now() +
        duration *
          60 *
          1000
      );

    // CREATE AUCTION
    const auction =
      await prisma.marketplaceAuction.create({

        data: {

          title,

          description,

          category,

          subcategory,

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

          reservePrice:
            reservePrice
              ? Number(
                  reservePrice
                )
              : null,

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

          // AUTO-START LIVE
          status:
            "LIVE",

          startAt:
            now,

          endAt:
            endDate,

          // STORE DURATION
          durationMinutes:
            duration,

          // SHIPPING
          shippingType:
            shippingType || "preset",

          shippingPreset:
            shippingPreset || null,

          shippingLabel:
            shippingLabel || null,

          shippingCost:
            Number(
              shippingCost || 0
            ),

          freeShipping:
            Boolean(
              freeShipping
            ),

          localPickup:
            Boolean(
              localPickup
            ),

        },

      });

    return NextResponse.json({
      success: true,
      auction,
      shareUrl: `${process.env.NEXT_PUBLIC_APP_URL}/auction/${auction.id}`,
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