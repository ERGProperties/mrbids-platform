import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sell a Property | MrBids",
  description:
    "Request access to sell property through seller-direct real estate auctions on the MrBids private marketplace.",
};

export default function SellPage() {
  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-32">
        {/* HEADER */}
        <div className="mb-16">
          <h1 className="text-4xl font-semibold text-gray-900">
            Sell Through a Seller-Direct Auction
          </h1>
          <p className="mt-6 text-lg text-gray-600 leading-relaxed">
            MrBids allows property owners to request access, submit
            properties for review, and test market demand through
            transparent auctions — while retaining full control over
            pricing, timing, and acceptance.
          </p>
        </div>

        {/* VALUE PROPS */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-14">
          <h2 className="text-lg font-semibold text-gray-900">
            Why Sell on MrBids
          </h2>

          <ul className="mt-6 space-y-4 text-sm text-gray-600">
            <li>✔ Seller-controlled reserve pricing</li>
            <li>✔ Listings reviewed before publishing</li>
            <li>✔ Verified buyers only</li>
            <li>✔ Transparent, auditable bidding</li>
            <li>✔ No obligation to accept any bid</li>
          </ul>

          <p className="mt-6 text-xs text-gray-500">
            MrBids is a technology platform and does not act as a broker,
            agent, or escrow holder.
          </p>
        </div>

        {/* PROCESS */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-14">
          <h2 className="text-lg font-semibold text-gray-900">
            How the Seller Process Works
          </h2>

          <ol className="mt-6 space-y-4 text-sm text-gray-600 list-decimal list-inside">
            <li>Request access to the platform</li>
            <li>Complete your seller profile</li>
            <li>Submit property details for review</li>
            <li>Approved listings go live to verified buyers</li>
          </ol>

          <p className="mt-6 text-sm text-gray-600">
            For common questions, review the{" "}
            <Link href="/faq" className="text-gray-900 underline">
              Seller FAQ
            </Link>.
          </p>
        </div>

        {/* CTA */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8">
          <h2 className="text-lg font-semibold text-gray-900">
            Request Seller Access
          </h2>

          <p className="mt-4 text-sm text-gray-600">
            Requesting access allows you to submit properties, track
            review status, and manage future listings. All listings are
            reviewed prior to being published.
          </p>

          <div className="mt-8">
            <Link
              href="/account-required"
              className="w-full block text-center px-8 py-4 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-900 transition"
            >
              Request Seller Access
            </Link>
          </div>

          <p className="mt-6 text-xs text-gray-500">
            Questions? Contact{" "}
            <a href="mailto:support@mrbids.com" className="underline">
              support@mrbids.com
            </a>.
          </p>
        </div>
      </div>
    </main>
  );
}
