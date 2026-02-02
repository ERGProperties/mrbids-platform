import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buyer FAQ | MrBids",
  description:
    "Frequently asked questions for buyers participating in seller-direct real estate auctions on MrBids.",
};

export default function BuyerFAQPage() {
  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-32">
        <div className="bg-white border border-gray-200 rounded-2xl p-10">
          <h1 className="text-3xl font-semibold text-gray-900">
            Buyer Frequently Asked Questions
          </h1>

          <p className="mt-6 text-lg text-gray-600 leading-relaxed">
            These questions explain how buying through MrBids works,
            what access is required, and what buyers should expect
            before, during, and after an auction.
          </p>

          {/* FAQ LIST */}
          <div className="mt-16 space-y-12">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Who can participate in auctions on MrBids?
              </h2>
              <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                MrBids is a private marketplace. Access to auctions may
                be limited to approved or verified buyers depending on
                the listing and market conditions.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Do I need to create an account to bid?
              </h2>
              <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                Yes. Buyers must have an approved account to place bids
                on properties. Account access is required to ensure
                auction integrity and seller confidence.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                How are buyers verified?
              </h2>
              <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                Buyer verification may include identity confirmation,
                proof of funds, or other qualification steps. The level
                of verification may vary by auction.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Can I see the reserve price?
              </h2>
              <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                Reserve pricing is set by the seller and may not be
                publicly disclosed. Sellers control whether reserve
                details are shared.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Are bids binding?
              </h2>
              <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                Bidding rules and obligations are defined in each
                auction’s terms. Buyers should review auction terms
                carefully before placing a bid.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                What happens if I win an auction?
              </h2>
              <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                If your bid is accepted, the transaction proceeds toward
                closing through a licensed third-party escrow provider.
                Additional documentation and timelines may apply.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Does MrBids handle escrow or closing?
              </h2>
              <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                No. MrBids is a technology platform and does not act as
                escrow, broker, or settlement agent. Funds are handled
                by licensed third-party providers.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Can I withdraw or change a bid?
              </h2>
              <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                Bid modification or withdrawal rules are defined by each
                auction’s terms. Buyers should review terms carefully
                prior to bidding.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Is due diligence my responsibility?
              </h2>
              <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                Yes. Buyers are responsible for conducting their own due
                diligence prior to bidding. Property information is
                provided by the seller and subject to verification.
              </p>
            </div>
          </div>

          {/* FOOTNOTE */}
          <div className="mt-20 border-t border-gray-200 pt-6">
            <p className="text-xs text-gray-500">
              Additional questions? Contact{" "}
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
