import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Listing Statuses | MrBids",
  description:
    "Understand how property listings move through review, approval, and auction on the MrBids platform.",
};

export default function ListingStatusesPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-32">
      <h1 className="text-3xl font-semibold text-gray-900">
        Listing Statuses
      </h1>

      <p className="mt-8 text-sm text-gray-600 leading-relaxed">
        Property listings on MrBids move through clearly defined stages
        designed to protect sellers, buyers, and transaction integrity.
      </p>

      <div className="mt-16 space-y-12">
        {/* DRAFT */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Draft
          </h2>
          <p className="mt-4 text-sm text-gray-600 leading-relaxed">
            A draft listing has been created by the seller but has not
            yet been submitted for review. Sellers may edit property
            details, reserve preferences, and notes during this stage.
          </p>
        </div>

        {/* UNDER REVIEW */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Under Review
          </h2>
          <p className="mt-4 text-sm text-gray-600 leading-relaxed">
            Once submitted, listings enter a review process to confirm
            completeness, eligibility, and alignment with platform
            standards. This review helps ensure buyer confidence and
            auction integrity.
          </p>
        </div>

        {/* APPROVED */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Approved
          </h2>
          <p className="mt-4 text-sm text-gray-600 leading-relaxed">
            Approved listings are scheduled for auction and become
            visible to verified buyers. Auction timing, reserve pricing,
            and terms are locked prior to launch.
          </p>
        </div>

        {/* LIVE */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Live Auction
          </h2>
          <p className="mt-4 text-sm text-gray-600 leading-relaxed">
            During a live auction, verified buyers may place bids in real
            time. Bidding activity is transparent and monitored to ensure
            fairness and compliance.
          </p>
        </div>

        {/* COMPLETED */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Completed
          </h2>
          <p className="mt-4 text-sm text-gray-600 leading-relaxed">
            After an auction concludes, sellers may accept, counter, or
            decline bids according to the auction terms. Accepted bids
            proceed toward escrow-based closing.
          </p>
        </div>
      </div>

      <p className="mt-20 text-sm text-gray-600">
        Questions about listing status or review timing? Contact{" "}
        <a
          href="mailto:support@mrbids.com"
          className="text-gray-900 underline"
        >
          support@mrbids.com
        </a>.
      </p>
    </main>
  );
}
