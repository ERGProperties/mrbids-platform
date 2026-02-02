import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account Required | MrBids",
  description:
    "Seller accounts are required to submit listings and access the MrBids platform.",
};

export default function AccountRequiredPage() {
  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-32">
        <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">
          <h1 className="text-3xl font-semibold text-gray-900">
            Seller Account Required
          </h1>

          <p className="mt-6 text-lg text-gray-600 leading-relaxed">
            To submit properties and access seller tools, you’ll need a
            MrBids seller account.
          </p>

          {/* STATUS */}
          <div className="mt-10 bg-gray-50 border border-gray-200 rounded-xl p-6">
            <p className="text-sm font-medium text-gray-900">
              Account Access Coming Soon
            </p>
            <p className="mt-2 text-sm text-gray-600">
              Seller accounts are currently being rolled out. In the
              meantime, you can learn more about selling on MrBids or
              contact our team for early access.
            </p>
          </div>

          {/* ACTIONS */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/sell"
              className="px-8 py-3 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-900 transition"
            >
              Learn How to Sell
            </a>

            <a
              href="mailto:support@mrbids.com"
              className="px-8 py-3 border border-gray-300 rounded-full text-sm font-medium hover:border-gray-400 transition"
            >
              Contact Support
            </a>
          </div>

          <p className="mt-10 text-xs text-gray-500">
            MrBids is a private marketplace. Access may be limited during
            early rollout.
          </p>
        </div>
      </div>
    </main>
  );
}
