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
  const hours = Math.floor(
    (total / (1000 * 60 * 60)) % 24
  );
  const minutes = Math.floor(
    (total / (1000 * 60)) % 60
  );

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

  // ⭐ prevent hydration mismatch
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

  // ⭐ render nothing until client mounts
  if (!mounted) {
    return <span>—</span>;
  }

  if (time.expired) {
    return <span>Auction ended</span>;
  }

  return (
    <span className="text-sm font-medium text-gray-900">
      {time.days}d {time.hours}h {time.minutes}m
    </span>
  );
}