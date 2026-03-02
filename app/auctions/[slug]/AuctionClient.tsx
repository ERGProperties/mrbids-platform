"use client";

import { useState, useRef, useEffect } from "react";
import BidForm from "./BidForm";
import { useSession } from "next-auth/react";
import AuctionCountdown from "@/components/auction/AuctionCountdown";

export default function AuctionClient({
  auction,
  minimumBid,
}: {
  auction: any;
  minimumBid: number;
}) {
  const { data: session } = useSession();

  const [liveAuction, setLiveAuction] = useState(auction);
  const [showExtensionBanner, setShowExtensionBanner] =
    useState(false);
  const [flashBid, setFlashBid] = useState(false);

  const imageList =
    Array.isArray(liveAuction.images) && liveAuction.images.length
      ? liveAuction.images
      : liveAuction.image
      ? [liveAuction.image]
      : [];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const selectedImage =
    imageList.length > 0 ? imageList[selectedIndex] : null;

  const isVerified = true;

  // ⭐ normalize end date (supports BOTH fields)
  const auctionEnd =
    liveAuction.endAt || liveAuction.endsAt;

  useEffect(() => {
    if (!showExtensionBanner) return;
    const t = setTimeout(() => {
      setShowExtensionBanner(false);
    }, 6000);
    return () => clearTimeout(t);
  }, [showExtensionBanner]);

  useEffect(() => {
    const eventSource = new EventSource(
      `/api/auctions/${auction.slug}/stream`
    );

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        setLiveAuction((prev: any) => {
          if (
            data.highestBid &&
            data.highestBid !== prev.highestBid
          ) {
            setFlashBid(true);
            setTimeout(() => setFlashBid(false), 600);
          }

          return {
            ...prev,
            ...data,
            endAt: data.endAt
              ? new Date(data.endAt)
              : prev.endAt,
          };
        });
      } catch (err) {
        console.error("Stream parse error:", err);
      }
    };

    eventSource.onerror = () => {
      console.warn("Stream reconnecting...");
    };

    return () => eventSource.close();
  }, [auction.slug]);

  function goPrev() {
    if (!imageList.length) return;
    setSelectedIndex((prev) =>
      prev === 0 ? imageList.length - 1 : prev - 1
    );
  }

  function goNext() {
    if (!imageList.length) return;
    setSelectedIndex((prev) =>
      prev === imageList.length - 1 ? 0 : prev + 1
    );
  }

  function onTouchStart(e: React.TouchEvent<HTMLDivElement>) {
    touchStartX.current = e.touches[0].clientX;
  }

  function onTouchEnd(e: React.TouchEvent<HTMLDivElement>) {
    if (touchStartX.current == null) return;
    const delta =
      e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) {
      delta > 0 ? goPrev() : goNext();
    }
    touchStartX.current = null;
  }

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-16">

        {showExtensionBanner && (
          <div className="mb-6 rounded-xl border border-yellow-300 bg-yellow-100 p-3 text-sm font-medium text-yellow-800">
            ⏱ Auction extended due to active bidding!
          </div>
        )}

        <div className="mb-10 border-b border-gray-200 pb-6">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
            </span>
            <p className="text-[11px] uppercase tracking-[0.25em] text-gray-500 font-medium">
              LIVE AUCTION
            </p>
          </div>

          <h1 className="mt-3 text-4xl md:text-5xl font-semibold tracking-tight text-gray-900">
            {liveAuction.title || "Untitled Property"}
          </h1>
        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-8">

          <div>
            <div
              className="relative bg-white border rounded-2xl overflow-hidden mb-6"
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt="Property"
                  className="w-full h-[420px] object-cover"
                />
              ) : (
                <div className="h-[420px] flex items-center justify-center text-gray-400">
                  No Image Available
                </div>
              )}
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white border rounded-2xl p-6 shadow-sm">

              <p className="text-sm text-gray-500">
                Current Highest Bid
              </p>

              <p
                className={`text-3xl font-semibold mt-1 transition ${
                  flashBid ? "scale-105 text-green-600" : ""
                }`}
              >
                ${liveAuction.highestBid?.toLocaleString()}
              </p>

              <div className="mt-4 text-sm text-gray-600">
                {auctionEnd ? (
                  <AuctionCountdown
                    endsAt={new Date(auctionEnd)}
                  />
                ) : (
                  <p className="text-sm text-gray-500">
                    Loading countdown...
                  </p>
                )}
              </div>

              <div className="mt-6">
                {session ? (
                  <BidForm
                    slug={liveAuction.slug}
                    minimumBid={minimumBid}
                    currentBid={liveAuction.highestBid || 0}
                    onExtended={() =>
                      setShowExtensionBanner(true)
                    }
                  />
                ) : (
                  <button
                    onClick={() =>
                      (window.location.href = "/api/auth/signin")
                    }
                    className="w-full bg-black text-white rounded-xl py-3 font-medium"
                  >
                    Create Account / Sign In to Bid
                  </button>
                )}
              </div>

            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}