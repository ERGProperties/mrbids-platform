export const dynamic = "force-dynamic";

import Link from "next/link";
import { getAllAuctions } from "@/lib/repositories/auctionRepository";
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

function formatTimeRemaining(endAt?: Date | string | null) {
  if (!endAt) return "—";

  const end = new Date(endAt);
  const diff = end.getTime() - Date.now();

  if (diff <= 0) return "Ended";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);

  return `${days}d ${hours}h`;
}

function AuctionImage({ src }: { src: string | null }) {
  return (
    <div className="h-full w-full bg-gray-100 overflow-hidden">
      {src ? (
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

function getHighestBid(auction: any) {
  if (!auction?.bids || auction.bids.length === 0) return auction?.startingBid;

  return Math.max(...auction.bids.map((b: any) => b.amount));
}

/* ---------- PAGE ---------- */

export default async function HomePage() {
  let auctions: any[] = [];

  try {
    const result = await getAllAuctions();
    auctions = Array.isArray(result) ? result : [];
  } catch (err) {
    console.error(err);
  }

  const live = auctions.filter((a) => a?.status === "LIVE");

  const sortedLive = [...live].sort((a, b) => {
    const aEnd = new Date(a?.endAt || 0).getTime();
    const bEnd = new Date(b?.endAt || 0).getTime();
    return aEnd - bEnd;
  });

  const featured = sortedLive[0];

  const endingSoon = sortedLive.filter((a) => {
    const end = new Date(a?.endAt || 0).getTime();
    return end - Date.now() < 1000 * 60 * 60 * 24 && end > Date.now();
  });

  const liveCount = live.length;

  const bidCount = auctions.reduce(
    (total, a) => total + (a?.bids?.length || 0),
    0
  );

  return (
    <main className="bg-white">

      {/* HERO */}

      <section className="max-w-7xl mx-auto px-6 pt-36 pb-28">
        <div className="max-w-3xl">

          <p className="text-sm font-medium text-gray-500 mb-6 uppercase tracking-[0.18em]">
            Private Marketplace for Real Assets
          </p>

          <h1 className="text-6xl md:text-7xl font-semibold leading-[1.05]">
            Seller-Direct
            <br />
            Real Estate Auctions
          </h1>

          <p className="mt-10 text-xl text-gray-600">
            Verified buyers compete transparently while sellers retain full control.
          </p>

          <div className="mt-14 flex gap-4">
            <Link
              href="/auctions"
              className="px-10 py-5 bg-black text-white rounded-full"
            >
              Browse Auctions
            </Link>

            <Link
              href="/sell-property"
              className="px-10 py-5 border rounded-full"
            >
              Sell a Property
            </Link>
          </div>

        </div>
      </section>

      {/* MARKETPLACE ACTIVITY STRIP */}

      <section className="border-y bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-wrap gap-8 text-sm text-gray-700">
          <span>● {liveCount} auctions live now</span>
          <span>● {bidCount} bids placed</span>
          <span>● Auctions ending today</span>
          <span>● Verified buyers bidding</span>
        </div>
      </section>

      {/* FEATURED AUCTION */}

      {featured && (
        <section className="border-y bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 py-24">

            <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-6">
              Featured Auction
            </p>

            <div className="grid lg:grid-cols-2 bg-white border rounded-3xl overflow-hidden">

              <div className="h-[460px]">
                <AuctionImage src={getPrimaryImage(featured)} />
              </div>

              <div className="p-12 flex flex-col justify-center">

                <h2 className="text-4xl font-semibold">
                  {featured?.title}
                </h2>

                <p className="mt-4 text-sm text-gray-600">
                  {featured?.addressLine}
                  <br />
                  {featured?.cityStateZip}
                </p>

                <p className="mt-5 text-sm text-gray-600">
                  Ends in {formatTimeRemaining(featured?.endAt)}
                </p>

                <div className="mt-6 text-sm text-gray-700 space-y-1">
                  <p>
                    Current Bid:{" "}
                    <span className="font-semibold">
                      {formatCurrency(getHighestBid(featured))}
                    </span>
                  </p>

                  <p>
                    Seller ARV:{" "}
                    <span className="font-semibold">
                      {formatCurrency(featured?.arv)}
                    </span>
                  </p>
                </div>

                <Link
                  href={`/auctions/${featured?.slug}`}
                  className="inline-block mt-10 px-8 py-3 bg-black text-white rounded-full"
                >
                  View Featured Auction
                </Link>

              </div>
            </div>
          </div>
        </section>
      )}

      {/* ENDING SOON */}

      {endingSoon.length > 0 && (
        <section className="bg-white">
          <div className="max-w-7xl mx-auto px-6 py-24">

            <h2 className="text-4xl font-semibold mb-12">
              🔥 Ending Soon
            </h2>

            <div className="grid md:grid-cols-3 gap-10">

              {endingSoon.slice(0, 3).map((auction) => (

                <div
                  key={auction.id}
                  className="border rounded-3xl overflow-hidden"
                >

                  <div className="h-60">
                    <AuctionImage src={getPrimaryImage(auction)} />
                  </div>

                  <div className="p-7">

                    <h3 className="text-xl font-semibold">
                      {auction.title}
                    </h3>

                    <p className="mt-2 text-sm text-gray-600">
                      {auction.addressLine}
                      <br />
                      {auction.cityStateZip}
                    </p>

                    <p className="mt-3 text-sm text-gray-600">
                      Ends in {formatTimeRemaining(auction.endAt)}
                    </p>

                    <div className="mt-4 text-sm space-y-1">

                      <p>
                        Current Bid:{" "}
                        <span className="font-semibold">
                          {formatCurrency(getHighestBid(auction))}
                        </span>
                      </p>

                      <p>
                        Seller ARV:{" "}
                        <span className="font-semibold">
                          {formatCurrency(auction.arv)}
                        </span>
                      </p>

                    </div>

                    <Link
                      href={`/auctions/${auction.slug}`}
                      className="inline-block mt-6 px-6 py-2 bg-black text-white rounded-full text-sm"
                    >
                      View Auction
                    </Link>

                  </div>
                </div>

              ))}

            </div>

          </div>
        </section>
      )}

    </main>
  );
}