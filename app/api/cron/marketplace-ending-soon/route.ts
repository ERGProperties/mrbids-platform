import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { resend, EMAIL_FROM } from "@/lib/email/mailer";

export async function GET() {

  try {

    const now =
      new Date();

    const fifteenMinutesFromNow =
      new Date(
        now.getTime() +
        15 * 60 * 1000
      );

    // FIND LIVE AUCTIONS ENDING SOON
    const auctions =
      await prisma.marketplaceAuction.findMany({
        where: {
          status: "LIVE",

          fifteenMinEndingSoonSent: false,

          endAt: {
            lte:
              fifteenMinutesFromNow,

            gte:
              now,
          },
        },

        include: {
          bids: {
            include: {
              bidder: true,
            },
          },
        },
      });

    for (const auction of auctions) {

      // FIND HIGHEST BID
      const highestBid =
        auction.bids.sort(
          (a, b) =>
            b.amount -
            a.amount
        )[0];

      // TRACK EMAILED USERS
      const emailedUserIds =
        new Set<string>();

      // EMAIL LOSING BIDDERS
      for (const bid of auction.bids) {

        // SKIP HIGHEST BIDDER
        if (
          highestBid &&
          bid.bidderId ===
            highestBid.bidderId
        ) {
          continue;
        }

        // SKIP NO EMAIL
        if (
          !bid.bidder?.email
        ) {
          continue;
        }

        // SKIP DUPLICATES
        if (
          emailedUserIds.has(
            bid.bidderId
          )
        ) {
          continue;
        }

        emailedUserIds.add(
          bid.bidderId
        );

        await resend.emails.send({
          from:
            EMAIL_FROM,

          to:
            bid.bidder.email,

          subject:
            `Auction ending soon: ${auction.title}`,

          html: `
            <div style="font-family: Arial, sans-serif;">

              <h2>
                Auction Ending Soon
              </h2>

              <p>
                You're no longer the highest bidder for:
              </p>

              <h3>
                ${auction.title}
              </h3>

              <p>
                The auction ends in less than 15 minutes.
              </p>

              <a
                href="${process.env.NEXT_PUBLIC_APP_URL}/marketplace-auctions/${auction.id}"
                style="
                  display:inline-block;
                  padding:12px 20px;
                  background:#000;
                  color:#fff;
                  text-decoration:none;
                  border-radius:6px;
                  margin-top:12px;
                "
              >
                Place Another Bid
              </a>

            </div>
          `,
        });

        // LOG EMAIL
        await prisma.notificationLog.create({
          data: {
            userId:
              bid.bidderId,

            auctionId:
              auction.id,

            type:
              "ENDING_SOON_EMAIL",
          },
        });

      }

      // MARK AS SENT
      await prisma.marketplaceAuction.update({
        where: {
          id: auction.id,
        },

        data: {
          fifteenMinEndingSoonSent: true,
        },
      });

    }

    return NextResponse.json({
      success: true,
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