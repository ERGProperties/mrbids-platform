import { prisma }
  from "@/lib/prisma";

import { sendEmail }
  from "@/lib/notifications/email";

import { sendPushNotification }
  from "@/lib/push/sendPushNotification";

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
        status:
          "RESERVE_NOT_MET",
      },
    });

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

    await sendEmail({
      to:
        winner.email,

      subject:
        "🎉 You won the auction!",

      html: `
        <h2>Congratulations — you won!</h2>

        <p>${auction.title}</p>

        <p>
          Winning bid:
          $${highestBid.amount}
        </p>

        <p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/marketplace-auctions/${auction.id}">
            View auction
          </a>
        </p>
      `,
    });

    const winnerPushSubs =
      await prisma.pushSubscription.findMany({
        where: {
          userId:
            winner.id,
        },
      });

for (const sub of winnerPushSubs) {

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
}

// WINNER IN-APP NOTIFICATION
await prisma.notificationLog.create({
  data: {
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
}

// LOSER IN-APP NOTIFICATION
await prisma.notificationLog.create({
  data: {
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
  },
});

}

  // SELLER
  if (auction.seller?.email) {

    await sendEmail({
      to:
        auction.seller.email,

      subject:
        "Your auction has ended",

      html: `
        <h2>Your auction has ended</h2>

        <p>${auction.title}</p>

        <p>
          Final price:
          $${highestBid.amount}
        </p>
      `,
    });

    const sellerPushSubs =
      await prisma.pushSubscription.findMany({
        where: {
          userId:
            auction.seller.id,
        },
      });

for (const sub of sellerPushSubs) {

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
}

// SELLER IN-APP NOTIFICATION
await prisma.notificationLog.create({
  data: {
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
  },
});