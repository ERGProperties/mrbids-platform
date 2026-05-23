import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";

import { prisma } from "@/lib/prisma";

import { stripe } from "@/lib/stripe";

export async function GET() {

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

    const user =
      await prisma.user.findUnique({
        where: {
          id:
            session.user.id,
        },
      });

    if (
      !user ||
      !user.stripeAccountId
    ) {

      return NextResponse.json(
        {
          connected: false,
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

    // UPDATE DATABASE
    if (
      onboardingComplete &&
      !user
        .stripeOnboardingComplete
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

    return NextResponse.json({
      connected:
        onboardingComplete,
    });

  } catch (error) {

    console.error(
      "[STRIPE_CONNECT_STATUS_ERROR]",
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