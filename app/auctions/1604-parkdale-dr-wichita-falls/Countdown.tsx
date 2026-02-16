"use client";

import { useEffect, useState } from "react";

// 🔒 MUST MATCH PAGE AUCTION END (Central Time)
const AUCTION_END = new Date("2026-02-21T17:00:00-06:00");

function formatTime(ms: number) {
  if (ms <= 0) {
    return { days: 0, hours: 0, minutes: 0 };
  }

  const totalMinutes = Math.floor(ms / 1000 / 60);

  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  return { days, hours, minutes };
}

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    const update = () => {
      setTimeLeft(AUCTION_END.getTime() - Date.now());
    };

    update(); // run immediately on client
    const interval = setInterval(update, 1000 * 30); // update every 30s

    return () => clearInterval(interval);
  }, []);

  // ⛔ Prevent server/client mismatch
  if (timeLeft === null) {
    return (
      <p className="mt-2 text-sm text-gray-400">
        Calculating…
      </p>
    );
  }

  const { days, hours, minutes } = formatTime(timeLeft);

  return (
    <p className="mt-2 text-sm font-medium text-gray-900">
      {days}d {hours}h {minutes}m
    </p>
  );
}
