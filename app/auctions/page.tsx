import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live Auctions | MrBids",
  description:
    "Browse live and upcoming seller-direct real estate auctions on MrBids. Access is limited to verified buyers.",
  openGraph: {
    title: "Live Real Estate Auctions | MrBids",
    description:
      "Explore seller-direct real estate auctions available to verified buyers on the MrBids platform.",
    url: "https://mrbids.com/auctions",
    siteName: "MrBids",
    type: "website",
  },
};

export default function AuctionsPage() {
  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-32">
        {/* HEADER */}
        <div className="mb-20">
          <h1 className="text-4xl font-semibold text-gray-900">
            Live Auctions
          </h1>
          <p className="mt-6 text-lg text-gray-600 leading-relaxed">
            Browse seller-direct real estate auctions available to
            verified buyers on the MrBids platform.
          </p>
        </div>

        {/* EMPTY STATE */}
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            No Live Auctions at the Moment
          </h2>

          <p className="mt-4 text-sm text-gray-600 max-w-md mx-auto">
            Auctions are released on a rolling basis and may be limited
            during private marketplace rollout. Please check back soon
            or contact us for early access.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="/buyer-dashboard"
              className="px-8 py-3 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-900 transition"
            >
              Buyer Access Info
            </a>

            <a
              href="mailto:support@mrbids.com"
              className="px-8 py-3 border border-gray-300 rounded-full text-sm font-medium hover:border-gray-400 transition"
            >
              Contact Support
            </a>
          </div>

          <p className="mt-8 text-xs text-gray-400">
            Access may be restricted to approved buyers.
          </p>
        </div>
      </div>
    </main>
  );
}
