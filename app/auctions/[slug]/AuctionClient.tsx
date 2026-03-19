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
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);

  const touchStartX = useRef<number | null>(null);

  const imageList =
    Array.isArray(liveAuction?.images) && liveAuction.images.length
      ? liveAuction.images
      : liveAuction?.image
      ? [liveAuction.image]
      : [];

  const selectedImage =
    imageList.length > 0 ? imageList[selectedIndex] : null;

  const auctionEnd =
    liveAuction?.endAt || liveAuction?.endsAt;

  const isEndingSoon =
    auctionEnd &&
    new Date(auctionEnd).getTime() - Date.now() < 1000 * 60 * 10;

  /* POLLING */
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
    setSelectedIndex((prev) =>
      prev === 0 ? imageList.length - 1 : prev - 1
    );
  }

  function goNext() {
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

        {/* HEADER */}
        <div className="mb-8 border-b pb-6">
          <h1 className="text-4xl md:text-5xl font-semibold">
            {liveAuction?.title}
          </h1>

          <p className="text-gray-600 mt-2">
            {liveAuction?.addressLine} {liveAuction?.cityStateZip}
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-8">

          {/* LEFT */}
          <div>

            {/* IMAGE */}
            <div
              className="relative bg-white border rounded-2xl overflow-hidden cursor-pointer"
              onClick={() => setZoomOpen(true)}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              {selectedImage ? (
                <img
                  src={selectedImage}
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
                    onClick={(e) => {
                      e.stopPropagation();
                      goPrev();
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/70 border border-white text-white px-3 py-2 rounded-full"
                  >
                    ←
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      goNext();
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/70 border border-white text-white px-3 py-2 rounded-full"
                  >
                    →
                  </button>
                </>
              )}
            </div>

            {/* THUMBNAILS */}
            <div className="flex gap-2 mt-3 overflow-x-auto">
              {imageList.map((img: string, i: number) => (
                <img
                  key={i}
                  src={img}
                  onClick={() => setSelectedIndex(i)}
                  className={`h-20 w-28 object-cover rounded-lg cursor-pointer border-2 ${
                    i === selectedIndex
                      ? "border-black"
                      : "border-transparent"
                  }`}
                />
              ))}
            </div>

            {/* DETAILS */}
            <div className="mt-6 bg-white border rounded-2xl p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <InfoCard label="Type" value={liveAuction?.propertyType} />
                <InfoCard label="Beds" value={liveAuction?.beds} />
                <InfoCard label="Baths" value={liveAuction?.baths} />
                <InfoCard label="Sqft" value={liveAuction?.sqft} />
              </div>

              <div className="prose text-gray-700 whitespace-pre-line">
                {liveAuction?.description}
              </div>
            </div>

          </div>

          {/* RIGHT */}
          <aside className="lg:sticky lg:top-24">
            <div className="bg-white border rounded-2xl p-6">

              <p className="text-sm text-gray-500">
                Current Winning Bid
              </p>

              <p className={`text-3xl mt-2 ${flashBid ? "text-green-600" : ""}`}>
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
                <p className="text-red-600 mt-2">
                  ⚠️ Ending soon — don’t miss this deal
                </p>
              )}

              <div className="mt-4">
                {auctionEnd && (
                  <AuctionCountdown endsAt={new Date(auctionEnd)} />
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
                      (window.location.href = `/signin?callbackUrl=/auctions/${liveAuction.slug}`)
                    }
                    className="w-full bg-black text-white py-3 rounded-xl"
                  >
                    Sign In to Bid
                  </button>
                )}
              </div>

            </div>
          </aside>

        </div>

        {/* ZOOM MODAL */}
        {zoomOpen && selectedImage && (
          <div
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
            onClick={() => setZoomOpen(false)}
          >
            <img
              src={selectedImage}
              className="max-h-[90%] max-w-[90%]"
            />
          </div>
        )}

      </div>
    </main>
  );
}

function InfoCard({ label, value }: { label: string; value: any }) {
  return (
    <div className="bg-gray-50 p-4 rounded-xl border">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-semibold mt-1">{value || "—"}</p>
    </div>
  );
}