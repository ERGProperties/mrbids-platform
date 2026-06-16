import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

import NotificationItem from "@/components/notifications/NotificationItem";
import NotificationsHeader from "@/components/notifications/NotificationsHeader";

export default async function NotificationsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <p className="text-sm text-gray-500">
          Please sign in to view notifications.
        </p>
      </div>
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <p className="text-sm text-gray-500">
          User not found.
        </p>
      </div>
    );
  }

  const notifications = await prisma.notificationLog.findMany({
    where: {
      userId: user.id,
    },

    orderBy: {
      createdAt: "desc",
    },

    take: 50,
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-10">

      <NotificationsHeader />

      {notifications.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">

          <p className="text-lg font-medium text-gray-900">
            No notifications yet
          </p>

          <p className="mt-2 text-sm text-gray-500">
            When auction activity happens, notifications will appear here.
          </p>

        </div>
      ) : (
        <div className="space-y-4">

          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
            />
          ))}

        </div>
      )}

    </div>
  );
}