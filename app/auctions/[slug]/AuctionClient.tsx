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
  const [flashBid, setFlashBid] = useState(false);

  const imageList =
    Array.isArray(liveAuction.images) &&
    liveAuction.images.length
      ? liveAuction.images
      : liveAuction.image
      ? [liveAuction.image]
      : [];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const selectedImage =
    imageList.length > 0 ? imageList[selectedIndex] : null;

  const auctionEnd =
    liveAuction.endAt || liveAuction.endsAt;

  /* LIVE STREAM */
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
            highestBid:
              data.highestBid ?? prev.highestBid,
            bidCount: data.bidCount ?? prev.bidCount,
            watchers: data.watchers ?? prev.watchers,
            endAt: data.endsAt ?? prev.endAt,
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

        {/* HEADER */}
        <div className="mb-8 border-b pb-6">

          {/* LIVE LABEL */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
            </span>
            <p className="text-[11px] uppercase tracking-[0.25em] text-gray-500 font-medium">
              LIVE AUCTION
            </p>
          </div>

          <h1 className="mt-3 text-4xl md:text-5xl font-semibold tracking-tight">
            {liveAuction.title}
          </h1>

          <p className="mt-2 text-gray-600">
            {liveAuction.addressLine} {liveAuction.cityStateZip}
          </p>

          {/* MARKETPLACE AUTHORITY LAYER */}
          <div className="mt-5 flex flex-wrap gap-3 text-sm">
            <div className="flex items-center gap-2 rounded-full border bg-white px-3 py-1.5">
              <span className="text-green-600">✔</span>
              Verified Seller
            </div>

            <div className="flex items-center gap-2 rounded-full border bg-white px-3 py-1.5">
              <span className="text-green-600">✔</span>
              Admin Reviewed Listing
            </div>

            <div className="flex items-center gap-2 rounded-full border bg-white px-3 py-1.5">
              <span className="text-green-600">✔</span>
              Transparent Bid History
            </div>
          </div>

        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-8">

          {/* IMAGE SECTION */}
          <div>
            <div
              className="relative bg-white border rounded-2xl overflow-hidden"
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

              {imageList.length > 1 && (
                <>
                  <button
                    onClick={goPrev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 text-white px-3 py-2 rounded-full"
                  >
                    ←
                  </button>
                  <button
                    onClick={goNext}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 text-white px-3 py-2 rounded-full"
                  >
                    →
                  </button>
                </>
              )}
            </div>

            {/* PROPERTY INFO */}
            <div className="mt-6 bg-white border rounded-2xl p-6">

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="rounded-xl bg-gray-50 p-4 border">
                  <p className="text-xs uppercase text-gray-500">Type</p>
                  <p className="text-sm font-semibold mt-1">
                    {liveAuction.propertyType || "—"}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4 border">
                  <p className="text-xs uppercase text-gray-500">Beds</p>
                  <p className="text-sm font-semibold mt-1">
                    {liveAuction.beds || "—"}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4 border">
                  <p className="text-xs uppercase text-gray-500">Baths</p>
                  <p className="text-sm font-semibold mt-1">
                    {liveAuction.baths || "—"}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4 border">
                  <p className="text-xs uppercase text-gray-500">Sqft</p>
                  <p className="text-sm font-semibold mt-1">
                    {liveAuction.sqft || "—"}
                  </p>
                </div>
              </div>

              <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
                {liveAuction.description}
              </div>

            </div>
          </div>

          {/* BID PANEL */}
          <aside className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white border rounded-2xl p-6 shadow-sm">

              <p className="text-sm text-gray-500">
                Current Highest Bid
              </p>

              <p
                className={`text-3xl font-semibold mt-1 transition ${
                  flashBid ? "text-green-600 scale-105" : ""
                }`}
              >
                ${liveAuction.highestBid?.toLocaleString()}
              </p>

              <div className="mt-4">
                {auctionEnd ? (
                  <AuctionCountdown
                    endsAt={new Date(auctionEnd)}
                  />
                ) : (
                  <p>Loading countdown...</p>
                )}
              </div>

              <div className="mt-6">
                {session ? (
                  <BidForm
                    slug={liveAuction.slug}
                    minimumBid={minimumBid}
                    currentBid={liveAuction.highestBid || 0}
                  />
                ) : (
                  <button
                    onClick={() =>
                      (window.location.href = "/api/auth/signin")
                    }
                    className="w-full bg-black text-white rounded-xl py-3"
                  >
                    Sign In to Bid
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