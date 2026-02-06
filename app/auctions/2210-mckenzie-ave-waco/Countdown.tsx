"use client";

import { useEffect, useState } from "react";

export default function Countdown() {
  // 🔒 LOCKED AUCTION END (Central Time)
  const auctionEnd = new Date("2026-02-15T17:00:00-06:00");

  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = auctionEnd.getTime() - now;

      if (distance <= 0) {
        setTimeLeft("Auction Closed");
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (distance % (1000 * 60 * 60)) / (1000 * 60)
      );

      setTimeLeft(`${days}d ${hours}h ${minutes}m remaining`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <p className="mt-2 text-sm text-gray-600">
      {timeLeft}
    </p>
  );
}
