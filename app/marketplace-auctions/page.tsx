import Link from "next/link";

import { prisma } from "@/lib/prisma";

export default async function MarketplaceAuctionsPage() {

  const auctions =
    await prisma.marketplaceAuction.findMany({

      orderBy: {
        createdAt: "desc",
      },

      include: {
        seller: true,
      },

    });

  return (
    <main className="min-h-screen bg-white">

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-14">

        <div className="max-w-3xl">

          <p className="text-sm font-medium text-gray-500 uppercase tracking-[0.18em] mb-6">
            Marketplace Auctions
          </p>

          <h1 className="text-4xl md:text-7xl font-semibold leading-[1.02]">
            Discover LIVE Marketplace Auctions
          </h1>

          <p className="mt-6 md:mt-8 text-lg md:text-xl text-gray-600">
            Browse unique items from sellers across the MrBids marketplace.
          </p>

        </div>

      </section>

      {/* GRID */}
      <section className="pb-24">

        <div className="max-w-7xl mx-auto px-6">

          {auctions.length === 0 ? (

            <div className="border rounded-3xl p-16 text-center">

              <h2 className="text-3xl font-semibold">
                No Marketplace Auctions Yet
              </h2>

              <p className="mt-4 text-gray-600">
                Be the first seller to launch an auction.
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

                      {/* STATUS BADGE */}
                      <div className="absolute top-4 right-4">

                        {auction.status === "LIVE" && (

                          <span className="px-3 py-1 rounded-full bg-red-500 text-white text-xs font-semibold">
                            LIVE
                          </span>

                        )}

                        {auction.status === "SCHEDULED" && (

                          <span className="px-3 py-1 rounded-full bg-yellow-500 text-white text-xs font-semibold">
                            SCHEDULED
                          </span>

                        )}

                        {auction.status === "ENDED" && (

                          <span className="px-3 py-1 rounded-full bg-gray-700 text-white text-xs font-semibold">
                            ENDED
                          </span>

                        )}

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

                          {auction.seller
                            .tiktokUsername && (

                            <p className="text-xs md:text-sm text-gray-500">
                              {
                                auction.seller
                                  .tiktokUsername
                              }
                            </p>

                          )}

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
                      {auction.retailPrice && (

                        <div className="mt-5 border rounded-2xl p-4 bg-green-50 border-green-200">

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

                        </div>

                      )}

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