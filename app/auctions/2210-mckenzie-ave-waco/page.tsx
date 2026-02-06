import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Countdown from "./Countdown";

export const metadata: Metadata = {
  title: "Live Auction — 2210 McKenzie Ave, Waco TX | MrBids",
  description:
    "Seller-direct real estate auction featuring a full-rehab residential property in Waco, Texas.",
};

// 🔒 LOCKED AUCTION END (Central Time)
const AUCTION_END = new Date("2026-02-15T17:00:00-06:00");

export default function LiveAuction2210McKenzie() {
  // ⛔ SERVER-SIDE AUCTION CLOSE CHECK
  if (Date.now() >= AUCTION_END.getTime()) {
    redirect("/auctions/2210-mckenzie-ave-waco/result");
  }

  const photos = [
    "01-curbside.jpg",
    "02-front.jpg",
    "03-family-room.jpg",
    "04-dining-room.jpg",
    "05-kitchen.jpg",
    "06-kitchen-2.jpg",
    "07-bathroom.jpg",
    "08-master-bedroom.jpg",
    "09-bedroom-2.jpg",
    "10-bedroom-office.jpg",
    "11-half-bath.jpg",
    "12-left-side.jpg",
    "13-right-side.jpg",
    "14-back-room.jpg",
    "15-rear.jpg",
  ];

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-32">
        {/* HEADER */}
        <div className="mb-12">
          <p className="text-xs uppercase tracking-widest text-gray-400">
            Live Auction
          </p>
          <h1 className="mt-4 text-4xl font-semibold text-gray-900">
            2210 McKenzie Ave, Waco, TX 76708
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Single-Family Residence • Full Rehab Opportunity
          </p>
        </div>

        {/* AUCTION STATUS */}
        <div className="mb-12 bg-white border border-gray-200 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-6 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-900">Auction Status</p>
            <p className="mt-2 text-sm text-gray-600">Live</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-900">Auction Ends</p>
            <p className="mt-2 text-sm text-gray-600">
              Feb 15, 2026 • 5:00 PM CT
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-900">Time Remaining</p>
            <Countdown />
          </div>

          <div>
            <p className="text-sm font-medium text-gray-900">Starting Bid</p>
            <p className="mt-2 text-sm text-gray-600">$100,000</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-900">Bid Increment</p>
            <p className="mt-2 text-sm text-gray-600">$5,000</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-900">
              Seller ARV (Post-Rehab)
            </p>
            <p className="mt-2 text-sm text-gray-600">
              $230,000 (Seller Estimate)
            </p>
          </div>
        </div>

        {/* PHOTO GALLERY */}
        <div className="mb-16">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Property Photos
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {photos.map((file) => (
              <div
                key={file}
                className="aspect-[4/3] overflow-hidden rounded-xl border border-gray-200 bg-white"
              >
                <img
                  src={`/auctions/2210-mckenzie-ave-waco/${file}`}
                  alt="Property photo"
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* PROPERTY DESCRIPTION */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-12">
          <h2 className="text-lg font-semibold text-gray-900">
            Property Description
          </h2>

          <div className="mt-6 space-y-4 text-sm text-gray-600 leading-relaxed">
            <p>
              2210 McKenzie Ave is a single-family residential property
              located in Waco, Texas. The property is being offered
              through a seller-direct auction as part of the MrBids
              private seller pilot.
            </p>

            <p>
              The property requires a full rehabilitation. Interior
              finishes, mechanical systems, and exterior components
              should be evaluated by buyers as part of their due
              diligence. This opportunity is best suited for experienced
              investors or renovation-focused buyers.
            </p>

            <p>
              The seller has provided an estimated after-repair value
              (ARV) of $230,000. This estimate is for reference only and
              is not a guarantee of value.
            </p>

            <p>
              The seller retains full discretion over bid acceptance.
              A reserve price has been set but is not publicly disclosed.
            </p>
          </div>
        </div>

        {/* PROPERTY FACTS + AUCTION TERMS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white border border-gray-200 rounded-2xl p-8">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">
              Property Facts
            </h3>

            <ul className="mt-6 space-y-3 text-sm text-gray-600">
              <li>• Property Type: Single-Family</li>
              <li>• Bedrooms: 3</li>
              <li>• Bathrooms: 2</li>
              <li>• Square Footage: 1,606 SF</li>
              <li>• Lot Size: 0.19 Acres</li>
              <li>• Year Built: 1926</li>
              <li>• Occupancy: Vacant</li>
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-8">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">
              Auction Terms
            </h3>

            <ul className="mt-6 space-y-3 text-sm text-gray-600">
              <li>• Property sold as-is</li>
              <li>• Minimum bid increments of $5,000</li>
              <li>• Seller retains bid acceptance control</li>
              <li>• No obligation to accept any offer</li>
              <li>• Buyer approval required</li>
              <li>• Funds flow through licensed escrow</li>
            </ul>
          </div>
        </div>

        {/* CREDIBILITY SIGNALS */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-sm text-gray-600">
            <div>
              <p className="font-medium text-gray-900">Verified Buyers</p>
              <p className="mt-1">
                Buyer access is reviewed prior to participation.
              </p>
            </div>

            <div>
              <p className="font-medium text-gray-900">Seller Control</p>
              <p className="mt-1">
                Seller retains full discretion over bid acceptance.
              </p>
            </div>

            <div>
              <p className="font-medium text-gray-900">Licensed Escrow</p>
              <p className="mt-1">
                Funds are structured to flow through licensed escrow.
              </p>
            </div>

            <div>
              <p className="font-medium text-gray-900">Audit Trail</p>
              <p className="mt-1">
                Auction activity is logged and preserved.
              </p>
            </div>
          </div>
        </div>

        {/* HOW BIDDING WORKS */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-12">
          <h3 className="text-lg font-semibold text-gray-900 text-center">
            How Bidding Works
          </h3>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-gray-600">
            <div className="text-center">
              <div className="mx-auto mb-4 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-900">
                1
              </div>
              <p className="font-medium text-gray-900">Request Buyer Access</p>
              <p className="mt-2">
                Buyers must request and receive approval prior to
                participating in any auction.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-900">
                2
              </div>
              <p className="font-medium text-gray-900">Submit a Bid</p>
              <p className="mt-2">
                Approved buyers submit bids in stated increments before
                the auction close time.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-900">
                3
              </div>
              <p className="font-medium text-gray-900">
                Seller Reviews & Accepts
              </p>
              <p className="mt-2">
                The seller reviews auction activity and retains full
                discretion over bid acceptance.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
          <h2 className="text-lg font-semibold text-gray-900">
            Interested in Participating?
          </h2>

          <p className="mt-4 text-sm text-gray-600">
            Access to this auction is limited to approved buyers.
          </p>

          <div className="mt-8">
            <a
              href="/join"
              className="inline-block px-8 py-3 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-900 transition"
            >
              Request Buyer Access
            </a>
          </div>
        </div>

        {/* FOOTNOTE */}
        <p className="mt-12 text-xs text-gray-400 leading-relaxed">
          Auction closes automatically at the stated date and time.
          Late bids will not be accepted. All information is provided
          for general reference only and is subject to buyer due diligence.
        </p>
      </div>
    </main>
  );
}

