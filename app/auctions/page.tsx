import Link from "next/link";
import { allAuctions } from "@/lib/auctions";

export const dynamic = "force-dynamic";

export default function AuctionsIndex() {
  const now = Date.now();

  const validAuctions = allAuctions.filter(
    (a): a is NonNullable<typeof a> => Boolean(a && a.auctionEnd)
  );

  const liveAuctions = validAuctions.filter(
    (a) => new Date(a.auctionEnd).getTime() > now
  );

  const pastAuctions = validAuctions.filter(
    (a) => new Date(a.auctionEnd).getTime() <= now
  );

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-32">
        {/* LIVE AUCTIONS */}
        <h1 className="text-4xl font-semibold text-gray-900 mb-8">
          Live Auctions
        </h1>

        {liveAuctions.length === 0 ? (
          <p className="text-gray-600 mb-16">
            There are currently no live auctions.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {liveAuctions.map((auction) => (
              <AuctionCard
                key={auction.slug}
                auction={auction}
                isPast={false}
              />
            ))}
          </div>
        )}

        {/* PAST AUCTIONS */}
        {pastAuctions.length > 0 && (
          <>
            <h2 className="text-3xl font-semibold text-gray-900 mb-8">
              Past Auctions
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {pastAuctions.map((auction) => (
                <AuctionCard
                  key={auction.slug}
                  auction={auction}
                  isPast
                />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}

function AuctionCard({
  auction,
  isPast = false,
}: {
  auction: any;
  isPast?: boolean;
}) {
  const href = isPast
    ? `/auctions/${auction.slug}/result`
    : `/auctions/${auction.slug}`;

  return (
    <Link
      href={href}
      className={`block bg-white border border-gray-200 rounded-2xl overflow-hidden transition ${
        isPast ? "opacity-70 hover:opacity-100" : "hover:shadow-md"
      }`}
    >
      <div className="aspect-[4/3] bg-gray-100 relative">
        <img
          src={`${auction.imagesPath}/${auction.images[0]}`}
          alt="Auction property"
          className="h-full w-full object-cover"
        />

        {isPast && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="text-sm font-semibold text-gray-900">
              Auction Closed
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900">
          {auction.addressLine}
        </h3>

        <p className="mt-1 text-sm text-gray-600">
          {auction.cityStateZip}
        </p>

        {/* LIVE AUCTION META */}
        {!isPast && (
          <div className="mt-4 flex justify-between text-sm text-gray-600">
            <span>
              Starting Bid: $
              {auction.startingBid.toLocaleString()}
            </span>

            {auction.arv && (
              <span>
                ARV: ${auction.arv.toLocaleString()}
              </span>
            )}
          </div>
        )}

        {/* PAST AUCTION RESULTS */}
        {isPast && (
          <div className="mt-4 grid grid-cols-3 gap-4 text-sm text-gray-700">
            <div>
              <p className="font-medium text-gray-900">Final Price</p>
              <p className="mt-1">
                {auction.finalPrice
                  ? `$${auction.finalPrice.toLocaleString()}`
                  : "—"}
              </p>
            </div>

            <div>
              <p className="font-medium text-gray-900">Bids</p>
              <p className="mt-1">
                {auction.bidCount ?? "—"}
              </p>
            </div>

            <div>
              <p className="font-medium text-gray-900">Duration</p>
              <p className="mt-1">
                {auction.durationDays
                  ? `${auction.durationDays} days`
                  : "—"}
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 text-sm font-medium text-black">
          {isPast ? "View Result →" : "View Auction →"}
        </div>
      </div>
    </Link>
  );
}
