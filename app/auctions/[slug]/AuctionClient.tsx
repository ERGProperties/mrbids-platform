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
  const [showAlert, setShowAlert] = useState(false);
  const [lastBidderName, setLastBidderName] = useState("Someone");
  const [selectedIndex, setSelectedIndex] = useState(0);

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

            if (data.lastBidderName) {
              setLastBidderName(data.lastBidderName);
            }

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
            <div className="bg-white border rounded-2xl overflow-hidden">
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

              <div className="text-gray-700 whitespace-pre-line">
                {liveAuction?.description}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <aside className="lg:sticky lg:top-24">
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

              {session && liveAuction?.bidCount > 0 && (
                <div className="mt-3 text-sm font-medium">
                  {isWinning ? (
                    <div className="text-green-600">
                      🟢 You are currently winning
                    </div>
                  ) : (
                    <div className="text-red-600">
                      🔴 You’ve been outbid
                    </div>
                  )}
                </div>
              )}

              <div className="mt-3 text-sm">
                🔥 {watchingCount} watching • ⚡ {liveAuction?.bidCount || 0} bids
              </div>

              <div className="mt-4">
                {auctionEnd && (
                  <AuctionCountdown endsAt={new Date(auctionEnd)} />
                )}
              </div>

              {/* POST STATUS */}
              {liveAuction.status === "CLOSED" && session && (
                <div className="mt-4 p-4 rounded-xl border bg-gray-50">
                  {session.user.id === liveAuction.winnerId ? (
                    <div className="text-green-700 font-semibold">
                      🎉 You won this auction
                    </div>
                  ) : session.user.id === liveAuction.sellerId ? (
                    <div className="text-blue-700 font-semibold">
                      🏁 Your auction has ended
                    </div>
                  ) : (
                    <div className="text-gray-600 text-sm">
                      Auction ended
                    </div>
                  )}
                </div>
              )}

              {/* 🔥 IDENTITY + CTA */}
              {liveAuction.status === "CLOSED" && (
                <div className="mt-4 p-4 border rounded-xl bg-white space-y-4">

                  {session?.user?.id === liveAuction.winnerId && liveAuction.seller && (
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Seller</p>
                      <div className="flex items-center gap-3 mb-3">
                        <img
                          src={liveAuction.seller.avatarUrl || "/default-avatar.png"}
                          className="w-10 h-10 rounded-full border"
                        />
                        <Link href={`/user/${liveAuction.seller.id}`}>
                          {liveAuction.seller.name || "Anonymous"}
                        </Link>
                      </div>

                      <button
                        onClick={() =>
                          document
                            .getElementById("auction-messages")
                            ?.scrollIntoView({ behavior: "smooth" })
                        }
                        className="w-full bg-black text-white py-2 rounded-lg text-sm"
                      >
                        Message Seller
                      </button>
                    </div>
                  )}

                  {session?.user?.id === liveAuction.sellerId && liveAuction.winner && (
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Winning Bidder</p>
                      <div className="flex items-center gap-3 mb-3">
                        <img
                          src={liveAuction.winner.avatarUrl || "/default-avatar.png"}
                          className="w-10 h-10 rounded-full border"
                        />
                        <Link href={`/user/${liveAuction.winner.id}`}>
                          {liveAuction.winner.name || "Anonymous"}
                        </Link>
                      </div>

                      <button
                        onClick={() =>
                          document
                            .getElementById("auction-messages")
                            ?.scrollIntoView({ behavior: "smooth" })
                        }
                        className="w-full bg-black text-white py-2 rounded-lg text-sm"
                      >
                        Message Buyer
                      </button>
                    </div>
                  )}

                </div>
              )}

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