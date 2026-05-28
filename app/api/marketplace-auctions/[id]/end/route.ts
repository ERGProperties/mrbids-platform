import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { pusherServer } from "@/lib/pusher";

import { sendAuctionWonEmail } from "@/lib/email/sendAuctionWonEmail";

import { sendSellerWinnerEmail } from "@/lib/email/sendSellerWinnerEmail";

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

    console.log(
      "[AUCTION_END_ROUTE_STARTED]",
      params.id
    );

    const auction =
      await prisma.marketplaceAuction.findUnique({
        where: {
          id: params.id,
        },

        include: {
          seller: true,

          bids: {
            orderBy: {
              amount:
                "desc",
            },

            take: 1,

            include: {
              bidder: true,
            },
          },
        },
      });

    if (!auction) {

      console.log(
        "[AUCTION_NOT_FOUND]",
        params.id
      );

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

    const alreadyEnded =
      auction.status ===
      "ENDED";

    const winningBid =
      auction.bids[0];

    console.log(
      "[AUCTION_END_DEBUG]",
      {
        auctionId:
          auction.id,

        currentStatus:
          auction.status,

        alreadyEnded,

        winningBidExists:
          !!winningBid,

        winningBidAmount:
          winningBid?.amount,

        bidderId:
          winningBid?.bidderId,

        bidderEmail:
          winningBid?.bidder
            ?.email,

        sellerEmail:
          auction.seller
            ?.email,
      }
    );

    // UPDATE DATABASE
    const updatedAuction =
      await prisma.marketplaceAuction.update({
        where: {
          id: auction.id,
        },

        data: {
          status:
            "ENDED",

          endAt:
            new Date(),

          winnerId:
            winningBid?.bidderId,
        },

        include: {
          seller: true,

          winner: true,

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

    const auctionUrl =
      `${process.env.NEXTAUTH_URL}/marketplace-auctions/${auction.id}`;

    const coverImage =
      auction.coverImage ||
      auction.images?.[0] ||
      undefined;

    // ONLY SEND EMAILS FIRST TIME
    if (!alreadyEnded) {

      console.log(
        "[EMAIL_BLOCK_ENTERED]"
      );

      // SEND WINNER EMAIL
      if (
        winningBid?.bidder
          ?.email
      ) {

        console.log(
          "[SENDING_WINNER_EMAIL]",
          winningBid.bidder.email
        );

        try {

          await sendAuctionWonEmail({
            to:
              winningBid
                .bidder.email,

            address:
              auction.title,

            winningBid:
              winningBid.amount,

            sellerName:
              auction.seller.name ||
              "Seller",

            sellerEmail:
              auction.seller.email,

            auctionUrl,

            coverImage,
          });

          console.log(
            "[WINNER_EMAIL_SENT]"
          );

        } catch (emailError) {

          console.error(
            "[WINNER_EMAIL_ERROR]",
            emailError
          );

        }

      } else {

        console.log(
          "[WINNER_EMAIL_SKIPPED_NO_EMAIL]"
        );

      }

      // SEND SELLER EMAIL
      if (
        auction.seller?.email &&
        winningBid?.bidder
      ) {

        console.log(
          "[SENDING_SELLER_EMAIL]",
          auction.seller.email
        );

        try {

          await sendSellerWinnerEmail({
            to:
              auction.seller.email,

            address:
              auction.title,

            winningBid:
              winningBid.amount,

            buyerName:
              winningBid.bidder
                .name ||
              "Winner",

            buyerEmail:
              winningBid.bidder
                .email,

            auctionUrl,

            coverImage,
          });

          console.log(
            "[SELLER_EMAIL_SENT]"
          );

        } catch (emailError) {

          console.error(
            "[SELLER_EMAIL_ERROR]",
            emailError
          );

        }

      } else {

        console.log(
          "[SELLER_EMAIL_SKIPPED]",
          {
            sellerEmail:
              auction.seller
                ?.email,

            bidderExists:
              !!winningBid
                ?.bidder,
          }
        );

      }

    } else {

      console.log(
        "[EMAILS_SKIPPED_ALREADY_ENDED]"
      );

    }

    // REALTIME BROADCAST
    await pusherServer.trigger(
      `presence-auction-${auction.id}`,
      "auction-ended",
      updatedAuction
    );

    // GENERAL UPDATE
    await pusherServer.trigger(
      `presence-auction-${auction.id}`,
      "auction-updated",
      updatedAuction
    );

    console.log(
      "[AUCTION_END_COMPLETED]",
      auction.id
    );

    return NextResponse.json({
      success: true,
      auction:
        updatedAuction,
    });

  } catch (error) {

    console.error(
      "[AUCTION_END_ROUTE_ERROR]",
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