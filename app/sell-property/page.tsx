"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function SellLandingPage() {
  const { data: session } = useSession();

  function handleStart() {
    if (!session) {
      window.location.href = "/signin?callbackUrl=/sell";
    } else {
      window.location.href = "/sell";
    }
  }

  return (
    <main className="bg-white">

      {/* HERO */}
      <section className="bg-black text-white">
        <div className="max-w-6xl mx-auto px-6 py-24 text-center">

          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Turn Your Off-Market Deal Into a Competitive Auction
          </h1>

          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-6">
            List your property on MrBids and let verified investors compete
            for it in a transparent real estate auction.
          </p>

          <p className="text-sm text-green-400 font-medium mb-10">
            No listing fees. Sellers control the reserve price.
          </p>

          <button
            onClick={handleStart}
            className="inline-block bg-green-500 hover:bg-green-600 text-black font-semibold px-8 py-4 rounded-lg text-lg"
          >
            Start Your Auction
          </button>

        </div>
      </section>

      {/* PAIN POINTS */}
      <section className="bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">

          <h2 className="text-3xl font-semibold mb-10">
            Stop Chasing Buyers
          </h2>

          <p className="max-w-2xl mx-auto text-gray-600 text-lg mb-10">
            Wholesalers waste hours blasting deals to buyer lists,
            negotiating individually, and dealing with flaky investors.
            MrBids creates real competition where serious buyers bid publicly.
          </p>

          <div className="grid md:grid-cols-3 gap-8">

            <div className="bg-white p-6 rounded-xl border">
              <h3 className="font-semibold mb-2">
                No More Ghosting
              </h3>
              <p className="text-sm text-gray-600">
                Investors bid publicly so you immediately know who is serious.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border">
              <h3 className="font-semibold mb-2">
                Real Competition
              </h3>
              <p className="text-sm text-gray-600">
                Multiple buyers compete for your deal in real time.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border">
              <h3 className="font-semibold mb-2">
                Stronger Offers
              </h3>
              <p className="text-sm text-gray-600">
                Auctions reveal the real market price of your property.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* WHO THIS IS FOR */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">

          <h2 className="text-3xl font-semibold mb-10">
            Built for Real Estate Deal Finders
          </h2>

          <div className="grid md:grid-cols-3 gap-8 text-sm text-gray-600">

            <div className="border rounded-xl p-6">
              Wholesalers looking for serious investor buyers
            </div>

            <div className="border rounded-xl p-6">
              Investors selling off-market properties
            </div>

            <div className="border rounded-xl p-6">
              Agents with distressed or unique opportunities
            </div>

          </div>

        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">

          <h2 className="text-3xl font-semibold mb-14">
            How MrBids Works
          </h2>

          <div className="grid md:grid-cols-3 gap-12">

            <div>
              <div className="text-4xl font-bold mb-4">1</div>
              <h3 className="font-semibold mb-2">
                List Your Deal
              </h3>
              <p className="text-gray-600 text-sm">
                Upload photos, property details, and set your starting bid.
              </p>
            </div>

            <div>
              <div className="text-4xl font-bold mb-4">2</div>
              <h3 className="font-semibold mb-2">
                Investors Compete
              </h3>
              <p className="text-gray-600 text-sm">
                Verified buyers place bids in real time during the auction.
              </p>
            </div>

            <div>
              <div className="text-4xl font-bold mb-4">3</div>
              <h3 className="font-semibold mb-2">
                Accept the Winner
              </h3>
              <p className="text-gray-600 text-sm">
                The highest bidder wins when the auction ends.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-black text-white">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">

          <h2 className="text-3xl font-semibold mb-6">
            Your Deal Deserves Competition
          </h2>

          <p className="text-gray-300 mb-10">
            Start your auction today and let investors compete for your property.
          </p>

          <button
            onClick={handleStart}
            className="inline-block bg-green-500 hover:bg-green-600 text-black font-semibold px-8 py-4 rounded-lg text-lg"
          >
            List Your Property
          </button>

        </div>
      </section>

    </main>
  );
}