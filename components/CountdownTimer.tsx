"use client";

import {
  useEffect,
  useState,
} from "react";

export default function CountdownTimer({
  endAt,
  onExpire,
  compact = false,
}: {
  endAt: string;
  onExpire?: () => void;
  compact?: boolean;
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

  if (compact) {

    return (

      <span className="text-xs font-medium text-red-500 leading-none">

        {timeLeft}

      </span>

    );

  }

  return (

  <div className="flex items-center gap-2">

    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 text-red-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 8v4l3 3M12 2a10 10 0 100 20 10 10 0 000-20z"
      />
    </svg>

    <span className="text-base font-semibold tracking-wide text-white">
      {timeLeft}
    </span>

  </div>

);

}