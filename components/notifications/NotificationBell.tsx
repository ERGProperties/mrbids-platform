"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Bell } from "lucide-react";

type NotificationResponse = {
  unreadCount: number;
};

export default function NotificationBell() {

  const [
    unreadCount,
    setUnreadCount,
  ] = useState(0);

  useEffect(() => {

    async function fetchNotifications() {

      try {

        const res =
          await fetch(
            "/api/notifications"
          );

        if (!res.ok) return;

        const data:
          NotificationResponse =
            await res.json();

        setUnreadCount(
          data.unreadCount || 0
        );

      } catch (error) {

        console.error(
          "NOTIFICATION_FETCH_ERROR",
          error
        );
      }
    }

    fetchNotifications();

    // POLLING
    const interval =
      setInterval(
        fetchNotifications,
        30000
      );

    return () => {

      clearInterval(interval);

    };

  }, []);

  return (
    <Link
      href="/notifications"
      className="relative flex items-center justify-center"
    >
      <Bell className="h-6 w-6" />

      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
          {unreadCount > 9
            ? "9+"
            : unreadCount}
        </span>
      )}
    </Link>
  );
}