"use client";

import {
  useEffect,
  useState,
} from "react";

export default function CountdownTimer({
  endAt,
  onExpire,
}: {
  endAt: string;
  onExpire?: () => void;
}) {

  const [
    timeLeft,
    setTimeLeft,
  ] = useState("");

  useEffect(() => {

    const interval =
      setInterval(() => {

        const now =
          new Date().getTime();

        const end =
          new Date(
            endAt
          ).getTime();

        const distance =
          end - now;

        if (distance <= 0) {

          setTimeLeft(
            "Auction Ended"
          );

          clearInterval(
            interval
          );

          if (onExpire) {
            onExpire();
          }

          return;
        }

        const days =
          Math.floor(
            distance /
              (1000 * 60 * 60 * 24)
          );

        const hours =
          Math.floor(
            (
              distance %
              (1000 * 60 * 60 * 24)
            ) /
              (1000 * 60 * 60)
          );

        const minutes =
          Math.floor(
            (
              distance %
              (1000 * 60 * 60)
            ) /
              (1000 * 60)
          );

        const seconds =
          Math.floor(
            (
              distance %
              (1000 * 60)
            ) / 1000
          );

        setTimeLeft(
          `${days}d ${hours}h ${minutes}m ${seconds}s`
        );

      }, 1000);

    return () =>
      clearInterval(
        interval
      );

  }, [endAt, onExpire]);

  return (
    <div className="border rounded-2xl p-6">

      <p className="text-sm text-gray-500 mb-2">
        Time Remaining
      </p>

      <p className="text-3xl font-semibold">
        {timeLeft}
      </p>

    </div>
  );
}