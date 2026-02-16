import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Live Auction — 1604 Parkdale Dr, Wichita Falls TX | MrBids",
  description:
    "Seller-direct real estate auction featuring a light rehab opportunity in Wichita Falls, Texas.",
};

export default function AuctionParkdale() {
  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-32">

        {/* HEADER */}
        <div className="mb-16">
          <p className="text-xs uppercase tracking-widest text-gray-400">
            Live Seller-Direct Auction
          </p>
          <h1 className="mt-4 text-4xl font-semibold text-gray-900">
            1604 Parkdale Dr, Wichita Falls TX 76306
          </h1>
          <p className="mt-6 text-lg text-gray-600">
            4 Bed • 2 Bath • 2,134 SF • Light Rehab Opportunity
          </p>
        </div>

        {/* AUCTION SUMMARY */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
            <div>
              <p className="text-gray-400">Auction Status</p>
              <p className="font-medium text-gray-900">Live</p>
            </div>
            <div>
              <p className="text-gray-400">Starting Bid</p>
              <p className="font-medium text-gray-900">$50,000</p>
            </div>
            <div>
              <p className="text-gray-400">Bid Increment</p>
              <p className="font-medium text-gray-900">$2,500</p>
            </div>
            <div>
              <p className="text-gray-400">Seller ARV</p>
              <p className="font-medium text-gray-900">$195,000</p>
            </div>
          </div>
        </div>

        {/* PROPERTY OVERVIEW */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-12">
          <h2 className="text-lg font-semibold text-gray-900">
            Property Overview
          </h2>

          <p className="mt-6 text-sm text-gray-600 leading-relaxed">
            Located in Wichita Falls, this four-bedroom, two-bathroom
            home offers over 2,100 square feet of interior space and a
            functional layout well-suited for renovation and resale or
            rental repositioning.
          </p>

          <p className="mt-4 text-sm text-gray-600 leading-relaxed">
            The property requires light rehabilitation, making it an
            accessible opportunity for investors seeking manageable
            scope and clear upside.
          </p>
        </div>

        {/* PROPERTY FACTS */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-12">
          <h2 className="text-lg font-semibold text-gray-900">
            Property Facts
          </h2>

          <ul className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-y-4 text-sm text-gray-600">
            <li>• Bedrooms: 4</li>
            <li>• Bathrooms: 2</li>
            <li>• Living Area: 2,134 SF</li>
            <li>• Lot Size: 0.206 Acres</li>
            <li>• Year Built: 1961</li>
            <li>• Condition: Light Rehab Required</li>
          </ul>
        </div>

        {/* INVESTMENT NOTES */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-12">
          <h2 className="text-lg font-semibold text-gray-900">
            Investment Notes
          </h2>

          <ul className="mt-6 space-y-3 text-sm text-gray-600">
            <li>• Spacious layout with strong bedroom count</li>
            <li>• Suitable for resale or rental strategy</li>
            <li>• Manageable rehab scope compared to full renovations</li>
            <li>• ARV supported by neighborhood comparables (seller estimate)</li>
          </ul>
        </div>

        {/* AUCTION TERMS */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-12">
          <h2 className="text-lg font-semibold text-gray-900">
            Auction Structure & Terms
          </h2>

          <ul className="mt-6 space-y-3 text-sm text-gray-600">
            <li>• Seller-direct auction format</li>
            <li>• Investor buyers only</li>
            <li>• As-is sale</li>
            <li>• Reserve price set (not publicly disclosed)</li>
            <li>
              • If the auction concludes without a qualifying bid, the
              seller may engage interested parties post-auction
            </li>
          </ul>
        </div>

        {/* CTA */}
        <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">
          <h2 className="text-lg font-semibold text-gray-900">
            Request Buyer Access
          </h2>
          <p className="mt-4 text-sm text-gray-600">
            Verified buyers may request access to participate in this auction.
          </p>

          <a
            href="/join"
            className="inline-block mt-8 px-10 py-4 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-900 transition"
          >
            Request Access
          </a>

          <p className="mt-6 text-xs text-gray-400">
            Approval required. No obligation to bid.
          </p>
        </div>

        {/* FOOTNOTE */}
        <p className="mt-12 text-xs text-gray-400 leading-relaxed text-center">
          MrBids auctions are administered to facilitate seller-direct
          price discovery. Auction participation does not guarantee a
          sale or acceptance of any bid. All information is provided for
          informational purposes only.
        </p>
      </div>
    </main>
  );
}
