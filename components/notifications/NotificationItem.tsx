"use client";

import Link from "next/link";

type Props = {
  notification: {
    id: string;
    title: string | null;
    message: string | null;
    link: string | null;
    isRead: boolean;
    createdAt: Date;
  };
};

export default function NotificationItem({
  notification,
}: Props) {
  async function handleClick() {
    try {
      await fetch(
        `/api/notifications/${notification.id}/read`,
        {
          method: "PATCH",
        }
      );
    } catch (error) {
      console.error(
        "MARK_NOTIFICATION_READ_ERROR",
        error
      );
    }
  }

  return (
    <Link
      href={notification.link || "#"}
      onClick={handleClick}
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
  );
}