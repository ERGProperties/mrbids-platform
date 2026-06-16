"use client";

import { useRouter } from "next/navigation";

export default function NotificationsHeader() {
  const router = useRouter();

  async function handleMarkAllRead() {
    try {
      await fetch("/api/notifications/read-all", {
        method: "POST",
      });

      router.refresh();
    } catch (error) {
      console.error(
        "MARK_ALL_NOTIFICATIONS_READ_ERROR",
        error
      );
    }
  }

  return (
    <div className="mb-8 flex items-center justify-between gap-4">

      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Notifications
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Stay updated on bids, auctions, and marketplace activity.
        </p>
      </div>

      <button
        onClick={handleMarkAllRead}
        className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
      >
        Mark all read
      </button>

    </div>
  );
}