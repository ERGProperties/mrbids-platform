"use client";

import { useState } from "react";
import Link from "next/link";

const auctions = [
  {
    id: "1",
    address: "4127 Magnolia Ave, Dallas, TX",
    details: "3 Bed • 2 Bath • 1,842 Sq Ft",
    status: "Live",
    price: "$482,000",
    closes: "Closes in 2 days",
  },
  {
    id: "2",
    address: "8891 Cedar Ridge Dr, Plano, TX",
    details: "4 Bed • 3 Bath • 2,410 Sq Ft",
    status: "Upcoming",
    price: "Starting at $550,000",
    closes: "Opens Friday",
  },
  {
    id: "3",
    address: "1502 Oak Hollow Ln, Frisco, TX",
    details: "3 Bed • 2 Bath • 1,975 Sq Ft",
    status: "Closed",
    price: "Sold for $601,000",
    closes: "Auction ended",
  },
];

const filters = ["Live", "Upcoming", "Closed", "All"] as const;
type Filter = typeof filters[number];

export default function AuctionsIndexPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>("Live");

  const filteredAuctions =
    activeFilter === "All"
      ? auctions
      : auctions.filter((a) => a.status === activeFilter);

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* HEADER */}
        <div className="mb-10 max-w-3xl">
          <h1 className="text-4xl font-semibold text-gray-900">
            Real Estate Auctions
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Seller-direct auctions with verified buyers and
            escrow-controlled transactions.
          </p>
        </div>

        {/* FILTER TABS */}
        <div className="mb-12 flex gap-8 border-b border-gray-200">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`pb-3 text-sm font-medium transition ${
                activeFilter === filter
                  ? "text-gray-900 border-b-2 border-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* GRID OR EMPTY STATE */}
        {filteredAuctions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredAuctions.map((auction) => (
              <Link
                key={auction.id}
                href={`/auctions/${auction.id}`}
                className="group bg-white border border-gray-200 rounded-2xl p-6 hover:border-gray-300 transition"
              >
                <div className="mb-4">
                  <span
                    className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                      auction.status === "Live"
                        ? "bg-green-100 text-green-800"
                        : auction.status === "Upcoming"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {auction.status}
                  </span>
                </div>

                <h2 className="text-lg font-semibold text-gray-900 group-hover:underline">
                  {auction.address}
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                  {auction.details}
                </p>

                <p className="mt-4 text-xl font-medium text-gray-900">
                  {auction.price}
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  {auction.closes}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-24 max-w-xl">
            <h3 className="text-2xl font-medium text-gray-900">
              No {activeFilter.toLowerCase()} auctions available
            </h3>
            <p className="mt-4 text-gray-600">
              Inventory on MrBids is curated and released on a rolling
              basis. New auctions may be added at any time.
            </p>

            <div className="mt-8">
              <Link
                href="/request-access"
                className="inline-block px-6 py-3 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-900 transition"
              >
                Request Buyer Access
              </Link>
            </div>
          </div>
        )}

        {/* FOOTNOTE */}
        <div className="mt-20 text-xs text-gray-400 max-w-2xl">
          All auctions are subject to seller approval, verification
          requirements, and platform rules. Listings may be updated
          or withdrawn at the seller’s discretion.
        </div>
      </div>
    </main>
  );
}
