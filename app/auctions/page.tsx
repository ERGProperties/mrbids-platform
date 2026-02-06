import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Live Auctions | MrBids",
  description:
    "Browse seller-direct real estate auctions on the MrBids private marketplace.",
};

export default function AuctionsPage() {
  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-32">
        {/* HEADER */}
        <div className="mb-16">
          <h1 className="text-4xl font-semibold text-gray-900">
            Live Auctions
          </h1>
          <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-3xl">
            MrBids features seller-direct real estate auctions with
            transparent bidding, verified participants, and seller-
            controlled outcomes.
          </p>
        </div>

        {/* LIVE AUCTION */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-12">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-400">
                Live Auction
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-gray-900">
                2210 McKenzie Ave, Waco, TX
              </h2>
              <p className="mt-3 text-sm text-gray-600">
                Residential Property • Waco, Texas
              </p>
              <p className="mt-4 text-sm text-gray-600 max-w-xl">
                This property is currently being offered through a
                seller-direct auction as part of the MrBids private
                pilot.
              </p>
            </div>

            <div className="flex items-center">
              <Link
                href="/auctions/2210-mckenzie-ave-waco"
                className="inline-block px-8 py-3 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-900 transition"
              >
                View Auction
              </Link>
            </div>
          </div>
        </div>

        {/* SAMPLE AUCTION */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-16">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-400">
                Sample Listing
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-gray-900">
                Example Auction Format
              </h2>
              <p className="mt-3 text-sm text-gray-600">
                Demonstration Only
              </p>
              <p className="mt-4 text-sm text-gray-600 max-w-xl">
                This sample auction demonstrates how seller-direct
                auctions are structured on MrBids.
              </p>
            </div>

            <div className="flex items-center">
              <Link
                href="/auctions/sample"
                className="inline-block px-8 py-3 border border-gray-300 rounded-full text-sm font-medium hover:border-gray-400 transition"
              >
                View Sample Auction
              </Link>
            </div>
          </div>
        </div>

        {/* EMPTY STATE */}
        <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-12 text-center">
          <h3 className="text-lg font-semibold text-gray-900">
            Additional Auctions Coming Soon
          </h3>
          <p className="mt-4 text-sm text-gray-600 max-w-xl mx-auto">
            Auctions are released on a rolling basis as part of the
            private marketplace pilot.
          </p>

          <div className="mt-8">
            <Link
              href="/join"
              className="inline-block px-8 py-3 border border-gray-300 rounded-full text-sm font-medium hover:border-gray-400 transition"
            >
              Request Buyer Access
            </Link>
          </div>
        </div>

        {/* FOOTNOTE */}
        <p className="mt-14 text-xs text-gray-400 leading-relaxed max-w-3xl">
          MrBids is a technology platform and does not act as a broker,
          agent, or escrow holder. Participation is subject to platform
          approval and auction-specific terms.
        </p>
      </div>
    </main>
  );
}
