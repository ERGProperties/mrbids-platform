import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live Auction — 2210 McKenzie Ave, Waco TX | MrBids",
  description:
    "Seller-direct real estate auction featuring a residential property in Waco, Texas.",
};

export default function LiveAuction2210McKenzie() {
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
            2210 McKenzie Ave, Waco, TX
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Residential Property • Waco, Texas
          </p>
        </div>

        {/* AUCTION STATUS */}
        <div className="mb-12 bg-white border border-gray-200 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-900">
              Auction Status
            </p>
            <p className="mt-2 text-sm text-gray-600">
              Live
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-900">
              Auction Ends
            </p>
            <p className="mt-2 text-sm text-gray-600">
              To Be Announced
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-900">
              Reserve Price
            </p>
            <p className="mt-2 text-sm text-gray-600">
              Not Publicly Disclosed
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
              2210 McKenzie Ave is a residential property located in Waco,
              Texas. The property is being offered through a private,
              seller-direct auction as part of the MrBids pilot program.
            </p>

            <p>
              The home features a traditional layout with multiple living
              spaces and bedrooms. The property may appeal to owner-
              occupants or investors depending on individual objectives
              and due diligence.
            </p>

            <p>
              The seller retains full discretion over bid acceptance and
              is under no obligation to accept any offer submitted during
              the auction.
            </p>
          </div>
        </div>

        {/* DETAILS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white border border-gray-200 rounded-2xl p-8">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">
              Property Details
            </h3>

            <ul className="mt-6 space-y-3 text-sm text-gray-600">
              <li>• Property Type: Residential</li>
              <li>• City: Waco</li>
              <li>• State: Texas</li>
              <li>• Occupancy: To Be Verified</li>
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-8">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">
              Auction Terms
            </h3>

            <ul className="mt-6 space-y-3 text-sm text-gray-600">
              <li>• Seller retains bid acceptance control</li>
              <li>• No obligation to accept any offer</li>
              <li>• Buyer approval required</li>
              <li>• Funds flow through licensed escrow</li>
            </ul>
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
          This listing is part of the MrBids private seller pilot and does
          not constitute an offer, solicitation, or guarantee of sale.
        </p>
      </div>
    </main>
  );
}
