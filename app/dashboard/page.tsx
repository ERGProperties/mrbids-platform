import type { Metadata } from "next";

import { redirect } from "next/navigation";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";

import { prisma } from "@/lib/prisma";

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

  // PURCHASES
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

  // SELLER AUCTIONS
  const sellerAuctions =
    await prisma.marketplaceAuction.findMany({
      where: {
        sellerId:
          userId,
      },

      orderBy: {
        updatedAt:
          "desc",
      },

      take: 10,
    });

  // STATS
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

  return (
    <main className="bg-gray-50 min-h-screen">

      <div className="max-w-7xl mx-auto px-6 py-24">

        {/* HEADER */}
        <div className="mb-12">

          <h1 className="text-4xl md:text-5xl font-semibold text-gray-900">
            Marketplace Dashboard
          </h1>

          <p className="mt-4 text-lg text-gray-600">
            Manage your purchases, auctions, and marketplace activity.
          </p>

        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">

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

        </div>

        <div className="grid lg:grid-cols-2 gap-8">

          {/* PURCHASES */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8">

            <div className="flex items-center justify-between mb-8">

              <h2 className="text-2xl font-semibold text-gray-900">
                My Purchases
              </h2>

            </div>

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

                        <p className="text-sm text-gray-500">
                          {auction.status}
                        </p>

                      </div>

                    </a>

                  )
                )}

              </div>

            )}

          </div>

          {/* SELLER AUCTIONS */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8">

            <div className="flex items-center justify-between mb-8">

              <h2 className="text-2xl font-semibold text-gray-900">
                My Auctions
              </h2>

            </div>

            {sellerAuctions.length === 0 ? (

              <div className="border border-dashed border-gray-300 rounded-2xl p-10 text-center">

                <p className="text-gray-500">
                  No marketplace auctions yet.
                </p>

              </div>

            ) : (

              <div className="space-y-4">

                {sellerAuctions.map(
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
                              auction.status ===
                              "LIVE"
                                ? "bg-red-100 text-red-700"
                                : auction.status ===
                                  "ENDED"
                                ? "bg-gray-200 text-gray-700"
                                : "bg-yellow-100 text-yellow-700"
                            }
                          `}
                        >

                          {auction.status}

                        </div>

                      </div>

                      <div className="mt-5 flex items-center justify-between">

                        <p className="text-2xl font-semibold text-gray-900">

                          $
                          {auction.currentBid.toLocaleString()}

                        </p>

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

                    </a>

                  )
                )}

              </div>

            )}

          </div>

        </div>

        {/* CTA */}
        <div className="mt-12 bg-white border border-gray-200 rounded-2xl p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">

          <div>

            <h2 className="text-2xl font-semibold text-gray-900">
              Ready to launch another auction?
            </h2>

            <p className="mt-2 text-gray-600">
              Create new marketplace listings and start receiving bids in real time.
            </p>

          </div>

          <a
            href="/sell"
            className="inline-flex items-center justify-center px-8 py-4 bg-black text-white rounded-full font-medium hover:bg-gray-900 transition"
          >
            Create Auction
          </a>

        </div>

      </div>

    </main>
  );

}