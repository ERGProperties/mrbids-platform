import { prisma } from "@/lib/prisma";
import { sendPushNotification } from "./push";

// ✅ IMPORT YOUR NEW BRANDED EMAILS
import { sendOutbidEmail } from "@/lib/email/sendOutbidEmail";
import { sendHighestBidderEmail } from "@/lib/email/sendHighestBidderEmail";

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

    const auctionUrl = `https://mrbids.com/auctions/${auction.slug}`;

    // =========================
    // NEW HIGHEST BID
    // =========================
    if (params.type === "NEW_HIGHEST_BID") {
      try {
        await sendHighestBidderEmail({
          to: user.email,
          address: auction.title,
          bidAmount: params.bidAmount || 0, // ✅ FIXED
          auctionUrl,
        });

        console.log("Highest bidder email sent:", user.email);
      } catch (err) {
        console.error("Highest bidder email failed:", err);
      }
    }

    // =========================
    // OUTBID
    // =========================
    if (params.type === "OUTBID") {
      try {
        await sendOutbidEmail({
          to: user.email,
          address: auction.title,
          auctionUrl,
        });

        console.log("Outbid email sent:", user.email);
      } catch (err) {
        console.error("Outbid email failed:", err);
      }

      // ⭐ PUSH NOTIFICATIONS (unchanged)
      try {
        const subscriptions =
          await prisma.pushSubscription.findMany({
            where: {
              userId: user.id,
            },
          });

        for (const sub of subscriptions) {
          await sendPushNotification(sub, {
            title: "You've been outbid 🔥",
            body: "Someone placed a higher bid. Tap to bid again!",
          });
        }

        console.log(
          "Outbid push notifications sent:",
          subscriptions.length
        );
      } catch (err) {
        console.error("Outbid push failed:", err);
      }
    }
  } catch (err) {
    console.error("Notification system error:", err);
  }
}