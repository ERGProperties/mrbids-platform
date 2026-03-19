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

  const [liveAuction, setLiveAuction] = useState<any>(auction);
  const [flashBid, setFlashBid] = useState(false);

  const imageList =
    Array.isArray(liveAuction?.images) && liveAuction.images.length
      ? liveAuction.images
      : liveAuction?.image
      ? [liveAuction.image]
      : [];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const selectedImage =
    imageList.length > 0 ? imageList[selectedIndex] : null;

  const auctionEnd =
    liveAuction?.endAt || liveAuction?.endsAt;

  const isEndingSoon =
    auctionEnd &&
    new Date(auctionEnd).getTime() - Date.now() < 1000 * 60 * 10;

  useEffect(() => {
    if (!auction?.slug) return;

    let isMounted = true;

    const fetchAuction = async () => {
      try {
        const res = await fetch(`/api/auctions/${auction.slug}`);
        if (!res.ok) return;

        const data = await res.json();
        if (!isMounted || !data) return;

        setLiveAuction((prev: any) => {
          if (!prev) return prev;

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
            bidCount:
              data.bidCount ?? prev.bidCount,
            endAt:
              data.endsAt ?? prev.endAt,
          };
        });
      } catch (err) {
        console.error("Polling error:", err);
      }
    };

    fetchAuction();
    const interval = setInterval(fetchAuction, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [auction?.slug]);

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

  const isWinner =
    liveAuction?.status === "CLOSED" &&
    session?.user?.id === liveAuction?.winnerId;

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-16">

        <div className="mb-8 border-b pb-6">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
            {liveAuction?.title || "Loading..."}
          </h1>

          <p className="mt-2 text-gray-600">
            {liveAuction?.addressLine} {liveAuction?.cityStateZip}
          </p>

          {isWinner && (
            <div className="mt-4 bg-green-50 border border-green-200 text-green-800 rounded-xl p-4">
              <div className="font-semibold text-lg">
                🎉 You won this auction
              </div>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-8">

          {/* LEFT */}
          <div>

            {/* IMAGE WITH ARROWS */}
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
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/70 border border-white text-white px-3 py-2 rounded-full shadow-lg hover:bg-black"
                  >
                    ←
                  </button>

                  <button
                    onClick={goNext}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/70 border border-white text-white px-3 py-2 rounded-full shadow-lg hover:bg-black"
                  >
                    →
                  </button>
                </>
              )}
            </div>

            {/* DETAILS */}
            <div className="mt-6 bg-white border rounded-2xl p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <InfoCard label="Type" value={liveAuction?.propertyType} />
                <InfoCard label="Beds" value={liveAuction?.beds} />
                <InfoCard label="Baths" value={liveAuction?.baths} />
                <InfoCard label="Sqft" value={liveAuction?.sqft} />
              </div>

              <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-line">
                {liveAuction?.description}
              </div>
            </div>

          </div>

          {/* RIGHT */}
          <aside className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white border rounded-2xl p-6 shadow-sm">

              <p className="text-sm text-gray-500">
                Current Winning Bid
              </p>

              <p className={`text-3xl font-semibold mt-2 ${flashBid ? "text-green-600" : ""}`}>
                ${liveAuction?.highestBid?.toLocaleString?.() || 0}
              </p>

              {liveAuction?.bidCount > 0 ? (
                <p className="text-sm text-gray-500 mt-2">
                  {liveAuction.bidCount} bids placed
                </p>
              ) : (
                <p className="text-sm text-gray-500 mt-2">
                  Active auction — place your bid
                </p>
              )}

              {isEndingSoon && (
                <p className="text-red-600 font-semibold mt-2">
                  ⚠️ Ending soon — don’t miss this deal
                </p>
              )}

              <p className="text-xs text-gray-400 mt-1">
                You must outbid to win
              </p>

              <div className="mt-4">
                {auctionEnd ? (
                  <AuctionCountdown endsAt={new Date(auctionEnd)} />
                ) : (
                  <p>Loading countdown...</p>
                )}
              </div>

              <p className="text-sm text-gray-600 mt-4">
                Highest bidder wins if seller accepts
              </p>

              <div className="mt-6">
                {session ? (
                  <BidForm
                    slug={liveAuction?.slug}
                    minimumBid={minimumBid}
                    currentBid={liveAuction?.highestBid || 0}
                  />
                ) : (
                  <button
                    onClick={() =>
                      (window.location.href = `/signin?callbackUrl=/auctions/${liveAuction?.slug}`)
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

function InfoCard({ label, value }: { label: string; value: any }) {
  return (
    <div className="rounded-xl bg-gray-50 p-4 border">
      <p className="text-xs uppercase text-gray-500">{label}</p>
      <p className="text-sm font-semibold mt-1">{value || "—"}</p>
    </div>
  );
}