import CountdownTimer from "@/components/CountdownTimer";

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
    <main className="min-h-screen bg-zinc-950 text-white">

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 pt-32 pb-24">

        <div className="max-w-3xl">

          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 mb-8">

            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />

            <span className="text-sm font-medium text-red-400">
              LIVE Marketplace Auctions
            </span>

          </div>

          <h1 className="text-5xl md:text-7xl font-semibold leading-[1.02]">
            LIVE Auctions
          </h1>

          <p className="mt-8 text-lg md:text-xl text-zinc-400">
            Watch high-energy LIVE auctions featuring liquidation deals,
            luxury items, collectibles, electronics, jewelry, and more.
          </p>

        </div>

      </section>

      {/* LIVE GRID */}
      <section className="border-t border-zinc-800">

        <div className="max-w-7xl mx-auto px-6 py-24">

          {auctions.length === 0 ? (

            <div className="border border-zinc-800 rounded-3xl p-16 text-center bg-zinc-900">

              <h2 className="text-3xl font-semibold text-white">
                No LIVE Auctions Right Now
              </h2>

              <p className="mt-4 text-zinc-400">
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
                    className="group border border-zinc-800 rounded-3xl overflow-hidden hover:border-zinc-700 hover:shadow-2xl hover:shadow-black/40 transition bg-zinc-900"
                  >

                    {/* IMAGE */}
                    <div className="aspect-[4/5] md:aspect-square bg-zinc-800 overflow-hidden relative">

                      {auction.coverImage ? (

                        <img
                          src={auction.coverImage}
                          alt={auction.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />

                      ) : (

                        <div className="w-full h-full bg-zinc-800" />

                      )}

                      {/* LIVE BADGE */}
                      <div className="absolute top-4 left-4">

                        <span className="px-3 py-1 rounded-full bg-red-500 text-white text-xs font-semibold tracking-wide animate-pulse shadow-lg shadow-red-500/30">
                          LIVE
                        </span>

                      </div>

                    </div>

                    {/* CONTENT */}
                    <div className="p-5 md:p-6">

                      {/* CATEGORY */}
                      <div className="mb-4">

                        <span className="px-3 py-1 rounded-full bg-white text-black text-xs font-medium">
                          {auction.category}
                        </span>

                      </div>

                      {/* TITLE */}
                      <h2 className="text-xl md:text-2xl font-semibold leading-snug text-white">
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
                            className="w-10 h-10 rounded-full object-cover border border-zinc-700"
                          />

                        ) : (

                          <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-semibold text-zinc-400">
                            {auction.seller.name?.charAt(0) ||
                              "M"}
                          </div>

                        )}

                        <div>

                          <p className="font-medium text-sm md:text-base text-zinc-300">
                            {auction.seller.name ||
                              "Marketplace Seller"}
                          </p>

                        </div>

                      </div>

                      {/* CURRENT BID */}
                      <div className="mt-6 border border-zinc-800 rounded-2xl p-5 bg-zinc-950">

                        <p className="text-sm text-zinc-500 mb-1">
                          Current Bid
                        </p>

                        <p className="text-2xl md:text-3xl font-semibold text-white">
                          $
                          {auction.currentBid?.toLocaleString()}
                        </p>

                        {auction.endAt && (

                          <div className="mt-4 inline-flex items-center px-3 py-2 rounded-full bg-red-500/10 border border-red-500/20">

                            <span className="text-sm font-medium text-red-400">
                              Ends In:
                            </span>

                            <div className="ml-2 text-white">
                              <CountdownTimer
                                endAt={auction.endAt.toISOString()}
                              />
                            </div>

                          </div>

                        )}

                      </div>

                      {/* RETAIL PRICE */}
                      <div className="mt-5 border border-emerald-500/20 rounded-2xl p-4 bg-emerald-500/10">

                        {auction.retailPrice ? (

                          <div className="flex items-center justify-between gap-4">

                            <div>

                              <p className="text-xs text-emerald-400 mb-1 font-medium">
                                Retail
                              </p>

                              <p className="text-lg md:text-xl font-semibold text-emerald-200">
                                $
                                {auction.retailPrice.toLocaleString()}
                              </p>

                            </div>

                            <div className="text-right">

                              <p className="text-xs text-emerald-400 mb-1 font-medium">
                                Savings
                              </p>

                              <p className="text-lg md:text-xl font-semibold text-emerald-200">

                                $
                                {savings.toLocaleString()}

                              </p>

                            </div>

                          </div>

                        ) : (

                          <div className="flex items-center justify-center min-h-[72px]">

                            <p className="text-sm text-emerald-300 font-medium">
                              Retail price unavailable
                            </p>

                          </div>

                        )}

                      </div>

                      {/* BUTTON */}
                      <div className="mt-6">

                        <div className="w-full py-3 rounded-full bg-white text-black text-center text-sm font-semibold hover:bg-zinc-200 transition">
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