export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/db";
import { autoCloseExpiredAuctions } from "@/lib/auctionLifecycle";
import { getPrimaryImage } from "@/lib/getPrimaryImage";

/* ---------- HELPERS ---------- */

function formatCurrency(value?: number | null) {
  if (!value) return "—";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

/* 🔥 FINAL STABLE COUNTDOWN */
function formatTimeRemaining(endAt?: Date | string | null) {
  if (!endAt) return "—";

  const end = new Date(endAt);
  if (isNaN(end.getTime())) return "—";

  const diffMs = end.getTime() - Date.now();

  // 🔥 KEY: don't show "Ended" aggressively
  if (diffMs <= 0) return "Ending Soon";

  const totalMinutes = Math.floor(diffMs / (1000 * 60));

  // 🔥 GUARANTEE at least 1 minute display
  if (totalMinutes <= 0) return "1m";

  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;

  return `${minutes}m`;
}

/* 🔥 WATCHING COUNT */
function getWatchingCount(bidCount: number) {
  return Math.max(3, Math.min(8, bidCount + 2));
}

/* ---------- IMAGE ---------- */

function AuctionImage({ src }: { src: string | null }) {
  return (
    <div className="h-56 w-full bg-gray-100 overflow-hidden">
      {src ? (
        <img
          src={src}
          alt=""
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="h-full w-full flex items-center justify-center text-sm text-gray-400">
          No image available
        </div>
      )}
    </div>
  );
}

/* ---------- PAGE ---------- */

export default async function AuctionsPage() {
  await autoCloseExpiredAuctions();

  let auctions: any[] = [];

  try {
    auctions = await prisma.auction.findMany({
      orderBy: { endAt: "asc" },
    });
  } catch (err) {
    console.error("Failed loading auctions:", err);
  }

  const live = auctions.filter((a) => a?.status === "LIVE");
  const past = auctions.filter((a) => a?.status === "CLOSED");

  const sortedLive = [...live].sort((a, b) => {
    const aEnd = new Date(a?.endAt || 0).getTime();
    const bEnd = new Date(b?.endAt || 0).getTime();
    return aEnd - bEnd;
  });

  const endingSoon = sortedLive.filter((auction) => {
    const end = new Date(auction?.endAt || 0).getTime();
    return end - Date.now() < 1000 * 60 * 60 * 24 && end > Date.now();
  });

  const remainingLive = sortedLive.filter(
    (auction) => !endingSoon.some((a) => a.id === auction.id)
  );

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-32">

        {/* ENDING SOON */}
        {endingSoon.length > 0 && (
          <>
            <h1 className="text-3xl font-semibold mb-10">
              🔥 Ending Soon
            </h1>

            <div className="grid md:grid-cols-2 gap-8 mb-24">
              {endingSoon.map((auction) => {
                const bidCount = auction?.bidCount || 0;
                const watching = getWatchingCount(bidCount);

                return (
                  <div
                    key={auction?.id}
                    className="bg-white border rounded-2xl overflow-hidden"
                  >
                    <AuctionImage src={getPrimaryImage(auction)} />

                    <div className="p-6">
                      <h2 className="text-lg font-semibold">
                        {auction?.title ?? "Untitled Auction"}
                      </h2>

                      <p className="mt-2 text-sm text-gray-600">
                        {auction?.addressLine ?? ""}
                        <br />
                        {auction?.cityStateZip ?? ""}
                      </p>

                      <p className="mt-3 text-sm font-semibold text-gray-900">
                        ⏳ {formatTimeRemaining(auction?.endAt)}
                      </p>

                      <div className="mt-3 text-xs space-y-1">
                        <p className="text-orange-600 font-medium">
                          🔥 {watching} watching
                        </p>
                        <p className="text-gray-600">
                          ⚡ {bidCount} bids
                        </p>
                      </div>

                      <div className="mt-4 text-sm space-y-1">
                        <p>
                          Starting Bid:{" "}
                          <span className="font-semibold">
                            {formatCurrency(auction?.startingBid)}
                          </span>
                        </p>

                        <p>
                          Seller ARV:{" "}
                          <span className="font-semibold">
                            {formatCurrency(auction?.arv)}
                          </span>
                        </p>
                      </div>

                      <Link
                        href={`/auctions/${auction?.slug}`}
                        className="inline-block mt-6 px-6 py-2 bg-black text-white rounded-full text-sm"
                      >
                        View Live Auction
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* LIVE AUCTIONS */}
        <h2 className="text-3xl font-semibold mb-10">
          Live Auctions
        </h2>

        <div className="grid md:grid-cols-2 gap-8 mb-24">
          {remainingLive.map((auction) => {
            const bidCount = auction?.bidCount || 0;
            const watching = getWatchingCount(bidCount);

            return (
              <div
                key={auction?.id}
                className="bg-white border rounded-2xl overflow-hidden"
              >
                <AuctionImage src={getPrimaryImage(auction)} />

                <div className="p-6">
                  <h2 className="text-lg font-semibold">
                    {auction?.title ?? "Untitled Auction"}
                  </h2>

                  <p className="mt-2 text-sm text-gray-600">
                    {auction?.addressLine ?? ""}
                    <br />
                    {auction?.cityStateZip ?? ""}
                  </p>

                  <p className="mt-3 text-sm font-semibold text-gray-900">
                    ⏳ {formatTimeRemaining(auction?.endAt)}
                  </p>

                  <div className="mt-3 text-xs space-y-1">
                    <p className="text-orange-600 font-medium">
                      🔥 {watching} watching
                    </p>
                    <p className="text-gray-600">
                      ⚡ {bidCount} bids
                    </p>
                  </div>

                  <div className="mt-4 text-sm space-y-1">
                    <p>
                      Starting Bid:{" "}
                      <span className="font-semibold">
                        {formatCurrency(auction?.startingBid)}
                      </span>
                    </p>

                    <p>
                      Seller ARV:{" "}
                      <span className="font-semibold">
                        {formatCurrency(auction?.arv)}
                      </span>
                    </p>
                  </div>

                  <Link
                    href={`/auctions/${auction?.slug}`}
                    className="inline-block mt-6 px-6 py-2 bg-black text-white rounded-full text-sm"
                  >
                    View Live Auction
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* PAST AUCTIONS */}
        <h2 className="text-3xl font-semibold mb-10">
          Past Auctions
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {past.map((auction) => (
            <div
              key={auction?.id}
              className="bg-white border rounded-2xl overflow-hidden"
            >
              <AuctionImage src={getPrimaryImage(auction)} />

              <div className="p-6">
                <h2 className="text-lg font-semibold">
                  {auction?.title ?? "Untitled Auction"}
                </h2>

                <p className="mt-2 text-sm text-gray-600">
                  {auction?.addressLine ?? ""}
                  <br />
                  {auction?.cityStateZip ?? ""}
                </p>

                <p className="mt-3 text-sm text-gray-600">
                  Ended
                </p>

                <Link
                  href={`/auctions/${auction?.slug}/result`}
                  className="inline-block mt-6 px-6 py-2 bg-gray-900 text-white rounded-full text-sm"
                >
                  View Auction Results
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}