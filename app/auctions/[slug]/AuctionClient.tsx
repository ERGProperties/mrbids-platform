"use client";

import { useState, useRef, useEffect } from "react";
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
  const [flashBid, setFlashBid] = useState(false);
  const [showAlert, setShowAlert] = useState(false); // 🔥 NEW
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

  const auctionEnd = liveAuction?.endAt;

  const isEndingSoon =
    auctionEnd &&
    new Date(auctionEnd).getTime() - Date.now() < 1000 * 60 * 10;

  const watchingCount = getWatchingCount(liveAuction?.bidCount || 0);

  const isWinning =
    session?.user?.id === liveAuction?.leadingBidderId;

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
            setShowAlert(true);

            setTimeout(() => {
              setFlashBid(false);
              setShowAlert(false);
            }, 1500);
          }

          return {
            ...prev,
            highestBid:
              data.highestBid ?? prev.highestBid,
            bidCount:
              data.bidCount ?? prev.bidCount,
            endAt: data.endAt ?? prev.endAt,
            leadingBidderId:
              data.leadingBidderId ?? prev.leadingBidderId,
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

        <div className="grid lg:grid-cols-[1fr_360px] gap-8">

          {/* LEFT */}
          <div>
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
            </div>

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

              {/* 🔥 LIVE ALERT */}
              {showAlert && (
                <div className="mb-3 text-sm font-medium text-orange-600">
                  🔥 New bid just placed
                </div>
              )}

              <p className="text-sm text-gray-500">
                Current Winning Bid
              </p>

              <p className={`text-3xl mt-2 ${flashBid ? "text-green-600" : ""}`}>
                ${liveAuction?.highestBid?.toLocaleString?.() || 0}
              </p>

              {/* WIN / OUTBID */}
              {session && (
                <div className="mt-3 text-sm font-medium">
                  {isWinning ? (
                    <div className="text-green-600">
                      🟢 You are currently winning this auction
                    </div>
                  ) : (
                    <div className="text-red-600">
                      🔴 You’ve been outbid — place a higher bid
                    </div>
                  )}
                </div>
              )}

              <div className="mt-3 space-y-1 text-sm">
                <p className="text-orange-600 font-medium">
                  🔥 {watchingCount} people watching
                </p>

                <p className="text-gray-600">
                  ⚡ {liveAuction?.bidCount || 0} bids placed
                </p>
              </div>

              {isEndingSoon && (
                <p className="text-red-600 mt-3 font-medium">
                  ⏳ Ending soon — don’t miss this
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
                    Create Profile / Sign In to Bid
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
    <div className="bg-gray-50 p-4 rounded-xl border">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-semibold mt-1">{value || "—"}</p>
    </div>
  );
}