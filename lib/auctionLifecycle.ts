import { prisma } from "@/lib/prisma";

import { finalizeAuction } from "@/lib/auctions/finalizeAuction";

import { finalizeMarketplaceAuction } from "@/lib/marketplace/finalizeMarketplaceAuction";

import { sendPushNotification } from "@/lib/push/sendPushNotification";

export async function autoCloseExpiredAuctions() {

  const now = new Date();

  // MARKETPLACE AUCTIONS ENDING SOON
  const endingSoonAuctions =
    await prisma.marketplaceAuction.findMany({
      where: {
        status: "LIVE",

        endingSoonSent: false,

        endAt: {
          lte: new Date(
            Date.now() + 15 * 60 * 1000
          ),

          gt: now,
        },
      },

      include: {
        watchlistedBy: {
          include: {
            user: true,
          },
        },
      },
    });

  for (const auction of endingSoonAuctions) {

    for (const watchlist of auction.watchlistedBy) {

      const user =
        watchlist.user;

      // PUSH SUBSCRIPTIONS
      const pushSubscriptions =
        await prisma.pushSubscription.findMany({
          where: {
            userId:
              user.id,
          },
        });

      // SEND PUSH
      for (const sub of pushSubscriptions) {

        try {

          await sendPushNotification({
            token:
              sub.endpoint,

            title:
              "Auction ending soon",

            body:
              `${auction.title} ends soon.`,

            url:
              `/marketplace-auctions/${auction.id}`,
          });

        } catch (err) {

          console.error(
            "WATCHLIST_ENDING_SOON_PUSH_ERROR",
            err
          );
        }
      }

      // CREATE IN-APP NOTIFICATION
      await prisma.notificationLog.create({
        data: {
          userId:
            user.id,

          title:
            "Auction ending soon",

          message:
            `${auction.title} ends soon.`,

          auctionId:
            auction.id,

          type:
            "WATCHLIST_ENDING_SOON",

          link:
            `/marketplace-auctions/${auction.id}`,
        },
      });
    }

    // PREVENT DUPLICATES
    await prisma.marketplaceAuction.update({
      where: {
        id:
          auction.id,
      },

      data: {
        endingSoonSent: true,
      },
    });
  }

  // REAL ESTATE AUCTIONS
  const expiredAuctions =
    await prisma.auction.findMany({
      where: {
        status: "LIVE",

        endAt: {
          lt: now,
        },
      },

      select: {
        id: true,
      },
    });

  for (const auction of expiredAuctions) {

    try {

      await finalizeAuction(
        auction.id
      );

    } catch (err) {

      console.error(
        `Failed to finalize auction ${auction.id}:`,
        err
      );

    }
  }

  // MARKETPLACE AUCTIONS
  const expiredMarketplaceAuctions =
    await prisma.marketplaceAuction.findMany({
      where: {
        status: "LIVE",

        endAt: {
          lt: now,
        },
      },

      select: {
        id: true,
      },
    });

  for (const auction of expiredMarketplaceAuctions) {

    try {

      await finalizeMarketplaceAuction(
        auction.id
      );

    } catch (err) {

      console.error(
        `Failed to finalize marketplace auction ${auction.id}:`,
        err
      );

    }
  }
}