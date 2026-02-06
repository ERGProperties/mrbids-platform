import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Auctions | MrBids",
  description: "Browse live and completed real estate auctions on MrBids.",
};

// 🔒 AUCTION END TIMES (centralized, explicit)
const AUCTIONS = [
  {
    id: "2210-mckenzie-ave-waco",
    title: "2210 McKenzie Ave",
    location: "Waco, TX",
    href: "/auctions/2210-mckenzie-ave-waco",
    endTime: new Date("2026-02-15T17:00:00-06:00"),
    startingBid: "$100,000",
  },
];

export default function AuctionsPage() {
  const now = Date.now();

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-32">
        {/* HEADER */}
        <div className="mb-14">
          <h1 className="text-4xl font-semibold text-gray-900">
            Auctions
          </h1>
          <p className="mt-6 text-lg text-gray-600">
            Seller-direct real estate auctions with transparent terms and
            controlled participation.
          </p>
        </div>

        {/* AUCTIONS LIST */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {AUCTIONS.map((auction) => {
            const isClosed = now >= auction.endTime.getTime();

            return (
              <div
                key={auction.id}
                className="bg-white border border-gray-200 rounded-2xl p-8 flex flex-col justify-between"
              >
                <div>
                  {/* STATUS BADGE */}
                  <div className="mb-4">
                    {isClosed ? (
                      <span className="inline-block text-xs font-medium uppercase tracking-widest px-3 py-1 rounded-full bg-gray-100 text-gray-600">
                        Auction Closed
                      </span>
                    ) : (
                      <span className="inline-block text-xs font-medium uppercase tracking-widest px-3 py-1 rounded-full bg-green-100 text-green-700">
                        Live Auction
                      </span>
                    )}
                  </div>

                  {/* TITLE */}
                  <h2 className="text-xl font-semibold text-gray-900">
                    {auction.title}
                  </h2>
                  <p className="mt-2 text-sm text-gray-600">
                    {auction.location}
                  </p>

                  {/* DETAILS */}
                  <p className="mt-6 text-sm text-gray-600">
                    Starting Bid:{" "}
                    <span className="font-medium text-gray-900">
                      {auction.startingBid}
                    </span>
                  </p>
                </div>

                {/* CTA */}
                <div className="mt-8">
                  <a
                    href={
                      isClosed
                        ? `${auction.href}/result`
                        : auction.href
                    }
                    className="inline-block w-full text-center px-6 py-3 rounded-full text-sm font-medium border border-gray-300 hover:border-gray-400 transition"
                  >
                    {isClosed ? "View Auction Result" : "View Auction"}
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
