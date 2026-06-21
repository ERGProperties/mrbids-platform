import { NextResponse }
  from "next/server";

import { prisma }
  from "@/lib/prisma";

import { sendEmail }
  from "@/lib/notifications/email";

import { sendEndingSoonPush }
  from "@/lib/notifications/sendEndingSoonPush";

export async function GET() {

  try {

    const now =
      new Date();

    // =========================
    // TIME WINDOWS
    // =========================
    const windows = [
      60 * 60 * 1000,
      15 * 60 * 1000,
      5 * 60 * 1000,
    ];

    // =====================================================
    // REAL ESTATE AUCTIONS
    // =====================================================
    for (const windowMs of windows) {

      const start =
        new Date(
          now.getTime() +
            windowMs -
            60_000
        );

      const end =
        new Date(
          now.getTime() +
            windowMs +
            60_000
        );

      const auctions =
        await prisma.auction.findMany({
          where: {
            status: "LIVE",

            endingSoonSent: false,

            endAt: {
              gte: start,
              lte: end,
            },
          },

          include: {
            bids: {
              select: {
                bidderId: true,
              },
            },
          },
        });

      for (const auction of auctions) {

        const uniqueBidderIds = [
          ...new Set(
            auction.bids.map(
              (b) => b.bidderId
            )
          ),
        ];

        for (const bidderId of uniqueBidderIds) {

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
              "Auction ending soon ⏰",

            html: `
              <h2>Auction ending soon</h2>

              <p>${auction.title}</p>

              <p>
                <a href="https://mrbids.com/auctions/${auction.slug}">
                  View auction
                </a>
              </p>
            `,
          });

          await sendEndingSoonPush({
            userId:
              bidderId,

            title:
              auction.title || "Auction",

            auctionId:
              auction.id,
          });

        }

        await prisma.auction.update({
          where: {
            id: auction.id,
          },

          data: {
            endingSoonSent: true,
          },
        });
      }
    }

    // =====================================================
    // MARKETPLACE AUCTIONS
    // =====================================================
    for (const windowMs of windows) {

      const start =
        new Date(
          now.getTime() +
            windowMs -
            60_000
        );

      const end =
        new Date(
          now.getTime() +
            windowMs +
            60_000
        );

      const auctions =
        await prisma.marketplaceAuction.findMany({
where: {
  status: "LIVE",

  endAt: {
    gte: start,
    lte: end,
  },

  ...(windowMs === 60 * 60 * 1000 && {
    oneHourEndingSoonSent: false,
  }),

  ...(windowMs === 15 * 60 * 1000 && {
    fifteenMinEndingSoonSent: false,
  }),

  ...(windowMs === 5 * 60 * 1000 && {
    fiveMinEndingSoonSent: false,
  }),
},

          include: {
            bids: {
              select: {
                bidderId: true,
              },
            },
          },
        });

      for (const auction of auctions) {

        const uniqueBidderIds = [
          ...new Set(
            auction.bids.map(
              (b) => b.bidderId
            )
          ),
        ];

        // =========================================
        // BIDDER NOTIFICATIONS
        // =========================================
        for (const bidderId of uniqueBidderIds) {

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
              "Marketplace auction ending soon ⏰",

            html: `
              <h2>Marketplace auction ending soon</h2>

              <p>${auction.title}</p>

              <p>
                <a href="https://mrbids.com/marketplace-auctions/${auction.id}">
                  View auction
                </a>
              </p>
            `,
          });

          await sendEndingSoonPush({
            userId:
              bidderId,

            title:
              auction.title,

            auctionId:
              auction.id,
          });

        }

        // =========================================
        // WATCHLIST USERS
        // =========================================
        const watchlistUsers =
          await prisma.watchlist.findMany({
            where: {
              auctionId:
                auction.id,
            },

            include: {
              user: true,
            },
          });

        for (const item of watchlistUsers) {

          // SKIP USERS WHO ALREADY BID
          if (
            uniqueBidderIds.includes(
              item.userId
            )
          ) {
            continue;
          }

          if (!item.user.email) {
            continue;
          }

          await sendEmail({
            to:
              item.user.email,

            subject:
              "Watchlisted auction ending soon ⏰",

            html: `
              <h2>Your watched auction is ending soon</h2>

              <p>${auction.title}</p>

              <p>
                <a href="https://mrbids.com/marketplace-auctions/${auction.id}">
                  View auction
                </a>
              </p>
            `,
          });

          await sendEndingSoonPush({
            userId:
              item.userId,

            title:
              auction.title,

            auctionId:
              auction.id,
          });

        }

        await prisma.marketplaceAuction.update({
          where: {
            id: auction.id,
          },

data: {
  ...(windowMs === 60 * 60 * 1000 && {
    oneHourEndingSoonSent: true,
  }),

  ...(windowMs === 15 * 60 * 1000 && {
    fifteenMinEndingSoonSent: true,
  }),

  ...(windowMs === 5 * 60 * 1000 && {
    fiveMinEndingSoonSent: true,
  }),
},
        });
      }
    }

    // =====================================================
    // AUCTION ENDED EMAILS
    // =====================================================
    const endedAuctions =
      await prisma.auction.findMany({
        where: {
          status: "LIVE",

          endedEmailsSent: false,

          endAt: {
            lte: now,
          },
        },

        include: {
          bids: {
            orderBy: {
              amount: "desc",
            },
          },
        },
      });

    for (const auction of endedAuctions) {

      const highestBid =
        auction.bids[0] || null;

      await prisma.auction.update({
        where: {
          id: auction.id,
        },

        data: {
          status: "CLOSED",

          finalPrice:
            highestBid?.amount ??
            null,

          endedEmailsSent: true,
        },
      });

      const bidderIds = [
        ...new Set(
          auction.bids.map(
            (b) => b.bidderId
          )
        ),
      ];

      // WINNER
      if (highestBid) {

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
                <a href="https://mrbids.com/auctions/${auction.slug}">
                  View auction
                </a>
              </p>
            `,
          });
        }
      }

      // LOSERS
      for (const bidderId of bidderIds) {

        if (
          bidderId ===
          highestBid?.bidderId
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
              $${highestBid?.amount ?? "N/A"}
            </p>

            <p>
              <a href="https://mrbids.com/auctions/${auction.slug}">
                View results
              </a>
            </p>
          `,
        });
      }

      // SELLER
      if (auction.sellerId) {

        const seller =
          await prisma.user.findUnique({
            where: {
              id:
                auction.sellerId,
            },
          });

        if (seller?.email) {

          await sendEmail({
            to:
              seller.email,

            subject:
              "Your auction has ended",

            html: `
              <h2>Your auction has ended</h2>

              <p>${auction.title}</p>

              <p>
                Final price:
                $${highestBid?.amount ?? "No bids"}
              </p>
            `,
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
    });

  } catch (err) {

    console.error(
      "NOTIFICATION CRON ERROR:",
      err
    );

    return NextResponse.json(
      {
        error:
          "Server error",
      },
      {
        status: 500,
      }
    );
  }
}