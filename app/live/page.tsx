import Link from "next/link";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function LivePage() {

  // AUTO-END EXPIRED LIVE AUCTIONS
  await prisma.marketplaceAuction.updateMany({

    where: {

      status: "LIVE",

      endAt: {
        lte: new Date(),
      },

    },

    data: {
      status: "ENDED",
    },

  });

  const auctions =
    await prisma.marketplaceAuction.findMany({

      where: {
        status: "LIVE",
      },

      orderBy: {
        endAt: "asc",
      },

      include: {
        seller: true,
      },

    });

  return (
    <main className="min-h-screen bg-white">

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 pt-32 pb-24">

        <div className="max-w-3xl">

          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-red-50 border border-red-100 mb-8">

            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />

            <span className="text-sm font-medium text-red-700">
              LIVE Marketplace Auctions
            </span>

          </div>

          <h1 className="text-5xl md:text-7xl font-semibold leading-[1.02]">
            LIVE Auctions
          </h1>

          <p className="mt-8 text-lg md:text-xl text-gray-600">
            Watch high-energy LIVE auctions featuring liquidation deals,
            luxury items, collectibles, electronics, jewelry, and more.
          </p>

        </div>

      </section>

      {/* LIVE GRID */}
      <section className="border-t">

        <div className="max-w-7xl mx-auto px-6 py-24">

          {auctions.length === 0 ? (

            <div className="border rounded-3xl p-16 text-center">

              <h2 className="text-3xl font-semibold">
                No LIVE Auctions Right Now
              </h2>

              <p className="mt-4 text-gray-600">
                Check back soon for upcoming marketplace auctions.
              </p>

            </div>

          ) : (

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">

              {auctions.map((auction) => {

                const savings =
                  auction.retailPrice
                    ? Math.max(
                        auction.retailPrice -
                          auction.currentBid,
                        0
                      )
                    : 0;

                return (

                  <Link
                    key={auction.id}
                    href={`/marketplace-auctions/${auction.id}`}
                    className="group border rounded-3xl overflow-hidden hover:shadow-xl transition bg-white"
                  >

                    {/* IMAGE */}
                    <div className="aspect-[4/5] md:aspect-square bg-gray-100 overflow-hidden relative">

                      {auction.coverImage ? (

                        <img
                          src={auction.coverImage}
                          alt={auction.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />

                      ) : (

                        <div className="w-full h-full bg-gray-100" />

                      )}

                      {/* LIVE BADGE */}
                      <div className="absolute top-4 left-4">

                        <span className="px-3 py-1 rounded-full bg-red-600 text-white text-xs font-semibold tracking-wide animate-pulse">
                          LIVE
                        </span>

                      </div>

                    </div>

                    {/* CONTENT */}
                    <div className="p-5 md:p-6">

                      {/* CATEGORY */}
                      <div className="mb-4">

                        <span className="px-3 py-1 rounded-full bg-black text-white text-xs font-medium">
                          {auction.category}
                        </span>

                      </div>

                      {/* TITLE */}
                      <h2 className="text-xl md:text-2xl font-semibold leading-snug">
                        {auction.title}
                      </h2>

                      {/* SELLER */}
                      <div className="mt-5 flex items-center gap-3">

                        {auction.seller.avatarUrl ? (

                          <img
                            src={
                              auction.seller.avatarUrl
                            }
                            alt={
                              auction.seller.name ||
                              "Seller"
                            }
                            className="w-10 h-10 rounded-full object-cover border"
                          />

                        ) : (

                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-500">
                            {auction.seller.name?.charAt(0) ||
                              "M"}
                          </div>

                        )}

                        <div>

                          <p className="font-medium text-sm md:text-base">
                            {auction.seller.name ||
                              "Marketplace Seller"}
                          </p>

                        </div>

                      </div>

                      {/* CURRENT BID */}
                      <div className="mt-6">

                        <p className="text-sm text-gray-500 mb-1">
                          Current Bid
                        </p>

                        <p className="text-2xl md:text-3xl font-semibold">
                          $
                          {auction.currentBid?.toLocaleString()}
                        </p>

                      </div>

                      {/* RETAIL PRICE */}
                      <div className="mt-5 border rounded-2xl p-4 bg-green-50 border-green-200">

                        {auction.retailPrice ? (

                          <div className="flex items-center justify-between gap-4">

                            <div>

                              <p className="text-xs text-green-700 mb-1 font-medium">
                                Retail
                              </p>

                              <p className="text-lg md:text-xl font-semibold text-green-900">
                                $
                                {auction.retailPrice.toLocaleString()}
                              </p>

                            </div>

                            <div className="text-right">

                              <p className="text-xs text-green-700 mb-1 font-medium">
                                Savings
                              </p>

                              <p className="text-lg md:text-xl font-semibold text-green-900">

                                $
                                {savings.toLocaleString()}

                              </p>

                            </div>

                          </div>

                        ) : (

                          <div className="flex items-center justify-center min-h-[72px]">

                            <p className="text-sm text-green-800 font-medium">
                              Retail price unavailable
                            </p>

                          </div>

                        )}

                      </div>

                      {/* BUTTON */}
                      <div className="mt-6">

                        <div className="w-full py-3 rounded-full bg-black text-white text-center text-sm font-medium">
                          Watch LIVE
                        </div>

                      </div>

                    </div>

                  </Link>

                );

              })}

            </div>

          )}

        </div>

      </section>

    </main>
  );
}