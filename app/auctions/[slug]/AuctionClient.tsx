"use client";

import { useState, useRef } from "react";
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

  const imageList =
    Array.isArray(auction.images) && auction.images.length
      ? auction.images
      : auction.image
      ? [auction.image]
      : [];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const selectedImage =
    imageList.length > 0 ? imageList[selectedIndex] : null;

  const isVerified =
    session?.user?.isVerifiedBidder === true;

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

  // ⭐ MOBILE SWIPE
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
        <div className="mb-10 border-b border-gray-200 pb-6">
          <p className="text-[11px] uppercase tracking-[0.25em] text-gray-500 font-medium">
            LIVE AUCTION
          </p>

          <h1 className="mt-3 text-4xl md:text-5xl font-semibold tracking-tight text-gray-900">
            {auction.title || "Untitled Property"}
          </h1>

          {/* ⭐ FIXED ADDRESS DISPLAY */}
          <p className="mt-3 text-base text-gray-600">
            {auction.addressLine && <>{auction.addressLine}<br /></>}
            {auction.cityStateZip || "Location Pending"}
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-8">

          {/* LEFT SIDE */}
          <div>

            {/* IMAGE */}
            <div
              className="relative bg-white border rounded-2xl overflow-hidden mb-6"
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              {selectedImage ? (
                <>
                  <img
                    src={selectedImage}
                    alt="Property"
                    className="w-full h-[420px] object-cover"
                  />

                  {imageList.length > 1 && (
                    <>
                      <button
                        onClick={goPrev}
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 text-white w-10 h-10 rounded-full"
                      >
                        ←
                      </button>

                      <button
                        onClick={goNext}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 text-white w-10 h-10 rounded-full"
                      >
                        →
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="h-[420px] flex items-center justify-center text-gray-400">
                  No Image Available
                </div>
              )}
            </div>

            {/* THUMBNAILS */}
            {imageList.length > 1 && (
              <div className="flex gap-3 mb-8 overflow-x-auto">
                {imageList.map((img: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setSelectedIndex(i)}
                    className={`border rounded-lg overflow-hidden ${
                      i === selectedIndex ? "ring-2 ring-black" : ""
                    }`}
                  >
                    <img
                      src={img}
                      className="w-24 h-16 object-cover"
                      alt=""
                    />
                  </button>
                ))}
              </div>
            )}

            {/* DETAILS + DESCRIPTION unchanged */}
          </div>

          {/* RIGHT SIDE */}
          <aside className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white border rounded-2xl p-6 shadow-sm">
              <p className="text-sm text-gray-500">
                Current Highest Bid
              </p>
              <p className="text-3xl font-semibold mt-1">
                ${auction.highestBid?.toLocaleString()}
              </p>

              <div className="mt-4 text-sm text-gray-600">
                <AuctionCountdown endsAt={auction.endsAt} />
              </div>

              <div className="mt-6">
                {!session ? (
                  <button
                    onClick={() =>
                      (window.location.href = "/api/auth/signin")
                    }
                    className="w-full bg-black text-white rounded-xl py-3"
                  >
                    Create Account / Sign In to Bid
                  </button>
                ) : isVerified ? (
                  <BidForm
                    slug={auction.slug}
                    minimumBid={minimumBid}
                    currentBid={auction.highestBid || 0}
                  />
                ) : (
                  <p className="text-sm text-gray-600">
                    Verify your account to place bids.
                  </p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}