import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join MrBids | Buyer Access",
  description:
    "Request access to buy real estate through seller-direct auctions on the MrBids private marketplace.",
};

export default function JoinPage() {
  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-32">
        <div className="bg-white border border-gray-200 rounded-2xl p-10">
          <h1 className="text-3xl font-semibold text-gray-900">
            Join MrBids
          </h1>

          <p className="mt-6 text-lg text-gray-600 leading-relaxed">
            MrBids is a private marketplace for seller-direct real estate
            auctions. Buyer access is limited to approved participants.
          </p>

          {/* INFO */}
          <div className="mt-10 bg-gray-50 border border-gray-200 rounded-xl p-6">
            <p className="text-sm font-medium text-gray-900">
              Buyer Access
            </p>
            <p className="mt-2 text-sm text-gray-600">
              Approved buyers receive access to live auctions, bidding
              tools, and transaction updates. Access may be limited during
              early rollout.
            </p>
          </div>

          {/* HOW IT WORKS */}
          <div className="mt-12">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">
              What Happens Next
            </h2>

            <ol className="mt-6 space-y-3 text-sm text-gray-600 list-decimal list-inside">
              <li>Request buyer access</li>
              <li>Complete buyer verification when prompted</li>
              <li>Receive approval and platform access</li>
              <li>Participate in live auctions</li>
            </ol>
          </div>

          {/* CTA */}
          <div className="mt-12">
            <a
              href="mailto:support@mrbids.com?subject=Buyer%20Access%20Request"
              className="w-full block text-center px-8 py-4 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-900 transition"
            >
              Request Buyer Access
            </a>
          </div>

          <p className="mt-6 text-xs text-gray-500">
            By requesting access, you acknowledge that MrBids is a private
            marketplace and participation may require verification.
          </p>

          <p className="mt-10 text-xs text-gray-500">
            Questions? Contact{" "}
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
