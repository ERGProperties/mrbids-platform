import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Seller FAQ | MrBids",
  description:
    "Frequently asked questions for sellers using the MrBids seller-direct real estate auction platform.",
};

export default function SellerFAQPage() {
  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-32">
        <div className="bg-white border border-gray-200 rounded-2xl p-10">
          <h1 className="text-3xl font-semibold text-gray-900">
            Seller Frequently Asked Questions
          </h1>

          <p className="mt-6 text-lg text-gray-600 leading-relaxed">
            These questions address how selling on MrBids works, what
            control sellers retain, and what to expect during the auction
            process.
          </p>

          {/* FAQ LIST */}
          <div className="mt-16 space-y-12">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Is MrBids a real estate broker?
              </h2>
              <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                No. MrBids is a technology platform that facilitates
                seller-direct auctions. MrBids does not act as a real
                estate broker, agent, or escrow holder.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Do I have to accept the highest bid?
              </h2>
              <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                No. Sellers retain full control over bid acceptance. You
                may accept, counter, or decline any bid in accordance
                with the auction terms.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                How is reserve pricing handled?
              </h2>
              <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                Sellers define reserve pricing prior to auction launch.
                Reserve pricing is not visible to buyers unless disclosed
                by the seller.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Are buyers verified?
              </h2>
              <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                Yes. Buyers are reviewed prior to participation. Access
                may be limited to verified or approved buyers during the
                private marketplace phase.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                How long do auctions run?
              </h2>
              <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                Auction duration is set prior to launch and typically
                runs for a defined period (e.g., 7 days). Timing is agreed
                upon before listing approval.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                What happens after the auction ends?
              </h2>
              <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                After the auction concludes, sellers review bids and
                decide whether to accept, counter, or decline offers.
                Accepted bids proceed toward escrow-based closing.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                How are funds handled?
              </h2>
              <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                Funds flow through licensed third-party escrow providers.
                MrBids does not hold or transmit funds.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Is my listing guaranteed to be accepted?
              </h2>
              <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                No. Listings are reviewed prior to approval to ensure
                quality, eligibility, and alignment with platform
                standards.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                What types of properties are eligible?
              </h2>
              <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                Eligible properties vary based on market conditions and
                buyer demand. Residential, multi-family, commercial, and
                land assets may be considered.
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
