import MarketplaceAuctionCard from "@/components/MarketplaceAuctionCard";

import Link from "next/link";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function MarketplaceAuctionsPage({
  searchParams,
}: {
  searchParams: {
    category?: string;
  };
}) {

  const category = searchParams.category;

  // LIVE AUCTIONS
  const liveAuctions =
    await prisma.marketplaceAuction.findMany({
      where: {
        ...(category
          ? {
              category: {
                equals: category,
                mode: "insensitive",
              },
            }
          : {}),

        status: "LIVE",
      },

      orderBy: {
        endAt: "asc",
      },

      include: {
        seller: true,
      },
    });

  // ENDED AUCTIONS
  const endedAuctions =
    await prisma.marketplaceAuction.findMany({
      where: {
        ...(category
          ? {
              category: {
                equals: category,
                mode: "insensitive",
              },
            }
          : {}),

        status: "ENDED",
      },

      orderBy: {
        endAt: "desc",
      },

      include: {
        seller: true,
      },

      take: 6,
    });

  const renderAuctionCard = (auction: any) => (
  <MarketplaceAuctionCard
    key={auction.id}
    auction={auction}
  />
);

return (

    <main className="min-h-screen bg-white">

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-14">

        <div className="max-w-3xl">

          <p className="text-sm font-medium text-gray-500 uppercase tracking-[0.18em] mb-6">
            Marketplace Auctions
          </p>

          <h1 className="text-4xl md:text-7xl font-semibold leading-[1.02]">
            {category
              ? `${category
                  .replace(/-/g, " ")
                  .replace(/\b\w/g, (char) =>
                    char.toUpperCase()
                  )} Auctions`
              : "Discover LIVE Marketplace Auctions"}
          </h1>

          <p className="mt-6 md:mt-8 text-lg md:text-xl text-gray-600">
            {category
              ? `Browse LIVE ${category.replace(
                  /-/g,
                  " "
                )} auctions across the MrBids marketplace.`
              : "Browse unique items from sellers across the MrBids marketplace."}
          </p>

        </div>
      </section>

      {/* CATEGORY FILTERS */}
      <section className="pb-10">

        <div className="max-w-7xl mx-auto px-6 overflow-x-auto">

          <div className="flex gap-3 min-w-max">

            <Link
              href="/marketplace-auctions"
              className={`px-5 py-2 rounded-full border text-sm font-medium transition ${
                !category
                  ? "bg-black text-white border-black"
                  : "bg-white text-black border-gray-300 hover:border-black"
              }`}
            >
              All
            </Link>

            {[
              {
                label: "Jewelry",
                slug: "jewelry",
              },
              {
                label: "Electronics",
                slug: "electronics",
              },
              {
                label: "Sneakers",
                slug: "sneakers",
              },
              {
                label: "Collectibles",
                slug: "collectibles",
              },
              {
                label: "Liquidation",
                slug: "liquidation",
              },
              {
                label: "Luxury Items",
                slug: "luxury-items",
              },
              {
                label: "Storage Finds",
                slug: "storage-finds",
              },
            ].map((item) => (

              <Link
                key={item.slug}
                href={`/marketplace-auctions?category=${item.slug}`}
                className={`px-5 py-2 rounded-full border text-sm font-medium transition ${
                  category === item.slug
                    ? "bg-black text-white border-black"
                    : "bg-white text-black border-gray-300 hover:border-black"
                }`}
              >
                {item.label}
              </Link>

            ))}

          </div>
        </div>
      </section>

      {/* LIVE AUCTIONS */}
      <section className="pb-24">

        <div className="max-w-7xl mx-auto px-6">

          <div className="flex items-center justify-between mb-10">

            <div>

              <p className="text-sm font-medium text-red-500 uppercase tracking-[0.18em] mb-3">
                Happening Now
              </p>

              <h2 className="text-3xl md:text-5xl font-semibold">
                LIVE Auctions
              </h2>

            </div>
          </div>

          {liveAuctions.length === 0 ? (

            <div className="border rounded-3xl p-16 text-center">

              <h2 className="text-3xl font-semibold">
                No LIVE Auctions Yet
              </h2>

              <p className="mt-4 text-gray-600">
                Be the first seller to launch an auction.
              </p>

            </div>

          ) : (

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">

              {liveAuctions.map((auction) =>
                renderAuctionCard(auction)
              )}

            </div>

          )}

        </div>
      </section>

      {/* RECENTLY ENDED */}
      {endedAuctions.length > 0 && (

        <section className="pb-24 border-t bg-gray-50">

          <div className="max-w-7xl mx-auto px-6 pt-20">

            <div className="flex items-center justify-between mb-10">

              <div>

                <p className="text-sm font-medium text-gray-500 uppercase tracking-[0.18em] mb-3">
                  Marketplace Activity
                </p>

                <h2 className="text-3xl md:text-5xl font-semibold">
                  Recently Ended
                </h2>

              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 opacity-90">

              {endedAuctions.map((auction) =>
                renderAuctionCard(auction)
              )}

            </div>
          </div>
        </section>

      )}

    </main>

  );

}