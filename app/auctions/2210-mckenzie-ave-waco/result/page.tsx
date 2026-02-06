import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Auction Result — 2210 McKenzie Ave, Waco TX | MrBids",
  description:
    "Auction outcome for 2210 McKenzie Ave, Waco TX on the MrBids seller-direct auction platform.",
};

export default function AuctionResult2210McKenzie() {
  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-32">
        {/* HEADER */}
        <div className="mb-12 text-center">
          <p className="text-xs uppercase tracking-widest text-gray-400">
            Auction Result
          </p>
          <h1 className="mt-4 text-4xl font-semibold text-gray-900">
            2210 McKenzie Ave, Waco, TX 76708
          </h1>
        </div>

        {/* RESULT STATUS */}
        <div className="bg-white border border-gray-200 rounded-2xl p-10 mb-12 text-center">
          <h2 className="text-2xl font-semibold text-gray-900">
            Auction Closed
          </h2>

          <p className="mt-6 text-lg text-gray-600">
            The auction for this property has officially concluded.
          </p>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-gray-600">
            <div>
              <p className="font-medium text-gray-900">Auction Ended</p>
              <p className="mt-2">Feb 15, 2026 • 5:00 PM CT</p>
            </div>

            <div>
              <p className="font-medium text-gray-900">Starting Bid</p>
              <p className="mt-2">$100,000</p>
            </div>

            <div>
              <p className="font-medium text-gray-900">Bid Increment</p>
              <p className="mt-2">$5,000</p>
            </div>
          </div>
        </div>

        {/* OUTCOME MESSAGE */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-12">
          <h3 className="text-lg font-semibold text-gray-900">
            Outcome
          </h3>

          <div className="mt-6 space-y-4 text-sm text-gray-600 leading-relaxed">
            <p>
              The seller is currently reviewing auction activity and
              engaging with interested parties. The property may move
              forward under contract, be countered, or be relisted
              based on seller discretion.
            </p>

            <p>
              MrBids auctions are seller-direct. The seller retains full
              control over bid acceptance and is under no obligation to
              accept any offer submitted during the auction.
            </p>
          </div>
        </div>

        {/* NEXT STEPS */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
          <h3 className="text-lg font-semibold text-gray-900">
            Interested in Similar Opportunities?
          </h3>

          <p className="mt-4 text-sm text-gray-600">
            New auctions are added periodically. Buyer access is required
            to participate.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="/auctions"
              className="px-8 py-3 border border-gray-300 rounded-full text-sm font-medium hover:border-gray-400 transition"
            >
              Browse Auctions
            </a>

            <a
              href="/join"
              className="px-8 py-3 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-900 transition"
            >
              Request Buyer Access
            </a>
          </div>
        </div>

        {/* FOOTNOTE */}
        <p className="mt-12 text-xs text-gray-400 leading-relaxed text-center">
          Auction results and outcomes are provided for informational
          purposes only and do not constitute an offer or guarantee.
        </p>
      </div>
    </main>
  );
}
