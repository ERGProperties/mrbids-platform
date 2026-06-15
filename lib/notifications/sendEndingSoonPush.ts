import { prisma }
  from "@/lib/prisma";

import { sendPushNotification }
  from "@/lib/push/sendPushNotification";

export async function sendEndingSoonPush({
  userId,
  title,
  auctionId,
}: {
  userId: string;

  title: string;

  auctionId: string;
}) {

  try {

    const subscriptions =
      await prisma.pushSubscription.findMany({
        where: {
          userId,
        },
      });

    for (const sub of subscriptions) {

      await sendPushNotification({
        token:
          sub.endpoint,

        title:
          "Auction ending soon ⏰",

        body:
          `${title} is ending soon.`,

        url:
          `/auctions/${auctionId}`,
      });
    }

  } catch (err) {

    console.error(
      "ENDING SOON PUSH ERROR:",
      err
    );
  }
}