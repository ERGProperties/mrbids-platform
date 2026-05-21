export const dynamic = "force-dynamic";

import Link from "next/link";

import { prisma } from "@/lib/prisma";

import { getAllAuctions } from "@/lib/repositories/auctionRepository";

import MarketplaceAuctionCard from "@/components/MarketplaceAuctionCard";

import GoogleAdsConversion from "@/components/GoogleAdsConversion";

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
    <>
      <GoogleAdsConversion />

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

      </main>
    </>
  );
}