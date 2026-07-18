import MarketplaceAuctionCard from "@/components/MarketplaceAuctionCard";

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

              {auctions.map((auction) => (
  <MarketplaceAuctionCard
    key={auction.id}
    auction={auction}
  />
))}

            </div>

          )}

        </div>

      </section>

    </main>
  );
}