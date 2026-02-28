import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/notifications/email";

export async function GET() {
  try {
    const now = new Date();

    // windows: 1hr, 15min, 5min
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
          endAt: {
            gte: start,
            lte: end,
          },
          status: "LIVE",
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
              <p>Ends at: ${auction.endAt?.toISOString()}</p>
              <p>
                <a href="https://mrbids.com/auctions/${auction.slug}">
                  View auction
                </a>
              </p>
            `,
          });
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("ENDING SOON ERROR:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}