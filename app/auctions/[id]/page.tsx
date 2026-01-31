"use client";

import { useState } from "react";

type AuctionStatus = "upcoming" | "live" | "ended";

export default function AuctionPage() {
  // Demo state — safe for production builds
  const [status] = useState<AuctionStatus>("live");
  // Change to: "upcoming" | "live" | "ended" to preview states

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-16">

        {/* LEFT COLUMN */}
        <div className="lg:col-span-2">
          {/* STATUS + TITLE */}
          <div className="mb-10">
            {status === "live" && (
              <div className="flex items-center gap-4 mb-4">
                <span className="px-4 py-1.5 text-xs font-medium rounded-full bg-green-100 text-green-800">
                  ● Live Auction
                </span>
                <span className="text-xs text-gray-500">
                  Closes in 2 days, 14 hours
                </span>
              </div>
            )}

            {status === "upcoming" && (
              <div className="flex items-center gap-4 mb-4">
                <span className="px-4 py-1.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                  Upcoming Auction
                </span>
                <span className="text-xs text-gray-500">
                  Opens Friday at 10:00 AM (CT)
                </span>
              </div>
            )}

            {status === "ended" && (
              <div className="flex items-center gap-4 mb-4">
                <span className="px-4 py-1.5 text-xs font-medium rounded-full bg-gray-200 text-gray-700">
                  Auction Ended
                </span>
                <span className="text-xs text-gray-500">
                  Finalized Thursday at 5:00 PM (CT)
                </span>
              </div>
            )}

            <h1 className="text-3xl font-semibold text-gray-900">
              4127 Magnolia Ave, Dallas, TX 75204
            </h1>

            <p className="mt-2 text-sm text-gray-600">
              Single-Family Residence • 3 Bed • 2 Bath • 1,842 Sq Ft
            </p>
          </div>

          {/* IMAGE PLACEHOLDER */}
          <div className="bg-white border border-gray-200 rounded-2xl h-80 flex items-center justify-center text-gray-400">
            Property images coming soon
          </div>

          {/* PROPERTY OVERVIEW */}
          <div className="mt-12 bg-white border border-gray-200 rounded-2xl p-8">
            <h2 className="text-lg font-semibold text-gray-900">
              Property Overview
            </h2>

            <p className="mt-4 text-sm text-gray-600 leading-relaxed">
              This property is offered via a seller-direct auction.
              The seller retains control over reserve pricing and
              acceptance of final bids. Participation is limited to
              verified buyers only.
            </p>
          </div>

          {/* BUYER ELIGIBILITY */}
          <div className="mt-12 bg-white border border-gray-200 rounded-2xl p-8">
            <h2 className="text-lg font-semibold text-gray-900">
              Buyer Eligibility
            </h2>

            <ul className="mt-6 space-y-3 text-sm text-gray-600">
              <li>✔ Government-issued ID verification</li>
              <li>✔ Proof of funds or financing capability</li>
              <li>✔ Agreement to binding auction terms</li>
            </ul>
          </div>
        </div>

        {/* RIGHT COLUMN — BID / STATUS PANEL */}
        <aside className="bg-white border border-gray-200 rounded-2xl p-8 h-fit sticky top-32">

          {status === "upcoming" && (
            <>
              <p className="text-sm text-gray-600 mb-6">
                This auction has not yet opened. Verified buyers will
                be notified when bidding begins.
              </p>

              <button
                disabled
                className="w-full py-4 rounded-full bg-gray-200 text-gray-500 text-sm font-medium cursor-not-allowed"
              >
                Bidding Opens Soon
              </button>
            </>
          )}

          {status === "live" && (
            <>
              <div className="mb-8">
                <p className="text-xs uppercase tracking-wide text-gray-400">
                  Current High Bid
                </p>
                <p className="mt-2 text-3xl font-semibold text-gray-900">
                  $482,000
                </p>

                <p className="mt-3 text-sm text-gray-600">
                  Early-stage bidding activity is common.
                  <span className="block text-xs text-gray-500 mt-1">
                    Competitive bids often occur closer to the scheduled close.
                  </span>
                </p>
              </div>

              <div className="mb-8 pb-6 border-b border-gray-100">
                <p className="text-xs uppercase tracking-wide text-gray-400">
                  Auction Closes
                </p>
                <p className="mt-2 text-lg font-medium text-gray-900">
                  Thursday, 5:00 PM (CT)
                </p>
              </div>

              <button
                disabled
                className="w-full py-4 rounded-full bg-gray-200 text-gray-500 text-sm font-medium cursor-not-allowed"
              >
                Verified Buyers Only
              </button>
            </>
          )}

          {status === "ended" && (
            <>
              <div className="mb-6">
                <p className="text-xs uppercase tracking-wide text-gray-400">
                  Final Sale Price
                </p>
                <p className="mt-2 text-3xl font-semibold text-gray-900">
                  $601,000
                </p>
              </div>

              <p className="text-sm text-gray-600 mb-6">
                This auction has concluded. The seller is reviewing
                final results or has accepted a winning bid.
              </p>

              <button
                disabled
                className="w-full py-4 rounded-full bg-gray-100 text-gray-500 text-sm font-medium cursor-not-allowed"
              >
                Auction Closed
              </button>
            </>
          )}
        </aside>
      </div>
    </main>
  );
}
