import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/notifications/email";

export async function GET() {
  try {
    const now = new Date();

    // =========================
    // ENDING SOON EMAILS
    // =========================
    const windows = [
      60 * 60 * 1000,
      15 * 60 * 1000,
      5 * 60 * 1000,
    ];

    for (const windowMs of windows) {
      const start = new Date(now.getTime() + windowMs - 60_000);
      const end = new Date(now.getTime() + windowMs + 60_000);

      const auctions = await prisma.auction.findMany({
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
            select: { bidderId: true },
          },
        },
      });

      for (const auction of auctions) {
        const uniqueBidderIds = [
          ...new Set(auction.bids.map((b) => b.bidderId)),
        ];

        for (const bidderId of uniqueBidderIds) {
          const user = await prisma.user.findUnique({
            where: { id: bidderId },
          });

          if (!user?.email) continue;

          await sendEmail({
            to: user.email,
            subject: "Auction ending soon ⏰",
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
        }

        // ⭐ LOCK so this only sends once
        await prisma.auction.update({
          where: { id: auction.id },
          data: {
            endingSoonSent: true,
          },
        });
      }
    }

    // =========================
    // AUCTION ENDED EMAILS
    // =========================
    const endedAuctions = await prisma.auction.findMany({
      where: {
        status: "LIVE",
        endedEmailsSent: false,
        endAt: {
          lte: now,
        },
      },
      include: {
        bids: {
          orderBy: { amount: "desc" },
        },
      },
    });

    for (const auction of endedAuctions) {
      const highestBid = auction.bids[0] || null;

      // close auction + lock emails
      await prisma.auction.update({
        where: { id: auction.id },
        data: {
          status: "CLOSED",
          finalPrice: highestBid?.amount ?? null,
          endedEmailsSent: true,
        },
      });

      const bidderIds = [
        ...new Set(auction.bids.map((b) => b.bidderId)),
      ];

      // ---------- WINNER ----------
      if (highestBid) {
        const winner = await prisma.user.findUnique({
          where: { id: highestBid.bidderId },
        });

        if (winner?.email) {
          await sendEmail({
            to: winner.email,
            subject: "🎉 You won the auction!",
            html: `
              <h2>Congratulations — you won!</h2>
              <p>${auction.title}</p>
              <p>Winning bid: $${highestBid.amount}</p>
              <p>
                <a href="https://mrbids.com/auctions/${auction.slug}">
                  View auction
                </a>
              </p>
            `,
          });
        }
      }

      // ---------- LOSERS ----------
      for (const bidderId of bidderIds) {
        if (bidderId === highestBid?.bidderId) continue;

        const user = await prisma.user.findUnique({
          where: { id: bidderId },
        });

        if (!user?.email) continue;

        await sendEmail({
          to: user.email,
          subject: "Auction ended — you were outbid",
          html: `
            <h2>This auction has ended</h2>
            <p>${auction.title}</p>
            <p>Final price: $${highestBid?.amount ?? "N/A"}</p>
            <p>
              <a href="https://mrbids.com/auctions/${auction.slug}">
                View results
              </a>
            </p>
          `,
        });
      }

      // ---------- SELLER ----------
      if (auction.sellerId) {
        const seller = await prisma.user.findUnique({
          where: { id: auction.sellerId },
        });

        if (seller?.email) {
          await sendEmail({
            to: seller.email,
            subject: "Your auction has ended",
            html: `
              <h2>Your auction has ended</h2>
              <p>${auction.title}</p>
              <p>Final price: $${highestBid?.amount ?? "No bids"}</p>
            `,
          });
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("NOTIFICATION CRON ERROR:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}