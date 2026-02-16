import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Case Study: Seller-Direct Auction for 2210 McKenzie Ave, Waco TX | MrBids",
  description:
    "A factual case study documenting the outcome of a seller-direct real estate auction on MrBids.",
};

export default function CaseStudy2210McKenzie() {
  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-32">
        {/* HEADER */}
        <div className="mb-12">
          <p className="text-xs uppercase tracking-widest text-gray-400">
            Case Study
          </p>
          <h1 className="mt-4 text-4xl font-semibold text-gray-900">
            Seller-Direct Auction — 2210 McKenzie Ave, Waco TX
          </h1>
          <p className="mt-6 text-lg text-gray-600 leading-relaxed">
            This case study documents the outcome of a seller-direct
            auction conducted on the MrBids platform for a full-rehab
            residential property in Waco, Texas.
          </p>
        </div>

        {/* PROPERTY SUMMARY */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-12">
          <h2 className="text-lg font-semibold text-gray-900">
            Property Overview
          </h2>

          <ul className="mt-6 space-y-3 text-sm text-gray-600">
            <li>• Address: 2210 McKenzie Ave, Waco, TX 76708</li>
            <li>• Property Type: Single-Family Residence</li>
            <li>• Condition: Full rehabilitation required</li>
            <li>• Square Footage: 1,606 SF</li>
            <li>• Lot Size: 0.19 Acres</li>
            <li>• Year Built: 1926</li>
          </ul>
        </div>

        {/* AUCTION STRUCTURE */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-12">
          <h2 className="text-lg font-semibold text-gray-900">
            Auction Structure
          </h2>

          <ul className="mt-6 space-y-3 text-sm text-gray-600">
            <li>• Auction Type: Seller-direct, admin-reviewed</li>
            <li>• Starting Bid: $100,000</li>
            <li>• Bid Increment: $5,000</li>
            <li>• Reserve Price: Set (not publicly disclosed)</li>
            <li>• Auction Duration: 7 days</li>
            <li>• Buyer Access: Approval required</li>
          </ul>
        </div>

        {/* OUTCOME */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-12">
          <h2 className="text-lg font-semibold text-gray-900">
            Outcome
          </h2>

          <div className="mt-6 space-y-4 text-sm text-gray-600 leading-relaxed">
            <p>
              The auction concluded without any accepted bids during the
              auction period. The seller elected not to accept any offers
              as part of the auction process.
            </p>

            <p>
              While no transaction occurred, the auction executed as
              designed and provided clear feedback regarding buyer
              engagement, pricing sensitivity, and market response.
            </p>
          </div>
        </div>

        {/* KEY TAKEAWAYS */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-12">
          <h2 className="text-lg font-semibold text-gray-900">
            Key Takeaways
          </h2>

          <ul className="mt-6 space-y-4 text-sm text-gray-600">
            <li>
              • The seller retained full control throughout the auction
              and was not obligated to accept any offer.
            </li>
            <li>
              • Buyer interest was present, but price expectations did
              not align during the auction window.
            </li>
            <li>
              • The auction provided faster and clearer pricing feedback
              than traditional off-market outreach.
            </li>
            <li>
              • Auction mechanics executed cleanly without operational
              issues.
            </li>
          </ul>
        </div>

        {/* WHY THIS MATTERS */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-12">
          <h2 className="text-lg font-semibold text-gray-900">
            Why This Matters
          </h2>

          <div className="mt-6 space-y-4 text-sm text-gray-600 leading-relaxed">
            <p>
              Seller-direct auctions are designed to provide price
              discovery and buyer feedback, not guaranteed outcomes.
            </p>

            <p>
              This case demonstrates that auctions can be executed
              transparently, professionally, and without pressure on
              the seller to transact.
            </p>
          </div>
        </div>

        {/* NEXT */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
          <h2 className="text-lg font-semibold text-gray-900">
            What’s Next
          </h2>

          <p className="mt-4 text-sm text-gray-600">
            MrBids is preparing additional auctions with refinements
            informed by this initial execution.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <a
              href="/auctions"
              className="px-8 py-3 border border-gray-300 rounded-full text-sm font-medium hover:border-gray-400 transition"
            >
              View Auctions
            </a>

            <a
              href="/sell"
              className="px-8 py-3 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-900 transition"
            >
              Submit a Property
            </a>
          </div>
        </div>

        {/* FOOTNOTE */}
        <p className="mt-12 text-xs text-gray-400 leading-relaxed text-center">
          Case studies are provided for informational purposes only and
          do not constitute an offer or guarantee of results.
        </p>
      </div>
    </main>
  );
}
