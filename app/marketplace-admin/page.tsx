import Link from "next/link";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {

  // USERS
  const totalUsers =
    await prisma.user.count();

  const newUsersToday =
    await prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(
            new Date().setHours(
              0,
              0,
              0,
              0
            )
          ),
        },
      },
    });

  // MARKETPLACE AUCTIONS
  const liveAuctions =
    await prisma.marketplaceAuction.count({
      where: {
        status: "LIVE",
      },
    });

  const endedAuctions =
    await prisma.marketplaceAuction.count({
      where: {
        status: "ENDED",
      },
    });

  const reserveNotMetAuctions =
    await prisma.marketplaceAuction.count({
      where: {
        status: "RESERVE_NOT_MET",
      },
    });

  // BIDS
  const totalBids =
    await prisma.marketplaceBid.count();

  const bidsToday =
    await prisma.marketplaceBid.count({
      where: {
        createdAt: {
          gte: new Date(
            new Date().setHours(
              0,
              0,
              0,
              0
            )
          ),
        },
      },
    });

  // REVENUE
  const soldAuctions =
    await prisma.marketplaceAuction.findMany({
      where: {
        status: "ENDED",
      },

      select: {
        currentBid: true,
      },
    });

  const grossRevenue =
    soldAuctions.reduce(
      (sum, auction) =>
        sum + (auction.currentBid || 0),
      0
    );

  // RECENT AUCTIONS
  const recentAuctions =
    await prisma.marketplaceAuction.findMany({
      orderBy: {
        createdAt: "desc",
      },

      take: 10,

      include: {
        seller: true,
      },
    });

  // TOP AUCTIONS
  const topAuctions =
    await prisma.marketplaceAuction.findMany({
      orderBy: {
        currentBid: "desc",
      },

      take: 5,
    });

  return (

    <main className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <section className="border-b bg-white">

        <div className="max-w-7xl mx-auto px-6 py-10">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-gray-500 uppercase tracking-[0.18em] mb-3">
                MrBids Admin
              </p>

              <h1 className="text-4xl md:text-6xl font-semibold leading-tight">
                Marketplace Dashboard
              </h1>

            </div>

            <Link
              href="/marketplace-auctions"
              className="px-5 py-3 rounded-2xl bg-black text-white text-sm font-medium hover:opacity-90 transition"
            >
              View Marketplace
            </Link>

          </div>

        </div>

      </section>

      {/* OVERVIEW CARDS */}
      <section className="py-12">

        <div className="max-w-7xl mx-auto px-6">

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">

            <div className="bg-white border rounded-3xl p-6">
              <p className="text-sm text-gray-500 mb-3">
                Total Users
              </p>

              <h2 className="text-4xl font-semibold">
                {totalUsers}
              </h2>
            </div>

            <div className="bg-white border rounded-3xl p-6">
              <p className="text-sm text-gray-500 mb-3">
                New Users Today
              </p>

              <h2 className="text-4xl font-semibold">
                {newUsersToday}
              </h2>
            </div>

            <div className="bg-white border rounded-3xl p-6">
              <p className="text-sm text-gray-500 mb-3">
                LIVE Auctions
              </p>

              <h2 className="text-4xl font-semibold text-red-500">
                {liveAuctions}
              </h2>
            </div>

            <div className="bg-white border rounded-3xl p-6">
              <p className="text-sm text-gray-500 mb-3">
                Auctions Sold
              </p>

              <h2 className="text-4xl font-semibold text-green-600">
                {endedAuctions}
              </h2>
            </div>

            <div className="bg-white border rounded-3xl p-6">
              <p className="text-sm text-gray-500 mb-3">
                Reserve Not Met
              </p>

              <h2 className="text-4xl font-semibold text-orange-500">
                {reserveNotMetAuctions}
              </h2>
            </div>

            <div className="bg-white border rounded-3xl p-6">
              <p className="text-sm text-gray-500 mb-3">
                Total Bids
              </p>

              <h2 className="text-4xl font-semibold">
                {totalBids}
              </h2>
            </div>

            <div className="bg-white border rounded-3xl p-6">
              <p className="text-sm text-gray-500 mb-3">
                Bids Today
              </p>

              <h2 className="text-4xl font-semibold">
                {bidsToday}
              </h2>
            </div>

            <div className="bg-white border rounded-3xl p-6">
              <p className="text-sm text-gray-500 mb-3">
                Gross Revenue
              </p>

              <h2 className="text-4xl font-semibold">
                $
                {grossRevenue.toLocaleString()}
              </h2>
            </div>

          </div>

        </div>

      </section>

      {/* RECENT AUCTIONS */}
      <section className="pb-12">

        <div className="max-w-7xl mx-auto px-6">

          <div className="bg-white border rounded-3xl overflow-hidden">

            <div className="p-6 border-b">

              <h2 className="text-2xl font-semibold">
                Recent Auctions
              </h2>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full text-sm">

                <thead className="bg-gray-50">

                  <tr className="text-left">

                    <th className="px-6 py-4 font-medium">
                      Auction
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Category
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Seller
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Current Bid
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Status
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {recentAuctions.map(
                    (auction) => (

                      <tr
                        key={auction.id}
                        className="border-t"
                      >

                        <td className="px-6 py-4">
                          {auction.title}
                        </td>

                        <td className="px-6 py-4">
                          {auction.category}
                        </td>

                        <td className="px-6 py-4">
                          {auction.seller.name ||
                            "Seller"}
                        </td>

                        <td className="px-6 py-4">
                          $
                          {auction.currentBid?.toLocaleString()}
                        </td>

                        <td className="px-6 py-4">

                          <span className="px-3 py-1 rounded-full bg-black text-white text-xs font-medium">
                            {auction.status}
                          </span>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      </section>

      {/* TOP AUCTIONS */}
      <section className="pb-20">

        <div className="max-w-7xl mx-auto px-6">

          <div className="bg-white border rounded-3xl overflow-hidden">

            <div className="p-6 border-b">

              <h2 className="text-2xl font-semibold">
                Top Auctions
              </h2>

            </div>

            <div className="divide-y">

              {topAuctions.map(
                (auction, index) => (

                  <div
                    key={auction.id}
                    className="flex items-center justify-between px-6 py-5"
                  >

                    <div className="flex items-center gap-4">

                      <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-semibold">
                        {index + 1}
                      </div>

                      <div>

                        <p className="font-medium">
                          {auction.title}
                        </p>

                        <p className="text-sm text-gray-500">
                          {auction.category}
                        </p>

                      </div>

                    </div>

                    <div className="text-right">

                      <p className="font-semibold text-lg">
                        $
                        {auction.currentBid?.toLocaleString()}
                      </p>

                    </div>

                  </div>

                )
              )}

            </div>

          </div>

        </div>

      </section>

    </main>

  );

}