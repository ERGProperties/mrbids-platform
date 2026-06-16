import { prisma } from "@/lib/prisma";

type CreateNotificationParams = {
  userId: string;

  title: string;

  message: string;

  type: string;

  auctionId?: string;

  link?: string;

  metadata?: any;
};

export async function createNotification({
  userId,
  title,
  message,
  type,
  auctionId,
  link,
 metadata,
}: CreateNotificationParams) {

  const notification =
    await prisma.notificationLog.create({
      data: {
        userId,

        title,

        message,

        type: type as any,

        auctionId,

        link,

        metadata,
      },
    });

  return notification;
}