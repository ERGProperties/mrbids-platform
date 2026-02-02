import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buyer Dashboard | MrBids",
  description:
    "View auctions, track bids, and manage activity as a buyer on the MrBids platform.",
};

export default function BuyerDashboardPage() {
  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-32">
        <div className="bg-white border border-gray-200 rounded-2xl p-10">
          <h1 className="text-3xl font-semibold text-gray-900">
            Buyer Dashboard
          </h1>

          <p className="mt-6 text-lg text-gray-600 leading-relaxed">
            This dashboard will allow approved buyers to track auction
            activity, manage bids, and monitor transaction progress.
          </p>

          {/* STATUS */}
          <div className="mt-10 bg-gray-50 border border-gray-200 rounded-xl p-6">
            <p className="text-sm font-medium text-gray-900">
              Buyer Account Required
            </p>
            <p className="mt-2 text-sm text-gray-600">
              Buyer accounts are required to participate in auctions.
              Account access is being rolled out as part of the private
              marketplace launch.
            </p>
          </div>

          {/* FEATURES */}
          <div className="mt-12">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">
              Coming Features
            </h2>

            <ul className="mt-6 space-y-3 text-sm text-gray-600">
              <li>• Auction watchlists</li>
              <li>• Real-time bid tracking</li>
              <li>• Bid history and notifications</li>
              <li>• Post-auction next steps</li>
              <li>• Transaction status updates</li>
            </ul>
          </div>

          {/* CTA */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4">
            <a
              href="/auctions"
              className="px-8 py-3 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-900 transition text-center"
            >
              Browse Auctions
            </a>

            <a
              href="mailto:support@mrbids.com"
              className="px-8 py-3 border border-gray-300 rounded-full text-sm font-medium hover:border-gray-400 transition text-center"
            >
              Contact Support
            </a>
          </div>

          <p className="mt-10 text-xs text-gray-500">
            MrBids is a private marketplace. Buyer approval may be
            required prior to bidding.
          </p>
        </div>
      </div>
    </main>
  );
}
