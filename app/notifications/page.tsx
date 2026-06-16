import Link from "next/link";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

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

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Notifications
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Stay updated on bids, auctions, and marketplace activity.
        </p>
      </div>

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
            <Link
              key={notification.id}
              href={notification.link || "#"}
              className={`block rounded-2xl border p-5 transition hover:shadow-sm ${
                notification.isRead
                  ? "border-gray-200 bg-white"
                  : "border-black bg-gray-50"
              }`}
            >
              <div className="flex items-start justify-between gap-4">

                <div className="flex-1">

                  <div className="flex items-center gap-2">

                    {!notification.isRead && (
                      <div className="h-2.5 w-2.5 rounded-full bg-black" />
                    )}

                    <p className="text-sm font-semibold text-gray-900">
                      {notification.title || "Notification"}
                    </p>

                  </div>

                  <p className="mt-2 text-sm text-gray-600">
                    {notification.message || ""}
                  </p>

                </div>

                <div className="shrink-0 text-xs text-gray-400">
                  {new Date(notification.createdAt).toLocaleDateString()}
                </div>

              </div>
            </Link>
          ))}

        </div>
      )}

    </div>
  );
}