"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface WatchlistHeartProps {
  auctionId: string;
}

export default function WatchlistHeart({
  auctionId,
}: WatchlistHeartProps) {
  const { data: session } = useSession();

  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadWatchlist() {
      if (!session?.user) return;

      try {
        const res = await fetch("/api/watchlist");

        if (!res.ok) return;

        const data = await res.json();

        setIsSaved(
          data.some((item: any) => item.auctionId === auctionId)
        );
      } catch (err) {
        console.error(err);
      }
    }

    loadWatchlist();
  }, [session?.user, auctionId]);

  async function toggleWatchlist(
    e: React.MouseEvent<HTMLButtonElement>
  ) {
    e.preventDefault();
    e.stopPropagation();

    if (!session?.user) {
      window.location.href = "/signin";
      return;
    }

    try {
      setLoading(true);

      if (isSaved) {
        await fetch(`/api/watchlist/${auctionId}`, {
          method: "DELETE",
        });

        setIsSaved(false);
      } else {
        await fetch("/api/watchlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            auctionId,
          }),
        });

        setIsSaved(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggleWatchlist}
      disabled={loading}
      aria-label="Save Auction"
      className="absolute top-4 right-4 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white/15 backdrop-blur-md border border-white/20 shadow-lg transition-all duration-200 hover:scale-110 hover:bg-white/25 disabled:opacity-50"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        viewBox="0 0 24 24"
        fill={isSaved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path d="M12 21s-7-4.35-9.5-8.28C.82 10.1 2.04 6.5 5.55 5.35c2.05-.68 4.24.08 5.45 1.9 1.21-1.82 3.4-2.58 5.45-1.9 3.51 1.15 4.73 4.75 3.05 7.37C19 16.65 12 21 12 21z" />
      </svg>
    </button>
  );
}