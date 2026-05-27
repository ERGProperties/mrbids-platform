import type { Metadata } from "next";

import { redirect } from "next/navigation";

import Link from "next/link";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";

import { prisma } from "@/lib/prisma";

import GoogleRegistrationConversion from "@/components/GoogleRegistrationConversion";

import FulfillmentControls from "@/components/dashboard/FulfillmentControls";

import StripeConnectStatus from "@/components/dashboard/StripeConnectStatus";

export const metadata: Metadata = {
  title: "Dashboard | MrBids",
  description:
    "Manage your marketplace auctions, purchases, and activity on MrBids.",
};

export default async function DashboardPage() {

  const session =
    await getServerSession(
      authOptions
    );

  if (!session?.user?.id) {
    redirect("/signin");
  }

  const userId =
    session.user.id;

  const purchases =
    await prisma.marketplaceAuction.findMany({
      where: {
        winnerId:
          userId,
      },

      orderBy: {
        updatedAt:
          "desc",
      },

      take: 10,
    });

  const sellerAuctions =
    await prisma.marketplaceAuction.findMany({
      where: {
        sellerId:
          userId,
      },

      include: {
        winner: true,
      },

      orderBy: {
        updatedAt:
          "desc",
      },

      take: 20,
    });

  const watchlist =
    await prisma.watchlist.findMany({
      where: {
        userId,
      },

      include: {
        auction: true,
      },

      orderBy: {
        createdAt:
          "desc",
      },

      take: 20,
    });

  const totalPurchases =
    purchases.length;

  const totalSales =
    sellerAuctions.filter(
      (auction) =>
        auction.status ===
        "ENDED"
    ).length;

  const totalRevenue =
    sellerAuctions
      .filter(
        (auction) =>
          auction.paymentStatus ===
          "PAID"
      )
      .reduce(
        (sum, auction) =>
          sum +
          (auction.currentBid ||
            0),
        0
      );

  const unpaidSales =
    sellerAuctions.filter(
      (auction) =>
        auction.status ===
          "ENDED" &&
        auction.paymentStatus !==
          "PAID"
    ).length;

return (
  <>
    <GoogleRegistrationConversion />

    <main className="bg-gray-50 min-h-screen">

      <div className="max-w-7xl mx-auto px-6 py-24">

        {/* HEADER */}
        <div className="mb-12">

          <h1 className="text-4xl md:text-5xl font-semibold text-gray-900">
            Marketplace Dashboard
          </h1>

          <p className="mt-4 text-lg text-gray-600">
            Manage your purchases, auctions, payments, shipping, fulfillment, and seller payouts.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">

            <Link
              href="/sell"
              className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-black text-white text-lg font-semibold hover:opacity-90 transition"
            >
              Create Marketplace Auction
            </Link>

          </div>

        </div>

        {/* STRIPE CONNECT STATUS */}
        <div className="mb-10 bg-white border border-gray-200 rounded-2xl p-8">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

            <div>

              <h2 className="text-2xl font-semibold text-gray-900">
                Seller Payouts
              </h2>

              <p className="mt-2 text-gray-600">
                Connect Stripe to receive automatic marketplace payouts.
              </p>

            </div>

            <div>

              <StripeConnectStatus />

            </div>

          </div>

        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">

          <div className="bg-white border border-gray-200 rounded-2xl p-6">

            <p className="text-sm text-gray-500 mb-2">
              Purchases
            </p>

            <p className="text-4xl font-semibold text-gray-900">
              {totalPurchases}
            </p>

          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6">

            <p className="text-sm text-gray-500 mb-2">
              Auctions Sold
            </p>

            <p className="text-4xl font-semibold text-gray-900">
              {totalSales}
            </p>

          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6">

            <p className="text-sm text-gray-500 mb-2">
              Revenue
            </p>

            <p className="text-4xl font-semibold text-gray-900">
              $
              {totalRevenue.toLocaleString()}
            </p>

          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6">

            <p className="text-sm text-gray-500 mb-2">
              Awaiting Payment
            </p>

            <p className="text-4xl font-semibold text-yellow-600">
              {unpaidSales}
            </p>

          </div>

        </div>

        {/* WATCHLIST */}
        <div className="mb-12 bg-white border border-gray-200 rounded-2xl p-8">

          <div className="flex items-center justify-between mb-8">

            <div>

              <h2 className="text-2xl font-semibold text-gray-900">
                Saved Auctions
              </h2>

              <p className="mt-2 text-gray-600">
                Auctions you're watching and tracking.
              </p>

            </div>

          </div>

          {watchlist.length === 0 ? (

            <div className="border border-dashed border-gray-300 rounded-2xl p-10 text-center">

              <p className="text-gray-500">
                No saved auctions yet.
              </p>

            </div>

          ) : (

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

              {watchlist.map(
                (item) => {

                  const auction =
                    item.auction;

                  return (

                    <Link
                      key={item.id}
                      href={`/marketplace-auctions/${auction.id}`}
                      className="group border border-gray-200 rounded-2xl overflow-hidden bg-white hover:border-black transition"
                    >

                      <div className="aspect-square bg-gray-100 overflow-hidden">

                        {auction.images?.[0] ? (

                          <img
                            src={
                              auction.images[0]
                            }
                            alt={
                              auction.title
                            }
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />

                        ) : (

                          <div className="w-full h-full bg-gray-100" />

                        )}

                      </div>

                      <div className="p-5">

                        <div className="flex items-center justify-between gap-3 mb-3">

                          <span className="inline-flex px-3 py-1 rounded-full bg-black text-white text-xs font-medium">
                            {auction.category}
                          </span>

                          <span
                            className={`
                              inline-flex px-3 py-1 rounded-full text-xs font-medium
                              ${
                                auction.status ===
                                "LIVE"
                                  ? "bg-green-100 text-green-700"
                                  : auction.status ===
                                    "ENDED"
                                  ? "bg-gray-200 text-gray-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }
                            `}
                          >

                            {auction.status}

                          </span>

                        </div>

                        <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">

                          {auction.title}

                        </h3>

                        <div className="mt-5 flex items-end justify-between">

                          <div>

                            <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                              Current Bid
                            </p>

                            <p className="text-2xl font-semibold text-gray-900">

                              $
                              {auction.currentBid > 0
                                ? auction.currentBid.toLocaleString()
                                : auction.startingBid.toLocaleString()}

                            </p>

                          </div>

                          <div className="text-right">

                            <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                              Bids
                            </p>

                            <p className="font-semibold text-gray-900">
                              {auction.bidCount}
                            </p>

                          </div>

                        </div>

                      </div>

                    </Link>

                  );

                }
              )}

            </div>

          )}

        </div>

        <div className="grid lg:grid-cols-2 gap-8">

          {/* PURCHASES */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8">

            <h2 className="text-2xl font-semibold text-gray-900 mb-8">
              My Purchases
            </h2>

            {purchases.length === 0 ? (

              <div className="border border-dashed border-gray-300 rounded-2xl p-10 text-center">

                <p className="text-gray-500">
                  No purchases yet.
                </p>

              </div>

            ) : (

              <div className="space-y-4">

                {purchases.map(
                  (auction) => (

                    <a
                      key={auction.id}
                      href={`/marketplace-auctions/${auction.id}`}
                      className="block border border-gray-200 rounded-2xl p-5 hover:border-black transition"
                    >

                      <div className="flex items-start justify-between gap-4">

                        <div>

                          <p className="font-semibold text-gray-900">
                            {auction.title}
                          </p>

                          <p className="text-sm text-gray-500 mt-1">
                            {auction.category}
                          </p>

                        </div>

                        <div
                          className={`
                            px-3 py-1 rounded-full text-xs font-medium
                            ${
                              auction.paymentStatus ===
                              "PAID"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }
                          `}
                        >

                          {auction.paymentStatus ===
                          "PAID"
                            ? "PAID"
                            : "UNPAID"}

                        </div>

                      </div>

                      <div className="mt-5 flex items-center justify-between">

                        <p className="text-2xl font-semibold text-gray-900">

                          $
                          {auction.currentBid.toLocaleString()}

                        </p>

                        <div className="text-right">

                          <p className="text-sm text-gray-500">
                            {auction.fulfillmentStatus || "PENDING"}
                          </p>

                          {auction.trackingNumber && (

                            <p className="text-xs text-gray-500 mt-1">
                              Tracking: {auction.trackingNumber}
                            </p>

                          )}

                        </div>

                      </div>

                    </a>

                  )
                )}

              </div>

            )}

          </div>

          {/* SELLER TRANSACTIONS */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8">

            <h2 className="text-2xl font-semibold text-gray-900 mb-8">
              Seller Transactions
            </h2>

            {sellerAuctions.length === 0 ? (

              <div className="border border-dashed border-gray-300 rounded-2xl p-10 text-center">

                <p className="text-gray-500">
                  No marketplace auctions yet.
                </p>

              </div>

            ) : (

              <div className="space-y-5">

                {sellerAuctions.map(
                  (auction) => (

                    <div
                      key={auction.id}
                      className="border border-gray-200 rounded-2xl p-5"
                    >

                      <div className="flex items-start justify-between gap-4">

                        <div>

                          <a
                            href={`/marketplace-auctions/${auction.id}`}
                            className="font-semibold text-gray-900 hover:underline"
                          >
                            {auction.title}
                          </a>

                          <p className="text-sm text-gray-500 mt-1">
                            {auction.category}
                          </p>

                        </div>

                        <div
                          className={`
                            px-3 py-1 rounded-full text-xs font-medium
                            ${
                              auction.paymentStatus ===
                              "PAID"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }
                          `}
                        >

                          {auction.paymentStatus ===
                          "PAID"
                            ? "PAID"
                            : "UNPAID"}

                        </div>

                      </div>

<div className="mt-5 grid sm:grid-cols-2 xl:grid-cols-4 gap-5">

  <div>

    <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">
      Final Bid
    </p>

    <p className="text-2xl font-semibold text-gray-900">

      $
      {auction.currentBid.toLocaleString()}

    </p>

  </div>

  <div>

    <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">
      MrBids Fee
    </p>

    <p className="text-2xl font-semibold text-red-600">

      $
      {(auction.marketplaceFeeAmount || 0).toLocaleString()}

    </p>

  </div>

  <div>

    <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">
      Seller Payout
    </p>

    <p className="text-2xl font-semibold text-green-700">

      $
      {(auction.sellerPayoutAmount || 0).toLocaleString()}

    </p>

  </div>

  <div>

    <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">
      Fulfillment Status
    </p>

    <p className="font-medium text-gray-900">
      {auction.fulfillmentStatus || "PENDING"}
    </p>

  </div>

</div>
                      {auction.shippingCost && (

                        <div className="mt-5">

                          <p className="text-sm text-gray-600">
                            Shipping Charge:
                            <span className="ml-2 font-semibold text-gray-900">

                              $
                              {auction.shippingCost.toLocaleString()}

                            </span>
                          </p>

                        </div>

                      )}

                      {auction.trackingNumber && (

                        <div className="mt-3">

                          <p className="text-sm text-gray-600">
                            Tracking Number:
                            <span className="ml-2 font-semibold text-gray-900">
                              {auction.trackingNumber}
                            </span>
                          </p>

                        </div>

                      )}

                      {auction.winner && (

                        <div className="mt-6 border-t border-gray-100 pt-5">

                          <p className="text-xs uppercase tracking-wider text-gray-500 mb-3">
                            Winning Buyer
                          </p>

                          <div className="space-y-2">

                            <p className="text-sm text-gray-900">
                              <strong>Name:</strong>{" "}
                              {auction.winner.name ||
                                "Marketplace Buyer"}
                            </p>

                            <p className="text-sm text-gray-900">
                              <strong>Email:</strong>{" "}
                              {auction.winner.email}
                            </p>

                            {auction.paidAt && (

                              <p className="text-sm text-green-700 font-medium">

                                Paid on{" "}
                                {new Date(
                                  auction.paidAt
                                ).toLocaleDateString()}

                              </p>

                            )}

                          </div>

                        </div>

                      )}

                      {auction.paymentStatus ===
                        "PAID" && (

                        <FulfillmentControls
                          auctionId={auction.id}
                          currentStatus={
                            auction.fulfillmentStatus
                          }
                          currentTrackingNumber={
                            auction.trackingNumber
                          }
                        />

                      )}

                    </div>

                  )
                )}

              </div>

            )}

          </div>

        </div>

      </div>

    </main>
  </>
  );

}