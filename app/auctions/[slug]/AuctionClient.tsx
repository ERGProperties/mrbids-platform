"use client";

import { useState, useEffect } from "react";
import BidForm from "./BidForm";
import { useSession } from "next-auth/react";
import AuctionCountdown from "@/components/auction/AuctionCountdown";
import Link from "next/link";

function getWatchingCount(bidCount: number) {
  return Math.max(3, Math.min(8, bidCount + 2));
}

export default function AuctionClient({
  auction,
  minimumBid,
}: {
  auction: any;
  minimumBid: number;
}) {
  const { data: session } = useSession();

  const [liveAuction, setLiveAuction] = useState<any>(auction);
  const [showAlert, setShowAlert] = useState(false);
  const [lastBidderName, setLastBidderName] = useState("Someone");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const imageList =
    Array.isArray(liveAuction?.images) && liveAuction.images.length
      ? liveAuction.images
      : liveAuction?.image
      ? [liveAuction.image]
      : [];

  const selectedImage =
    imageList.length > 0 ? imageList[selectedIndex] : null;

  const auctionEnd = liveAuction?.endAt;

  const watchingCount = getWatchingCount(liveAuction?.bidCount || 0);

  const prevImage = () => {
    setSelectedIndex((prev) =>
      prev === 0 ? imageList.length - 1 : prev - 1
    );
  };

  const nextImage = () => {
    setSelectedIndex((prev) =>
      prev === imageList.length - 1 ? 0 : prev + 1
    );
  };

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

          const hasChanged =
            data.highestBid !== prev.highestBid ||
            data.bidCount !== prev.bidCount ||
            data.endAt !== prev.endAt;

          if (!hasChanged) return prev;

          if (data.highestBid && data.highestBid !== prev.highestBid) {
            setShowAlert(true);

            if (data.lastBidderName) {
              setLastBidderName(data.lastBidderName);
            }

            setTimeout(() => setShowAlert(false), 1500);
          }

          return {
            ...prev,
            ...data, // ✅ KEEP ALL FIELDS (INCLUDING yearBuilt)
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

  return (
    <main className="bg-gray-50 min-h-screen overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-6 py-16">

        {/* HEADER */}
        <div className="mb-8 border-b pb-6">
          <h1 className="text-4xl md:text-5xl font-semibold">
            {liveAuction?.title}
          </h1>

          <p className="text-gray-600 mt-2">
            {liveAuction?.addressLine} {liveAuction?.cityStateZip}
          </p>

          {liveAuction?.seller && (
            <p className="text-sm text-gray-500 mt-2">
              Listed by{" "}
              <Link
                href={`/user/${liveAuction.seller.id}`}
                className="underline hover:text-black"
              >
                {liveAuction.seller.name || "Anonymous Seller"}
              </Link>
            </p>
          )}
        </div>

        {/* 🔥 CRITICAL FIX: items-start + full height */}
        <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">

          {/* LEFT */}
          <div className="min-w-0">

            <div className="relative bg-white border rounded-2xl overflow-hidden">
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
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white text-black rounded-full w-12 h-12 flex items-center justify-center shadow-xl border text-2xl font-bold"
                  >
                    ‹
                  </button>

                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white text-black rounded-full w-12 h-12 flex items-center justify-center shadow-xl border text-2xl font-bold"
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            {imageList.length > 1 && (
              <div className="mt-4 overflow-x-auto">
                <div className="flex gap-3">
                  {imageList.map((img: string, i: number) => (
                    <img
                      key={i}
                      src={img}
                      onClick={() => setSelectedIndex(i)}
                      className={`flex-shrink-0 w-24 h-20 object-cover rounded-lg cursor-pointer border-2 transition ${
                        selectedIndex === i
                          ? "border-blue-500"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 bg-white border rounded-2xl p-6">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <InfoCard label="Type" value={liveAuction?.propertyType} />
                <InfoCard label="Beds" value={liveAuction?.beds} />
                <InfoCard label="Baths" value={liveAuction?.baths} />
                <InfoCard label="Sqft" value={liveAuction?.sqft} />
                <InfoCard label="Year Built" value={liveAuction?.yearBuilt ?? "—"} />
              </div>

              <div className="text-gray-700 whitespace-pre-line">
                {liveAuction?.description}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="h-full">
            <div className="sticky top-24">

              <div className="bg-white border rounded-2xl p-6">

                {showAlert && (
                  <div className="mb-3 text-sm font-medium text-orange-600">
                    🔥 {lastBidderName} just placed a bid
                  </div>
                )}

                <p className="text-sm text-gray-500">
                  Current Winning Bid
                </p>

                <p className="text-3xl mt-2">
                  ${liveAuction?.highestBid?.toLocaleString?.() || 0}
                </p>

                <div className="mt-3 text-sm">
                  🔥 {watchingCount} watching • ⚡ {liveAuction?.bidCount || 0} bids
                </div>

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

            </div>
          </div>

        </div>

      </div>
    </main>
  );
}

function InfoCard({ label, value }: { label: string; value: any }) {
  return (
    <div className="bg-gray-50 p-4 rounded-xl border">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-semibold">{value || "—"}</p>
    </div>
  );
}