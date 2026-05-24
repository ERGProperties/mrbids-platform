import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";

import { prisma } from "@/lib/prisma";

import { pusherServer } from "@/lib/pusher";

import { stripe } from "@/lib/stripe";

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

    // VERIFY STRIPE CONNECT
    if (
      !user.stripeAccountId
    ) {

      return NextResponse.json(
        {
          error:
            "Connect Stripe before launching your auction.",
        },
        {
          status: 400,
        }
      );

    }

    const account =
      await stripe.accounts.retrieve(
        user.stripeAccountId
      );

    const onboardingComplete =
      !!account.details_submitted &&
      !!account.charges_enabled &&
      !!account.payouts_enabled;

    if (
      !onboardingComplete
    ) {

      return NextResponse.json(
        {
          error:
            "Complete Stripe onboarding before launching your auction.",
        },
        {
          status: 400,
        }
      );

    }

    // UPDATE USER STATUS
    if (
      !user.stripeOnboardingComplete
    ) {

      await prisma.user.update({
        where: {
          id: user.id,
        },

        data: {
          stripeOnboardingComplete:
            true,
        },
      });

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

    if (
      auction.status ===
      "LIVE"
    ) {

      return NextResponse.json(
        {
          error:
            "Auction already live",
        },
        {
          status: 400,
        }
      );

    }

    const startAt =
      new Date();

    const endAt =
      new Date(
        startAt.getTime() +
        auction.durationMinutes *
          60 *
          1000
      );

    const updatedAuction =
      await prisma.marketplaceAuction.update({
        where: {
          id:
            auction.id,
        },

        data: {
          status:
            "LIVE",

          startAt,

          endAt,
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

    await pusherServer.trigger(
      `presence-auction-${auction.id}`,
      "auction-updated",
      updatedAuction
    );

    return NextResponse.json({
      success: true,
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