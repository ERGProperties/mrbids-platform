import { headers } from "next/headers";

import { NextResponse } from "next/server";

import Stripe from "stripe";

import { stripe } from "@/lib/stripe";

import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {

  const body = await req.text();

  const signature =
    headers().get(
      "stripe-signature"
    ) as string;

  let event: Stripe.Event;

  try {

    event =
      stripe.webhooks.constructEvent(
        body,
        signature,
        process.env
          .STRIPE_WEBHOOK_SECRET!
      );

  } catch (error) {

    console.error(
      "[STRIPE_WEBHOOK_ERROR]",
      error
    );

    return new NextResponse(
      "Webhook Error",
      {
        status: 400,
      }
    );

  }

  if (
    event.type ===
    "checkout.session.completed"
  ) {

    const session =
      event.data.object as Stripe.Checkout.Session;

    const auctionId =
      session.metadata?.auctionId;

    if (auctionId) {

      await prisma.marketplaceAuction.update({
        where: {
          id: auctionId,
        },

        data: {
          paymentStatus:
            "PAID",

          stripeSessionId:
            session.id,

          paidAt: new Date(),
        },
      });

    }

  }

  return NextResponse.json({
    received: true,
  });

}