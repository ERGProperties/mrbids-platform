import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sample Auction Listing | MrBids",
  description:
    "Example of a seller-direct real estate auction listing on the MrBids platform.",
};

export default function SampleAuctionPage() {
  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-32">
        {/* HEADER */}
        <div className="mb-12">
          <p className="text-xs uppercase tracking-widest text-gray-400">
            Sample Listing
          </p>
          <h1 className="mt-4 text-4xl font-semibold text-gray-900">
            123 Example Street, Phoenix, AZ 85001
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Single-Family Residence • 3 Bed • 2 Bath • 1,850 SF
          </p>
        </div>

        {/* STATUS */}
        <div className="mb-12 bg-white border border-gray-200 rounded-2xl p-6 flex flex-col sm:flex-row justify-between gap-6">
          <div>
            <p className="text-sm font-medium text-gray-900">
              Auction Status
            </p>
            <p className="mt-2 text-sm text-gray-600">
              Live Auction (Sample)
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-900">
              Auction Ends
            </p>
            <p className="mt-2 text-sm text-gray-600">
              7 Days from Launch
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-900">
              Reserve Price
            </p>
            <p className="mt-2 text-sm text-gray-600">
              Not Publicly Disclosed
            </p>
          </div>
        </div>

        {/* PROPERTY OVERVIEW */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-12">
          <h2 className="text-lg font-semibold text-gray-900">
            Property Overview
          </h2>

          <p className="mt-6 text-sm text-gray-600 leading-relaxed">
            This sample listing demonstrates the structure and level of
            detail required for properties listed on MrBids. Actual
            listings will include verified information provided by the
            seller and reviewed prior to auction launch.
          </p>
        </div>

        {/* DETAILS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white border border-gray-200 rounded-2xl p-8">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">
              Property Details
            </h3>

            <ul className="mt-6 space-y-3 text-sm text-gray-600">
              <li>• Property Type: Single-Family</li>
              <li>• Year Built: 2005</li>
              <li>• Lot Size: 6,500 SF</li>
              <li>• Occupancy: Vacant</li>
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-8">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">
              Auction Terms
            </h3>

            <ul className="mt-6 space-y-3 text-sm text-gray-600">
              <li>• Seller retains bid acceptance control</li>
              <li>• No obligation to accept any offer</li>
              <li>• Funds flow through licensed escrow</li>
              <li>• Buyer verification required</li>
            </ul>
          </div>
        </div>

        {/* DISCLOSURES */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-12">
          <h2 className="text-lg font-semibold text-gray-900">
            Disclosures
          </h2>

          <p className="mt-6 text-sm text-gray-600 leading-relaxed">
            Property information is provided by the seller and subject to
            verification. Buyers are responsible for conducting their own
            due diligence prior to bidding. This sample listing is for
            illustrative purposes only.
          </p>
        </div>

        {/* CTA */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
          <h2 className="text-lg font-semibold text-gray-900">
            Interested in Participating?
          </h2>

          <p className="mt-4 text-sm text-gray-600">
            Access to live auctions is limited to approved buyers.
          </p>

          <div className="mt-8">
            <a
              href="/join"
              className="inline-block px-8 py-3 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-900 transition"
            >
              Request Access
            </a>
          </div>
        </div>

        {/* FOOTNOTE */}
        <p className="mt-12 text-xs text-gray-400 leading-relaxed">
          This page represents a sample auction listing and does not
          constitute an offer, solicitation, or listing agreement.
        </p>
      </div>
    </main>
  );
}
