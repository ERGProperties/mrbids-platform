import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {

  try {

    const body =
      await req.json();

    const {
      auctionId,
      userId,
    } = body;

    if (
      !auctionId ||
      !userId
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
      await prisma.marketplaceAuction.findUnique({
        where: {
          id: auctionId,
        },

        include: {
          bids: {
            orderBy: {
              amount:
                "desc",
            },

            take: 1,
          },
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

    // PREVENT DUPLICATE PAYMENTS
    if (
      auction.paymentStatus ===
      "PAID"
    ) {

      return NextResponse.json(
        {
          error:
            "This auction has already been paid",
        },
        {
          status: 400,
        }
      );

    }

    const highestBid =
      auction.bids[0];

    if (!highestBid) {

      return NextResponse.json(
        {
          error:
            "No bids found",
        },
        {
          status: 400,
        }
      );

    }

    // ONLY WINNER CAN PAY
    if (
      highestBid.bidderId !==
      userId
    ) {

      return NextResponse.json(
        {
          error:
            "Unauthorized",
        },
        {
          status: 403,
        }
      );

    }

    const session =
      await stripe.checkout.sessions.create({
        payment_method_types: [
          "card",
        ],

        line_items: [
          {
            price_data: {
              currency:
                "usd",

              product_data: {
                name:
                  auction.title,

                description:
                  auction.description?.slice(
                    0,
                    200
                  ) ||
                  "Marketplace auction item",
              },

              unit_amount:
                Math.round(
                  highestBid.amount *
                    100
                ),
            },

            quantity: 1,
          },
        ],

        mode: "payment",

        success_url:
          `${process.env.NEXT_PUBLIC_APP_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,

        cancel_url:
          `${process.env.NEXT_PUBLIC_APP_URL}/payment-cancelled`,

        metadata: {
          auctionId:
            auction.id,

          buyerId:
            userId,
        },
      });

    return NextResponse.json({
      url:
        session.url,
    });

  } catch (error) {

    console.error(
      "[STRIPE_CHECKOUT_ERROR]",
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