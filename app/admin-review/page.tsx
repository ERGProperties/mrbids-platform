import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Review Criteria | MrBids",
  description:
    "Internal listing review and approval criteria for the MrBids auction platform.",
};

export default function AdminReviewPage() {
  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-32">
        <div className="bg-white border border-gray-200 rounded-2xl p-10">
          <h1 className="text-3xl font-semibold text-gray-900">
            Admin Review Criteria
          </h1>

          <p className="mt-6 text-lg text-gray-600 leading-relaxed">
            This document outlines the internal standards used to review,
            approve, or decline property listings submitted to MrBids.
            The objective is to maintain listing quality, buyer trust,
            and auction integrity.
          </p>

          {/* SECTION 1 */}
          <div className="mt-14">
            <h2 className="text-lg font-semibold text-gray-900">
              1. Seller Verification
            </h2>

            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              <li>✔ Seller identity confirmed</li>
              <li>✔ Authority to sell verified (owner, authorized agent, entity)</li>
              <li>✔ Valid contact information on file</li>
              <li>✔ No known history of misrepresentation</li>
            </ul>
          </div>

          {/* SECTION 2 */}
          <div className="mt-12">
            <h2 className="text-lg font-semibold text-gray-900">
              2. Property Eligibility
            </h2>

            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              <li>✔ Property address verified</li>
              <li>✔ Asset type aligns with marketplace demand</li>
              <li>✔ Property condition suitable for auction</li>
              <li>✔ No unresolved legal or regulatory issues disclosed</li>
            </ul>
          </div>

          {/* SECTION 3 */}
          <div className="mt-12">
            <h2 className="text-lg font-semibold text-gray-900">
              3. Title & Encumbrances
            </h2>

            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              <li>✔ Clear or resolvable title expected</li>
              <li>✔ Known liens or encumbrances disclosed</li>
              <li>✔ No undisclosed foreclosure or litigation risk</li>
            </ul>
          </div>

          {/* SECTION 4 */}
          <div className="mt-12">
            <h2 className="text-lg font-semibold text-gray-900">
              4. Auction Readiness
            </h2>

            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              <li>✔ Reserve pricing discussed and understood</li>
              <li>✔ Auction duration defined</li>
              <li>✔ Seller expectations aligned with auction format</li>
              <li>✔ Listing information complete and coherent</li>
            </ul>
          </div>

          {/* SECTION 5 */}
          <div className="mt-12">
            <h2 className="text-lg font-semibold text-gray-900">
              5. Risk Flags (Automatic Escalation)
            </h2>

            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              <li>⚠ Inconsistent ownership claims</li>
              <li>⚠ Unrealistic reserve pricing</li>
              <li>⚠ Incomplete disclosures</li>
              <li>⚠ Seller unwilling to engage during auction</li>
            </ul>

            <p className="mt-4 text-xs text-gray-500">
              Listings with one or more risk flags require additional
              review or may be declined.
            </p>
          </div>

          {/* DECISION */}
          <div className="mt-16 border-t border-gray-200 pt-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Approval Outcomes
            </h2>

            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              <li>✔ Approved — Listing may proceed to auction setup</li>
              <li>✔ Conditional — Additional information required</li>
              <li>✖ Declined — Listing does not meet platform standards</li>
            </ul>
          </div>

          {/* FOOTNOTE */}
          <div className="mt-12">
            <p className="text-xs text-gray-500 leading-relaxed">
              This internal review criteria is subject to change as the
              MrBids platform evolves. Approval decisions are made at the
              sole discretion of MrBids to protect marketplace integrity.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
