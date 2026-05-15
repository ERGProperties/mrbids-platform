export const dynamic = "force-dynamic";

import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { getAllAuctions } from "@/lib/repositories/auctionRepository";

const activityFeed = [
  "Luxury watch sold for $2,450",
  "Sneaker auction hit 300+ bids",
  "Electronics liquidation sold LIVE",
  "Storage unit auction reached 128 bids",
  "Jewelry auction ended in 2 minutes",
  "Rare collectible card sold for $5,200",
];

function getPrimaryImage(auction: any) {

  if (
    typeof auction?.coverImage === "string" &&
    auction.coverImage.startsWith("http")
  ) {
    return auction.coverImage;
  }

  if (!Array.isArray(auction?.images))
    return null;

  const first = auction.images.find(
    (img: unknown) =>
      typeof img === "string" &&
      img.startsWith("http")
  );

  return first || null;
}

export default async function HomePage() {

  // REAL ESTATE
  let realEstateAuctions: any[] = [];

  try {

    const result =
      await getAllAuctions();

    realEstateAuctions =
      Array.isArray(result)
        ? result
        : [];

  } catch (err) {

    console.error(
      "Failed loading auctions:",
      err
    );

  }

  // MARKETPLACE
  const marketplaceAuctions =
    await prisma.marketplaceAuction.findMany({

      orderBy: {
        createdAt: "desc",
      },

      include: {
        seller: true,
      },

      take: 6,

    });

  return (
    <main className="bg-white text-black">

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 md:pt-32 pb-20 md:pb-24">

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* LEFT */}
          <div>

            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-red-50 border border-red-100 mb-6 md:mb-8">

              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />

              <span className="text-xs sm:text-sm font-medium text-red-700">
                LIVE Auctions Happening Now
              </span>

            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-semibold leading-[1.02]">
              Bid LIVE
              <br />
              Starting
              <br />
              at $1
            </h1>

            <p className="mt-8 md:mt-10 text-lg md:text-xl text-gray-600 max-w-2xl">
              Discover jewelry, electronics,
              collectibles, liquidation deals,
              rare finds, and real estate
              through fast-paced LIVE auctions.
            </p>

            <div className="mt-10 md:mt-14 flex flex-col sm:flex-row gap-4">

              <Link
                href="/marketplace-auctions"
                className="w-full sm:w-auto text-center px-8 md:px-10 py-4 md:py-5 bg-black text-white rounded-full"
              >
                Browse Marketplace
              </Link>

              <Link
                href="/coming-soon"
                className="w-full sm:w-auto text-center px-8 md:px-10 py-4 md:py-5 border rounded-full"
              >
                Start Selling
              </Link>

            </div>

            {/* STATS */}
            <div className="mt-14 grid grid-cols-3 gap-6">

              <div>

                <p className="text-3xl md:text-4xl font-semibold">
                  LIVE
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  Auctions Daily
                </p>

              </div>

              <div>

                <p className="text-3xl md:text-4xl font-semibold">
                  $1
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  Starting Bids
                </p>

              </div>

              <div>

                <p className="text-3xl md:text-4xl font-semibold">
                  24/7
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  Marketplace Energy
                </p>

              </div>

            </div>

          </div>

          {/* RIGHT */}
          <div className="relative">

            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl">

              <img
                src="https://images.unsplash.com/photo-1607082350899-7e105aa886ae?q=80&w=1600&auto=format&fit=crop"
                alt="LIVE Auctions"
                className="w-full h-[420px] sm:h-[520px] md:h-[720px] object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

              {/* LIVE BADGE */}
              <div className="absolute top-6 left-6">

                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-600 text-white text-sm font-semibold">

                  <div className="w-2 h-2 rounded-full bg-white animate-pulse" />

                  LIVE NOW

                </div>

              </div>

              {/* LIVE CARD */}
              <div className="absolute bottom-6 left-6 right-6 bg-white rounded-3xl p-6 shadow-xl">

                <div className="flex items-center justify-between gap-4">

                  <div>

                    <p className="text-sm text-gray-500">
                      Trending Auction
                    </p>

                    <h3 className="mt-2 text-2xl font-semibold">
                      Luxury Jewelry Drop
                    </h3>

                  </div>

                  <div className="text-right">

                    <p className="text-sm text-gray-500">
                      Current Bid
                    </p>

                    <p className="mt-2 text-3xl font-semibold">
                      $1,250
                    </p>

                  </div>

                </div>

                <Link
                  href="/marketplace-auctions"
                  className="block text-center w-full mt-6 py-4 bg-black text-white rounded-full font-medium"
                >
                  Join LIVE Auction
                </Link>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ACTIVITY FEED */}
      <section className="border-y bg-black text-white overflow-hidden">

        <div className="flex gap-12 whitespace-nowrap py-5 px-6 animate-pulse">

          {activityFeed.map(
            (item, index) => (

              <div
                key={index}
                className="text-sm font-medium"
              >
                🔥 {item}
              </div>

            )
          )}

        </div>

      </section>

      {/* CATEGORIES */}
      <section className="bg-gray-50 border-b">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-24">

          <div className="flex items-center justify-between mb-12">

            <h2 className="text-4xl font-semibold">
              Browse Categories
            </h2>

            <Link
              href="/categories"
              className="text-sm font-medium"
            >
              View all →
            </Link>

          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {[
              {
                title: "Jewelry",
                image:
                  "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=1200&auto=format&fit=crop",
              },
              {
                title: "Electronics",
                image:
                  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop",
              },
              {
                title: "Collectibles",
                image:
                  "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?q=80&w=1200&auto=format&fit=crop",
              },
              {
                title: "Liquidation",
                image:
                  "https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=1200&auto=format&fit=crop",
              },
            ].map((category) => (

              <div
                key={category.title}
                className="group relative rounded-3xl overflow-hidden h-[320px]"
              >

                <img
                  src={category.image}
                  alt={category.title}
                  className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition duration-500"
                />

                <div className="absolute inset-0 bg-black/40" />

                <div className="relative h-full flex flex-col justify-end p-8 text-white">

                  <h3 className="text-3xl font-semibold">
                    {category.title}
                  </h3>

                  <p className="mt-3 text-sm text-white/80">
                    Explore LIVE auctions and exclusive deals.
                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* MARKETPLACE AUCTIONS */}
      <section className="bg-white">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-24">

          <div className="flex items-center justify-between mb-12">

            <h2 className="text-4xl font-semibold">
              LIVE Marketplace Auctions
            </h2>

            <Link
              href="/marketplace-auctions"
              className="text-sm font-medium"
            >
              View all →
            </Link>

          </div>

          {marketplaceAuctions.length === 0 ? (

            <div className="border rounded-3xl p-16 text-center">

              <h3 className="text-3xl font-semibold">
                No Marketplace Auctions Yet
              </h3>

              <p className="mt-4 text-gray-600">
                Be the first seller to launch a LIVE auction.
              </p>

            </div>

          ) : (

            <div className="grid md:grid-cols-3 gap-10">

              {marketplaceAuctions.map(
                (auction) => (

                  <Link
                    key={auction.id}
                    href={`/marketplace-auctions/${auction.id}`}
                    className="group border rounded-3xl overflow-hidden hover:shadow-xl transition"
                  >

                    <div className="relative h-72 overflow-hidden">

                      <img
                        src={
                          auction.coverImage ||
                          "https://images.unsplash.com/photo-1607082350899-7e105aa886ae?q=80&w=1600&auto=format&fit=crop"
                        }
                        alt={auction.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
                      />

                      <div className="absolute top-5 left-5">

                        <span className="px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-red-600 text-white">
                          LIVE
                        </span>

                      </div>

                    </div>

                    <div className="p-7">

                      <div className="flex items-center justify-between gap-4 mb-4">

                        <span className="px-3 py-1 rounded-full bg-black text-white text-xs font-medium">
                          {auction.category}
                        </span>

                        <span className="text-sm text-gray-500">
                          ACTIVE
                        </span>

                      </div>

                      <h3 className="text-2xl font-semibold">
                        {auction.title}
                      </h3>

                      <div className="mt-6 flex items-center gap-3">

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

                          <p className="font-medium">
                            {auction.seller.name ||
                              "Marketplace Seller"}
                          </p>

                          {auction.seller
                            .tiktokUsername && (

                            <p className="text-sm text-gray-500">
                              {
                                auction.seller
                                  .tiktokUsername
                              }
                            </p>

                          )}

                        </div>

                      </div>

                      <div className="mt-6">

                        <p className="text-sm text-gray-500 mb-1">
                          Current Bid
                        </p>

                        <p className="text-3xl font-semibold">
                          $
                          {auction.currentBid?.toLocaleString()}
                        </p>

                      </div>

                    </div>

                  </Link>

                )
              )}

            </div>

          )}

        </div>

      </section>

      {/* SELL CTA */}
      <section className="border-t">

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-24 md:py-28 text-center">

          <h2 className="text-4xl md:text-5xl font-semibold leading-tight">
            Turn Your Inventory Into
            <br />
            LIVE Sales
          </h2>

          <p className="mt-8 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Reach engaged buyers through
            high-energy LIVE auctions and
            real-time bidding experiences.
          </p>

          <div className="mt-12">

            <Link
              href="/coming-soon"
              className="px-10 py-5 bg-black text-white rounded-full"
            >
              Become a Seller
            </Link>

          </div>

        </div>

      </section>

      {/* REAL ESTATE */}
      <section className="bg-gray-50 border-t">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-24">

          <div className="max-w-3xl">

            <p className="text-sm font-medium text-gray-500 uppercase tracking-[0.18em] mb-6">
              Real Estate Auctions
            </p>

            <h2 className="text-4xl md:text-5xl font-semibold leading-tight">
              Explore Investment Properties
            </h2>

            <p className="mt-8 text-lg md:text-xl text-gray-600">
              Browse distressed properties,
              off-market opportunities,
              and seller-direct real estate
              auctions.
            </p>

            <div className="mt-12">

              <Link
                href="/real-estate"
                className="px-10 py-5 bg-black text-white rounded-full"
              >
                Explore Real Estate
              </Link>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}