import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";

import { prisma } from "@/lib/prisma";

import { pusherServer } from "@/lib/pusher";

import { sendOutbidEmail } from "@/lib/email/sendOutbidEmail";

import { sendHighestBidderEmail } from "@/lib/email/sendHighestBidderEmail";

import { sendPushNotification } from "@/lib/push/sendPushNotification";

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

    const body =
      await req.json();

    const amount =
      Number(body.amount);

    if (
      !amount ||
      amount <= 0
    ) {

      return NextResponse.json(
        {
          error:
            "Invalid bid amount",
        },
        {
          status: 400,
        }
      );

    }

    // GET USER
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

    // GET AUCTION
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

    // AUCTION MUST BE LIVE
    if (
      auction.status !==
      "LIVE"
    ) {

      return NextResponse.json(
        {
          error:
            "Auction is not live",
        },
        {
          status: 400,
        }
      );

    }

    // AUCTION MUST NOT BE ENDED
    if (
      auction.endAt &&
      new Date() >
        auction.endAt
    ) {

      return NextResponse.json(
        {
          error:
            "Auction has ended",
        },
        {
          status: 400,
        }
      );

    }

    // SELLER CANNOT BID
    if (
      auction.sellerId ===
      user.id
    ) {

      return NextResponse.json(
        {
          error:
            "You cannot bid on your own auction",
        },
        {
          status: 400,
        }
      );

    }

    // CALCULATE MINIMUM BID
    const currentBid =
      auction.currentBid &&
      auction.currentBid > 0
        ? auction.currentBid
        : auction.startingBid;

    const minimumBid =
      currentBid +
      auction.bidIncrement;

    if (
      amount < minimumBid
    ) {

      return NextResponse.json(
        {
          error:
            `Minimum bid is ${minimumBid}`,
        },
        {
          status: 400,
        }
      );

    }

    // PREVIOUS HIGHEST BIDDER
    const previousHighestBid =
      await prisma.marketplaceBid.findFirst({
        where: {
          auctionId:
            auction.id,
        },

        orderBy: {
          amount:
            "desc",
        },

        include: {
          bidder: true,
        },
      });

    // CREATE BID
    const bid =
      await prisma.marketplaceBid.create({
        data: {
          amount,

          auctionId:
            auction.id,

          bidderId:
            user.id,
        },
      });

    // ANTI-SNIPE LOGIC
    let updatedEndAt =
      auction.endAt;

    if (auction.endAt) {

      const now =
        Date.now();

      const endTime =
        new Date(
          auction.endAt
        ).getTime();

      const secondsRemaining =
        Math.floor(
          (endTime - now) / 1000
        );

      // EXTEND IF UNDER 15 MINUTES
      if (
        secondsRemaining <=
        15 * 60
      ) {

        updatedEndAt =
          new Date(
            endTime +
            15 * 60 * 1000
          );

      }

    }

    // UPDATE AUCTION
    await prisma.marketplaceAuction.update({
      where: {
        id:
          auction.id,
      },

      data: {
        currentBid:
          amount,

        bidCount: {
          increment: 1,
        },

        endAt:
          updatedEndAt,
      },
    });

    // FETCH UPDATED AUCTION
    const updatedAuction =
      await prisma.marketplaceAuction.findUnique({
        where: {
          id:
            auction.id,
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

    // SEND OUTBID EMAIL
    if (
      previousHighestBid &&
      previousHighestBid.bidderId !==
        user.id &&
      previousHighestBid.bidder
        ?.email
    ) {

      // CHECK RECENT EMAIL
      const fiveMinutesAgo =
        new Date(
          Date.now() -
          5 * 60 * 1000
        );

      const recentNotification =
        await prisma.notificationLog.findFirst({
          where: {
            userId:
              previousHighestBid.bidderId,

            auctionId:
              auction.id,

            type:
              "OUTBID_EMAIL",

            createdAt: {
              gte:
                fiveMinutesAgo,
            },
          },
        });

      // ONLY SEND IF NO RECENT EMAIL
      if (!recentNotification) {

        await sendOutbidEmail({
          to:
            previousHighestBid
              .bidder.email,

          address:
            auction.title,

          auctionUrl:
            `${process.env.NEXT_PUBLIC_APP_URL}/marketplace-auctions/${auction.id}`,

          coverImage:
            auction.coverImage ||
            auction.images?.[0] ||
            undefined,
        });

        // LOG NOTIFICATION
        await prisma.notificationLog.create({
          data: {
            userId:
              previousHighestBid.bidderId,

            auctionId:
              auction.id,

            type:
              "OUTBID_EMAIL",

            metadata: {
              bidAmount:
                amount,
            },
          },
        });

      }

    }

    // SEND HIGHEST BIDDER EMAIL
    if (user.email) {

      await sendHighestBidderEmail({
        to:
          user.email,

        address:
          auction.title,

        bidAmount:
          amount,

        auctionUrl:
          `${process.env.NEXT_PUBLIC_APP_URL}/marketplace-auctions/${auction.id}`,

        coverImage:
          auction.coverImage ||
          auction.images?.[0] ||
          undefined,
      });

    }

// CREATE HIGHEST BIDDER NOTIFICATION
await prisma.notificationLog.create({
  data: {
    userId:
      user.id,

    title:
      "You're the highest bidder",

    message:
      `You're currently winning ${auction.title}.`,

    auctionId:
      auction.id,

    type:
      "HIGHEST_BIDDER",

    link:
      `/marketplace-auctions/${auction.id}`,

    metadata: {
      bidAmount:
        amount,
    },
  },
});

    // SEND PUSH NOTIFICATION
    if (
      previousHighestBid &&
      previousHighestBid.bidderId !==
        user.id
    ) {

      const pushSubscriptions =
        await prisma.pushSubscription.findMany({
          where: {
            userId:
              previousHighestBid.bidderId,
          },
        });

      for (const sub of pushSubscriptions) {

        try {

          await sendPushNotification({
            token:
              sub.endpoint,

            title:
              "You've been outbid",

            body:
              `${auction.title} has a higher bid now.`,

            url:
              `/marketplace-auctions/${auction.id}`,
          });

        } catch (err) {

          console.error(
            "OUTBID PUSH ERROR:",
            err
          );

        }

      }

      // CREATE IN-APP NOTIFICATION
      await prisma.notificationLog.create({
        data: {
          userId:
            previousHighestBid.bidderId,

          title:
            "You've been outbid",

          message:
            `${auction.title} has a higher bid now.`,

          auctionId:
            auction.id,

          type:
            "OUTBID",

          link:
            `/marketplace-auctions/${auction.id}`,

          metadata: {
            bidAmount:
              amount,
          },
        },
      });

    }

    // REALTIME BROADCAST
    await pusherServer.trigger(
      `presence-auction-${auction.id}`,
      "new-bid",
      updatedAuction
    );

    // ALSO SEND GENERAL UPDATE
    await pusherServer.trigger(
      `presence-auction-${auction.id}`,
      "auction-updated",
      updatedAuction
    );

    return NextResponse.json({
      success: true,
      bid,
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