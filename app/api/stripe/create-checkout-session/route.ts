import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { stripe } from "@/lib/stripe";

export async function POST(
  req: NextRequest
) {

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

          seller: true,
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

    // REQUIRE SHIPPING COST
    if (
      !auction.shippingCost ||
      auction.shippingCost <= 0
    ) {

      return NextResponse.json(
        {
          error:
            "Seller has not configured shipping yet",
        },
        {
          status: 400,
        }
      );

    }

    // REQUIRE STRIPE CONNECT
    if (
      !auction.seller
        .stripeAccountId ||
      !auction.seller
        .stripeOnboardingComplete
    ) {

      return NextResponse.json(
        {
          error:
            "Seller is not eligible to receive payouts yet",
        },
        {
          status: 400,
        }
      );

    }

    const totalAmount =
      highestBid.amount +
      auction.shippingCost;

    // 5% MARKETPLACE FEE
    const marketplaceFee =
      Math.round(
        totalAmount * 0.05
      );

    const sellerPayout =
      totalAmount -
      marketplaceFee;

    const session =
      await stripe.checkout.sessions.create({
        payment_method_types: [
          "card",
        ],

        line_items: [

          // WINNING BID
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

          // SHIPPING
          {
            price_data: {
              currency:
                "usd",

              product_data: {
                name:
                  "Shipping",

                description:
                  auction.shippingLabel 
                    ? `${auction.shippingLabel} shipping` 
                    : "Marketplace shipping charge",
              },

              unit_amount:
                Math.round(
                  auction.shippingCost *
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

        payment_intent_data: {

          application_fee_amount:
            marketplaceFee * 100,

          transfer_data: {
            destination:
              auction.seller
                .stripeAccountId,
          },
        },

        metadata: {
          auctionId:
            auction.id,

          buyerId:
            userId,

          sellerId:
            auction.sellerId,

          winningBid:
            highestBid.amount.toString(),

          shippingCost:
            auction.shippingCost.toString(),

          totalAmount:
            totalAmount.toString(),

          marketplaceFee:
            marketplaceFee.toString(),

          sellerPayout:
            sellerPayout.toString(),
        },
      });

    // STORE PAYMENT INFO
    await prisma.marketplaceAuction.update({
      where: {
        id: auction.id,
      },

      data: {
        stripeSessionId:
          session.id,

        sellerPayoutAmount:
          sellerPayout,

        marketplaceFeeAmount:
          marketplaceFee,
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