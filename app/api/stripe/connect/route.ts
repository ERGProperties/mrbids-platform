import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";

import { prisma } from "@/lib/prisma";

import { stripe } from "@/lib/stripe";

export async function POST() {

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

    let stripeAccountId =
      user.stripeAccountId;

    // CREATE CONNECT ACCOUNT
    if (!stripeAccountId) {

      const account =
        await stripe.accounts.create({
          type: "express",

          country: "US",

          email:
            user.email || undefined,

          business_type:
            "individual",

          capabilities: {
            transfers: {
              requested: true,
            },

            card_payments: {
              requested: true,
            },
          },
        });

      stripeAccountId =
        account.id;

      await prisma.user.update({
        where: {
          id: user.id,
        },

        data: {
          stripeAccountId,
        },
      });

    }

    // CREATE ONBOARDING LINK
    const accountLink =
      await stripe.accountLinks.create({
        account:
          stripeAccountId,

        refresh_url:
          process.env
            .STRIPE_CONNECT_RETURN_URL!,

        return_url:
          process.env
            .STRIPE_CONNECT_RETURN_URL!,

        type:
          "account_onboarding",
      });

    return NextResponse.json({
      url:
        accountLink.url,
    });

  } catch (error) {

    console.error(
      "[STRIPE_CONNECT_ERROR]",
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