import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Seller Dashboard | MrBids",
  description:
    "Manage your seller profile, listings, and auction activity on MrBids.",
};

export default function SellerDashboardPage() {
  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-32">
        <div className="bg-white border border-gray-200 rounded-2xl p-10">
          <h1 className="text-3xl font-semibold text-gray-900">
            Seller Dashboard
          </h1>

          <p className="mt-6 text-lg text-gray-600 leading-relaxed">
            This dashboard will allow approved sellers to manage their
            profile, submit properties, and track auction activity.
          </p>

          {/* STATUS */}
          <div className="mt-10 bg-gray-50 border border-gray-200 rounded-xl p-6">
            <p className="text-sm font-medium text-gray-900">
              Account Required
            </p>
            <p className="mt-2 text-sm text-gray-600">
              Seller accounts are currently being rolled out. Access to
              the dashboard will be available once account creation is
              enabled.
            </p>
          </div>

          {/* FEATURES */}
          <div className="mt-12">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">
              Coming Features
            </h2>

            <ul className="mt-6 space-y-3 text-sm text-gray-600">
              <li>• Seller profile management</li>
              <li>• Property listing submission</li>
              <li>• Listing review and approval status</li>
              <li>• Auction performance tracking</li>
              <li>• Communication and notifications</li>
            </ul>
          </div>

          {/* CTA */}
          <div className="mt-12">
            <a
              href="/sell"
              className="inline-block px-8 py-3 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-900 transition"
            >
              Learn How to Sell on MrBids
            </a>
          </div>

          <p className="mt-10 text-xs text-gray-500">
            Questions about seller accounts? Contact{" "}
            <a
              href="mailto:support@mrbids.com"
              className="underline"
            >
              support@mrbids.com
            </a>.
          </p>
        </div>
      </div>
    </main>
  );
}
