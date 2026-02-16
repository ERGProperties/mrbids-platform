import Link from "next/link";
import { allAuctions } from "@/lib/auctions";

export const dynamic = "force-dynamic";

export default function AuctionsIndex() {
  const now = Date.now();

  const liveAuctions = allAuctions
    .filter((auction): auction is NonNullable<typeof auction> => {
      return Boolean(auction && auction.auctionEnd);
    })
    .filter(
      (auction) =>
        new Date(auction.auctionEnd).getTime() > now
    );

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-32">
        <h1 className="text-4xl font-semibold text-gray-900 mb-12">
          Live Auctions
        </h1>

        {liveAuctions.length === 0 ? (
          <p className="text-gray-600">
            There are currently no live auctions.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {liveAuctions.map((auction) => (
              <Link
                key={auction.slug}
                href={`/auctions/${auction.slug}`}
                className="block bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition"
              >
                <div className="aspect-[4/3] bg-gray-100">
                  <img
                    src={`${auction.imagesPath}/${auction.images[0]}`}
                    alt="Auction property"
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {auction.addressLine}
                  </h2>

                  <p className="mt-1 text-sm text-gray-600">
                    {auction.cityStateZip}
                  </p>

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

                  <div className="mt-4 text-sm font-medium text-black">
                    View Auction →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
