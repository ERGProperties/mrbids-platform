"use client";

import { useEffect, useState } from "react";

function getTimeRemaining(end: Date) {
  const total = end.getTime() - Date.now();

  if (total <= 0) {
    return {
      expired: true,
      days: 0,
      hours: 0,
      minutes: 0,
    };
  }

  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((total / (1000 * 60)) % 60);

  return {
    expired: false,
    days,
    hours,
    minutes,
  };
}

export default function AuctionCountdown({
  endsAt,
}: {
  endsAt: string | Date;
}) {
  const [mounted, setMounted] = useState(false);

  const end =
    typeof endsAt === "string"
      ? new Date(endsAt)
      : endsAt;

  const [time, setTime] = useState(
    getTimeRemaining(end)
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const interval = setInterval(() => {
      setTime(getTimeRemaining(end));
    }, 1000);

    return () => clearInterval(interval);
  }, [end, mounted]);

  if (!mounted) return <span>—</span>;

  if (time.expired) {
    return <span className="text-red-600">Auction ended</span>;
  }

  // 🔥 SMART DISPLAY
  let display = "";

  if (time.days > 0) {
    display = `${time.days}d ${time.hours}h`;
  } else if (time.hours > 0) {
    display = `${time.hours}h ${time.minutes}m`;
  } else {
    display = `${Math.max(1, time.minutes)}m`;
  }

  return (
    <div className="text-sm font-semibold text-gray-900">
      ⏳ {display}
    </div>
  );
}