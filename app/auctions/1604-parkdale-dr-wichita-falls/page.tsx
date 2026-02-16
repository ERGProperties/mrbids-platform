import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Countdown from "./Countdown";
import { AuctionImageGallery } from "../../../components/AuctionImageGallery";

export const metadata: Metadata = {
  title: "Live Auction — 1604 Parkdale Dr, Wichita Falls TX | MrBids",
  description:
    "Seller-direct real estate auction featuring a single-family residential property in Wichita Falls, Texas.",
};

// 🔒 LOCKED AUCTION END (Central Time)
const AUCTION_END = new Date("2026-02-21T17:00:00-06:00");

const images = [
  "/auctions/1604-parkdale-dr-wichita-falls/01-house-front.jpeg",
  "/auctions/1604-parkdale-dr-wichita-falls/02-dining-room.jpeg",
  "/auctions/1604-parkdale-dr-wichita-falls/03-foyer.jpeg",
  "/auctions/1604-parkdale-dr-wichita-falls/04-family-room.jpeg",
  "/auctions/1604-parkdale-dr-wichita-falls/05-kitchen.jpeg",
  "/auctions/1604-parkdale-dr-wichita-falls/06-hallway.jpeg",
  "/auctions/1604-parkdale-dr-wichita-falls/07-bedroom-1.jpeg",
  "/auctions/1604-parkdale-dr-wichita-falls/08-bedroom-2.jpeg",
  "/auctions/1604-parkdale-dr-wichita-falls/09-bedroom-3.jpeg",
  "/auctions/1604-parkdale-dr-wichita-falls/10-bedroom-4.jpeg",
  "/auctions/1604-parkdale-dr-wichita-falls/11-bathroom-1.jpeg",
  "/auctions/1604-parkdale-dr-wichita-falls/12-bathroom-2.jpeg",
  "/auctions/1604-parkdale-dr-wichita-falls/13-laundry-room.jpeg",
  "/auctions/1604-parkdale-dr-wichita-falls/14-back-patio.jpeg",
  "/auctions/1604-parkdale-dr-wichita-falls/15-house-back.jpeg",
];

export default function LiveAuction1604Parkdale() {
  // ⛔ SERVER-SIDE AUCTION CLOSE CHECK
  if (Date.now() >= AUCTION_END.getTime()) {
    redirect("/auctions/1604-parkdale-dr-wichita-falls/result");
  }

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-32">
        {/* HEADER */}
        <div className="mb-12">
          <p className="text-xs uppercase tracking-widest text-gray-400">
            Live Auction
          </p>
          <h1 className="mt-4 text-4xl font-semibold text-gray-900">
            1604 Parkdale Dr, Wichita Falls, TX
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Single-Family Residence • Value-Add Opportunity
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
              Feb 21, 2026 • 5:00 PM CT
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-900">
              Time Remaining
            </p>
            <Countdown />
          </div>

          <div>
            <p className="text-sm font-medium text-gray-900">Starting Bid</p>
            <p className="mt-2 text-sm text-gray-600">$50,000</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-900">Bid Increment</p>
            <p className="mt-2 text-sm text-gray-600">$2,500</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-900">
              Seller ARV (Post-Rehab)
            </p>
            <p className="mt-2 text-sm text-gray-600">
              $195,000 (Seller Estimate)
            </p>
          </div>
        </div>

        {/* PHOTO GALLERY */}
        <div className="mb-16">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Property Photos
          </h2>
          <AuctionImageGallery images={images} />
        </div>

        {/* PROPERTY DESCRIPTION */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-12">
          <h2 className="text-lg font-semibold text-gray-900">
            Property Description
          </h2>

          <div className="mt-6 space-y-4 text-sm text-gray-600 leading-relaxed">
            <p>
              1604 Parkdale Dr is a single-family residential property
              located in Wichita Falls, Texas. The property is being
              offered through a seller-direct auction on MrBids.
            </p>

            <p>
              The property presents a value-add opportunity for buyers.
              Interior finishes and mechanical systems should be
              evaluated as part of buyer due diligence.
            </p>

            <p>
              The seller has provided an estimated after-repair value
              (ARV) of $195,000. This estimate is for reference only and
              is not a guarantee of value.
            </p>

            <p>
              The seller retains full discretion over bid acceptance.
              The property is being sold as-is.
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
              <li>• Bedrooms: 4</li>
              <li>• Bathrooms: 2</li>
              <li>• Occupancy: Vacant</li>
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-8">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">
              Auction Terms
            </h3>

            <ul className="mt-6 space-y-3 text-sm text-gray-600">
              <li>• Property sold as-is</li>
              <li>• Minimum bid increments of $2,500</li>
              <li>• Seller retains bid acceptance control</li>
              <li>• No obligation to accept any offer</li>
              <li>• Buyer approval required</li>
            </ul>
          </div>
        </div>

        {/* 👉 REQUEST ACCESS CTA (MOVED HERE — AFTER DETAILS) */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-12 text-center">
          <h3 className="text-lg font-semibold text-gray-900">
            Want to Place a Bid?
          </h3>

          <p className="mt-4 text-sm text-gray-600 max-w-xl mx-auto">
            Participation in this auction is limited to approved buyers.
            You must request and receive access before submitting any bids.
          </p>

          <div className="mt-8">
            <a
              href="/join"
              className="inline-block px-10 py-3 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-900 transition"
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
