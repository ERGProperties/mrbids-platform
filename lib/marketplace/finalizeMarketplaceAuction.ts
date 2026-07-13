import { prisma }
  from "@/lib/prisma";

import { sendEmail }
  from "@/lib/notifications/email";

import { sendAuctionWonEmail }
  from "@/lib/email/sendAuctionWonEmail";

import { sendSellerWinnerEmail }
  from "@/lib/email/sendSellerWinnerEmail";

import { sendPushNotification }
  from "@/lib/push/sendPushNotification";

import { createNotification }
  from "@/lib/notifications/createNotification";

import { sendReserveNotMetEmail }
  from "@/lib/email/sendReserveNotMetEmail";

import { sendSellerReserveNotMetEmail }
  from "@/lib/email/sendSellerReserveNotMetEmail";

export async function finalizeMarketplaceAuction(
  auctionId: string
) {

  const auction =
    await prisma.marketplaceAuction.findUnique({
      where: {
        id: auctionId,
      },

      include: {
        bids: {
          orderBy: {
            amount: "desc",
          },
        },

        seller: true,
      },
    });

  if (!auction) return;

  const highestBid =
    auction.bids[0];

  // NO BIDS
  if (!highestBid) {

    await prisma.marketplaceAuction.update({
      where: {
        id: auctionId,
      },

      data: {
        status: "ENDED",
      },
    });

    return;
  }

  // RESERVE CHECK
  const reserveMet =
    !auction.reservePrice ||
    highestBid.amount >=
      auction.reservePrice;

  // RESERVE NOT MET
  if (!reserveMet) {

    await prisma.marketplaceAuction.update({
      where: {
        id: auctionId,
      },

      data: {
        status: "RESERVE_NOT_MET",
      },
    });

    // HIGHEST BIDDER
    const highestBidder =
      await prisma.user.findUnique({
        where: {
          id: highestBid.bidderId,
        },
      });

    if (highestBidder?.email) {

      await sendReserveNotMetEmail({
        to: highestBidder.email,

        address: auction.title,

        highestBid: highestBid.amount,

        auctionUrl:
          `${process.env.NEXT_PUBLIC_APP_URL}/marketplace-auctions/${auction.id}`,

        coverImage:
          auction.coverImage ||
          auction.images?.[0] ||
          undefined,
      });

      const bidderPushSubs =
        await prisma.pushSubscription.findMany({
          where: {
            userId: highestBidder.id,
          },
        });

      for (const sub of bidderPushSubs) {

        try {

          await sendPushNotification({
            token: sub.endpoint,

            title: "Reserve Not Met",

            body:
              `${auction.title} ended without meeting the reserve price.`,

            url:
              `/marketplace-auctions/${auction.id}`,
          });

        } catch (err) {

          console.error(
            "PUSH SEND ERROR:",
            err
          );

        }

      }

      await createNotification({
        userId: highestBidder.id,

        title:
          "Reserve Not Met",

        message:
          `You had the highest bid on ${auction.title}, but the reserve price was not met.`,

        auctionId: auction.id,

        type: "SYSTEM",

        link:
          `/marketplace-auctions/${auction.id}`,

        metadata: {
          highestBid:
            highestBid.amount,
        },
      });

    }

    // SELLER
    if (auction.seller?.email) {

      await sendSellerReserveNotMetEmail({
        to:
          auction.seller.email,

        address:
          auction.title,

        highestBid:
          highestBid.amount,

        auctionUrl:
          `${process.env.NEXT_PUBLIC_APP_URL}/marketplace-auctions/${auction.id}`,

        coverImage:
          auction.coverImage ||
          auction.images?.[0] ||
          undefined,
      });

      const sellerPushSubs =
        await prisma.pushSubscription.findMany({
          where: {
            userId:
              auction.seller.id,
          },
        });

      for (const sub of sellerPushSubs) {

        try {

          await sendPushNotification({
            token:
              sub.endpoint,

            title:
              "Reserve Not Met",

            body:
              `${auction.title} ended without meeting the reserve price.`,

            url:
              `/marketplace-auctions/${auction.id}`,
          });

        } catch (err) {

          console.error(
            "PUSH SEND ERROR:",
            err
          );

        }

      }

      await createNotification({
        userId:
          auction.seller.id,

        title:
          "Reserve Not Met",

        message:
          `Your auction ended without meeting the reserve price.`,

        auctionId:
          auction.id,

        type:
          "SYSTEM",

        link:
          `/marketplace-auctions/${auction.id}`,

        metadata: {
          highestBid:
            highestBid.amount,
        },
      });

    }

    return;
  }

  // SUCCESSFUL SALE
  await prisma.marketplaceAuction.update({
    where: {
      id: auctionId,
    },

    data: {
      status: "ENDED",

      winnerId:
        highestBid.bidderId,

      currentBid:
        highestBid.amount,
    },
  });

  // UNIQUE BIDDER IDS
  const bidderIds = [
    ...new Set(
      auction.bids.map(
        (b) => b.bidderId
      )
    ),
  ];

  // WINNER
  const winner =
    await prisma.user.findUnique({
      where: {
        id:
          highestBid.bidderId,
      },
    });

  if (winner?.email) {

    await sendAuctionWonEmail({
      to:
        winner.email,

      address:
        auction.title,

      winningBid:
        highestBid.amount,

      sellerName:
        auction.seller?.name ||
        "MrBids Seller",

      sellerEmail:
        auction.seller?.email ||
        "no-reply@mrbids.com",

      auctionUrl:
        `${process.env.NEXT_PUBLIC_APP_URL}/marketplace-auctions/${auction.id}`,

      coverImage:
        auction.coverImage ||
        auction.images?.[0] ||
        undefined,

      shippingCost:
        auction.shippingCost ||
        undefined,

      shippingLabel:
        auction.shippingLabel ||
        undefined,

      freeShipping:
        auction.shippingType ===
        "FREE",

      localPickup:
        auction.shippingType ===
        "LOCAL_PICKUP",
    });

    const winnerPushSubs =
      await prisma.pushSubscription.findMany({
        where: {
          userId:
            winner.id,
        },
      });

    for (const sub of winnerPushSubs) {

      try {

        await sendPushNotification({
          token:
            sub.endpoint,

          title:
            "🎉 You won the auction!",

          body:
            `${auction.title}`,

          url:
            `/marketplace-auctions/${auction.id}`,
        });

      } catch (err) {

        console.error(
          "PUSH SEND ERROR:",
          err
        );

      }

    }

    await createNotification({
      userId:
        winner.id,

      title:
        "🎉 You won the auction!",

      message:
        `${auction.title} was won for $${highestBid.amount}.`,

      auctionId:
        auction.id,

      type:
        "AUCTION_WON",

      link:
        `/marketplace-auctions/${auction.id}`,

      metadata: {
        winningBid:
          highestBid.amount,
      },
    });

  }

  // LOSERS
  for (const bidderId of bidderIds) {

    if (
      bidderId ===
      highestBid.bidderId
    ) {
      continue;
    }

    const user =
      await prisma.user.findUnique({
        where: {
          id: bidderId,
        },
      });

    if (!user?.email) {
      continue;
    }

    await sendEmail({
      to:
        user.email,

      subject:
        "Auction ended — you were outbid",

      html: `
        <h2>This auction has ended</h2>

        <p>${auction.title}</p>

        <p>
          Final price:
          $${highestBid.amount}
        </p>

        <p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/marketplace-auctions/${auction.id}">
            View results
          </a>
        </p>
      `,
    });

    const loserPushSubs =
      await prisma.pushSubscription.findMany({
        where: {
          userId:
            user.id,
        },
      });

    for (const sub of loserPushSubs) {

      try {

        await sendPushNotification({
          token:
            sub.endpoint,

          title:
            "Auction ended",

          body:
            `${auction.title} has ended.`,

          url:
            `/marketplace-auctions/${auction.id}`,
        });

      } catch (err) {

        console.error(
          "PUSH SEND ERROR:",
          err
        );

      }

    }

    await createNotification({
      userId:
        user.id,

      title:
        "Auction ended",

      message:
        `You were outbid on ${auction.title}.`,

      auctionId:
        auction.id,

      type:
        "AUCTION_LOST",

      link:
        `/marketplace-auctions/${auction.id}`,

      metadata: {
        finalPrice:
          highestBid.amount,
      },
    });

  }

  // SELLER
  if (auction.seller?.email) {

    await sendSellerWinnerEmail({
      to:
        auction.seller.email,

      address:
        auction.title,

      winningBid:
        highestBid.amount,

      buyerName:
        winner?.name ||
        "Winning Bidder",

      buyerEmail:
        winner?.email ||
        "no-reply@mrbids.com",

      auctionUrl:
        `${process.env.NEXT_PUBLIC_APP_URL}/marketplace-auctions/${auction.id}`,

      coverImage:
        auction.coverImage ||
        auction.images?.[0] ||
        undefined,
    });

    const sellerPushSubs =
      await prisma.pushSubscription.findMany({
        where: {
          userId:
            auction.seller.id,
        },
      });

    for (const sub of sellerPushSubs) {

      try {

        await sendPushNotification({
          token:
            sub.endpoint,

          title:
            "Your auction ended",

          body:
            `${auction.title} sold successfully.`,

          url:
            `/marketplace-auctions/${auction.id}`,
        });

      } catch (err) {

        console.error(
          "PUSH SEND ERROR:",
          err
        );

      }

    }

    await createNotification({
      userId:
        auction.seller.id,

      title:
        "Your auction sold",

      message:
        `${auction.title} sold for $${highestBid.amount}.`,

      auctionId:
        auction.id,

      type:
        "AUCTION_WON",

      link:
        `/marketplace-auctions/${auction.id}`,

      metadata: {
        finalPrice:
          highestBid.amount,
      },
    });

  }

}