export const dynamic = "force-dynamic";

import Link from "next/link";
import { getAllAuctions } from "@/lib/repositories/auctionRepository";
import { autoCloseExpiredAuctions } from "@/lib/auctionLifecycle";
import { getPrimaryImage } from "@/lib/getPrimaryImage";

/* ---------- TIME HELPERS ---------- */

function formatTimeRemaining(endAt?: Date | string | null) {
  if (!endAt) return "—";

  const end = new Date(endAt);
  if (isNaN(end.getTime())) return "—";

  const diff = end.getTime() - Date.now();

  if (diff <= 0) return "Ended";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);

  return `${days}d ${hours}h`;
}

/* ---------- IMAGE ---------- */

function AuctionImage({ src }: { src: string | null }) {
  return (
    <div className="h-56 w-full bg-gray-100 overflow-hidden">
      {typeof src === "string" && src.length > 0 ? (
        <img
          src={src}
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
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
    const result = await getAllAuctions();
    auctions = Array.isArray(result) ? result : [];
  } catch (err) {
    console.error("Failed loading auctions:", err);
  }

  const live = auctions.filter((a) => a?.status === "LIVE");
  const past = auctions.filter((a) => a?.status === "CLOSED");

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-32">

        <h1 className="text-3xl font-semibold mb-10">
          Live Auctions
        </h1>

        <div className="grid md:grid-cols-2 gap-8 mb-24">
          {live.map((auction) => (
            <div
              key={auction?.id}
              className="bg-white border rounded-2xl overflow-hidden"
            >
              <AuctionImage src={getPrimaryImage(auction)} />

              <div className="p-6">
                <h2 className="text-lg font-semibold">
                  {auction?.title ?? "Untitled Auction"}
                </h2>

                {/* ADDRESS */}
                <p className="mt-2 text-sm text-gray-600">
                  {auction?.addressLine ?? ""}
                  <br />
                  {auction?.cityStateZip ?? ""}
                </p>

                {/* TIME REMAINING */}
                <p className="mt-3 text-sm text-gray-600">
                  Ends in {formatTimeRemaining(auction?.endAt)}
                </p>

                <Link
                  href={`/auctions/${auction?.slug}`}
                  className="inline-block mt-6 px-6 py-2 bg-black text-white rounded-full text-sm"
                >
                  View Live Auction
                </Link>
              </div>
            </div>
          ))}
        </div>

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