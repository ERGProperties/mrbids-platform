"use client";

import { useState } from "react";
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

          <p className="mt-3 text-base text-gray-600">
            {auction.cityStateZip ||
              auction.addressLine ||
              "Location Pending"}
          </p>
        </div>

        {/* MAIN GRID */}
        <div className="grid lg:grid-cols-[1fr_360px] gap-8">

          {/* LEFT SIDE */}
          <div>

            {/* MAIN IMAGE WITH ARROWS */}
            <div className="relative bg-white border rounded-2xl overflow-hidden mb-6">
              {selectedImage ? (
                <>
                  <img
                    src={selectedImage}
                    alt="Property"
                    className="w-full h-[420px] object-cover"
                  />

                  {imageList.length > 1 && (
                    <>
                      {/* LEFT ARROW */}
                      <button
                        onClick={goPrev}
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 text-white w-10 h-10 rounded-full hover:bg-black/80 transition"
                        aria-label="Previous image"
                      >
                        ←
                      </button>

                      {/* RIGHT ARROW */}
                      <button
                        onClick={goNext}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 text-white w-10 h-10 rounded-full hover:bg-black/80 transition"
                        aria-label="Next image"
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

            {/* PROPERTY DETAILS */}
            <div className="bg-white border rounded-2xl p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">
                Property Details
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>Beds: {auction.beds ?? "-"}</div>
                <div>Baths: {auction.baths ?? "-"}</div>
                <div>Sqft: {auction.sqft ?? "-"}</div>
                <div>Type: {auction.propertyType ?? "-"}</div>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="bg-white border rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4">
                Description
              </h2>
              <p className="text-gray-700 whitespace-pre-line">
                {auction.description || "No description provided."}
              </p>
            </div>
          </div>

          {/* RIGHT SIDE — STICKY BID PANEL */}
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
                    className="w-full bg-black text-white rounded-xl py-3 font-medium hover:bg-gray-800 transition"
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