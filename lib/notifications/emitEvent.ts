import { prisma } from "@/lib/prisma";
import { sendEmail } from "./email";

export type NotificationEvent =
  | "NEW_HIGHEST_BID"
  | "OUTBID";

interface EmitEventParams {
  type: NotificationEvent;
  userId: string;
  auctionId: string;
  bidAmount?: number;
}

export async function emitNotificationEvent(params: EmitEventParams) {
  try {
    console.log("NOTIFICATION EVENT:", params);

    const user = await prisma.user.findUnique({
      where: { id: params.userId },
    });

    const auction = await prisma.auction.findUnique({
      where: { id: params.auctionId },
    });

    if (!user?.email || !auction) {
      console.log("Notification skipped: missing user or auction");
      return;
    }

    if (params.type === "NEW_HIGHEST_BID") {
      try {
        await sendEmail({
          to: user.email,
          subject: "You're currently the highest bidder 🎉",
          html: `
            <h2>You're winning!</h2>
            <p>Auction: ${auction.title}</p>
            <p>Your bid: $${params.bidAmount}</p>
          `,
        });

        console.log("Highest bidder email sent:", user.email);
      } catch (err) {
        console.error("Highest bidder email failed:", err);
      }
    }

    if (params.type === "OUTBID") {
      try {
        await sendEmail({
          to: user.email,
          subject: "You've been outbid — place a higher bid",
          html: `
            <h2>You've been outbid</h2>
            <p>Auction: ${auction.title}</p>
            <p>Current bid: $${params.bidAmount}</p>
            <p>
              <a href="https://mrbids.com/auctions/${auction.slug}">
                Place a higher bid
              </a>
            </p>
          `,
        });

        console.log("Outbid email sent:", user.email);
      } catch (err) {
        console.error("Outbid email failed:", err);
      }
    }
  } catch (err) {
    console.error("Notification system error:", err);
  }
}