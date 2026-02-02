import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Seller Pilot Onboarding | MrBids",
  description:
    "Step-by-step onboarding checklist for sellers participating in the MrBids private auction pilot.",
};

export default function SellerPilotPage() {
  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-32">
        <div className="bg-white border border-gray-200 rounded-2xl p-10">
          <h1 className="text-3xl font-semibold text-gray-900">
            Seller Pilot Onboarding Checklist
          </h1>

          <p className="mt-6 text-lg text-gray-600 leading-relaxed">
            This checklist outlines the steps required for sellers
            participating in the MrBids private auction pilot. The goal
            is to ensure listing quality, buyer confidence, and smooth
            auction execution.
          </p>

          {/* SECTION 1 */}
          <div className="mt-14">
            <h2 className="text-lg font-semibold text-gray-900">
              1. Seller Eligibility
            </h2>

            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              <li>✔ Confirm ownership or authority to sell</li>
              <li>✔ Identify selling entity (individual, LLC, trust)</li>
              <li>✔ Primary point of contact established</li>
              <li>✔ Valid email address on file</li>
            </ul>
          </div>

          {/* SECTION 2 */}
          <div className="mt-12">
            <h2 className="text-lg font-semibold text-gray-900">
              2. Property Qualification
            </h2>

            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              <li>✔ Property address and asset type confirmed</li>
              <li>✔ Clear or resolvable title status</li>
              <li>✔ No undisclosed liens or encumbrances</li>
              <li>✔ Property suitable for auction format</li>
            </ul>
          </div>

          {/* SECTION 3 */}
          <div className="mt-12">
            <h2 className="text-lg font-semibold text-gray-900">
              3. Listing Preparation
            </h2>

            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              <li>✔ Property description finalized</li>
              <li>✔ Reserve pricing strategy discussed</li>
              <li>✔ Auction duration confirmed</li>
              <li>✔ Disclosure expectations reviewed</li>
            </ul>
          </div>

          {/* SECTION 4 */}
          <div className="mt-12">
            <h2 className="text-lg font-semibold text-gray-900">
              4. Seller Acknowledgements
            </h2>

            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              <li>✔ Seller controls acceptance of bids</li>
              <li>✔ No obligation to accept any offer</li>
              <li>✔ Funds flow through licensed escrow</li>
              <li>✔ MrBids does not act as broker or agent</li>
            </ul>
          </div>

          {/* SECTION 5 */}
          <div className="mt-12">
            <h2 className="text-lg font-semibold text-gray-900">
              5. Auction Launch Readiness
            </h2>

            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              <li>✔ Listing approved by MrBids</li>
              <li>✔ Auction schedule confirmed</li>
              <li>✔ Buyer visibility enabled</li>
              <li>✔ Seller contact available during auction</li>
            </ul>
          </div>

          {/* FOOTNOTE */}
          <div className="mt-16 border-t border-gray-200 pt-6">
            <p className="text-xs text-gray-500 leading-relaxed">
              This checklist is part of the MrBids private seller pilot
              and may evolve as the platform matures. Participation in
              the pilot does not guarantee listing approval or auction
              outcomes.
            </p>

            <p className="mt-4 text-xs text-gray-500">
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
      </div>
    </main>
  );
}
