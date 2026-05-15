"use client";

import { useEffect, useState } from "react";

export default function CountdownTimer({
  endAt,
}: {
  endAt: string | Date | null;
}) {

  const [
    timeLeft,
    setTimeLeft,
  ] = useState("");

  const [
    ended,
    setEnded,
  ] = useState(false);

  useEffect(() => {

    if (!endAt) return;

    function updateTimer() {

      const end =
        new Date(endAt).getTime();

      const now = Date.now();

      const distance =
        end - now;

      if (distance <= 0) {

        setEnded(true);

        setTimeLeft("Auction Ended");

        return;
      }

      const days = Math.floor(
        distance /
          (1000 * 60 * 60 * 24)
      );

      const hours = Math.floor(
        (distance %
          (1000 * 60 * 60 * 24)) /
          (1000 * 60 * 60)
      );

      const minutes = Math.floor(
        (distance %
          (1000 * 60 * 60)) /
          (1000 * 60)
      );

      const seconds = Math.floor(
        (distance %
          (1000 * 60)) /
          1000
      );

      if (days > 0) {

        setTimeLeft(
          `${days}d ${hours}h ${minutes}m`
        );

      } else {

        setTimeLeft(
          `${hours}h ${minutes}m ${seconds}s`
        );

      }
    }

    updateTimer();

    const interval =
      setInterval(updateTimer, 1000);

    return () =>
      clearInterval(interval);

  }, [endAt]);

  return (
    <div
      className={`rounded-2xl p-6 border ${
        ended
          ? "bg-gray-100 border-gray-200"
          : "bg-red-50 border-red-200"
      }`}
    >

      <p className="text-sm text-gray-500 mb-2">
        {ended
          ? "Status"
          : "Time Remaining"}
      </p>

      <p
        className={`text-3xl font-semibold ${
          ended
            ? "text-gray-700"
            : "text-red-600"
        }`}
      >
        {timeLeft}
      </p>

    </div>
  );
}