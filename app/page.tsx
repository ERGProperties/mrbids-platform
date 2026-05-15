export const dynamic = "force-dynamic";

import Link from "next/link";
import { getAllAuctions } from "@/lib/repositories/auctionRepository";

const fallbackAuctions = [
  {
    id: "1",
    title: "Luxury Jewelry Auction",
    viewers: "214 viewers",
    status: "Ending Soon",
    image:
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "Sneaker Heat Drop",
    viewers: "487 viewers",
    status: "LIVE NOW",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "3",
    title: "Electronics Liquidation",
    viewers: "352 viewers",
    status: "Hot Bidding",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop",
  },
];

const activityFeed = [
  "Luxury watch sold for $2,450",
  "Storage unit auction reached 128 bids",
  "Sneaker drop attracted 487 LIVE viewers",
  "Gold chain auction ended in 3 minutes",
  "Electronics liquidation sold out LIVE",
];

function getPrimaryImage(auction: any) {
  if (
    typeof auction?.coverImage === "string" &&
    auction.coverImage.startsWith("http")
  ) {
    return auction.coverImage;
  }

  if (!Array.isArray(auction?.images)) return null;

  const first = auction.images.find(
    (img: unknown) =>
      typeof img === "string" && img.startsWith("http")
  );

  return first || null;
}

export default async function HomePage() {

  let auctions: any[] = [];

  try {
    const result = await getAllAuctions();
    auctions = Array.isArray(result) ? result : [];
  } catch (err) {
    console.error("Failed loading auctions:", err);
  }

  const liveAuctions =
    auctions.length > 0
      ? auctions.slice(0, 3).map((auction) => ({
          id: auction.id,
          title: auction.title || "LIVE Auction",
          viewers: "LIVE Bidding",
          status: "LIVE NOW",
          image:
            getPrimaryImage(auction) ||
            "https://images.unsplash.com/photo-1607082350899-7e105aa886ae?q=80&w=1600&auto=format&fit=crop",
          slug: auction.slug,
        }))
      : fallbackAuctions;

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
              Discover jewelry, electronics, collectibles,
              liquidation deals, real estate, and rare finds during
              fast-paced LIVE auctions.
            </p>

            <div className="mt-10 md:mt-14 flex flex-col sm:flex-row gap-4">

              <Link
                href="/live"
                className="w-full sm:w-auto text-center px-8 md:px-10 py-4 md:py-5 bg-black text-white rounded-full"
              >
                Watch Live Auctions
              </Link>

              <Link
                href="/coming-soon"
                className="w-full sm:w-auto text-center px-8 md:px-10 py-4 md:py-5 border rounded-full"
              >
                Start Selling
              </Link>

            </div>

            <div className="mt-12 md:mt-14 grid grid-cols-3 gap-6">

              <div>
                <p className="text-2xl md:text-4xl font-semibold">
                  10K+
                </p>

                <p className="mt-2 text-xs md:text-sm text-gray-500">
                  LIVE Bidders
                </p>
              </div>

              <div>
                <p className="text-2xl md:text-4xl font-semibold">
                  $1M+
                </p>

                <p className="mt-2 text-xs md:text-sm text-gray-500">
                  Auction Volume
                </p>
              </div>

              <div>
                <p className="text-2xl md:text-4xl font-semibold">
                  Daily
                </p>

                <p className="mt-2 text-xs md:text-sm text-gray-500">
                  LIVE Events
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

              <div className="absolute top-4 md:top-6 left-4 md:left-6">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-600 text-white text-xs md:text-sm font-semibold">
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  LIVE NOW
                </div>
              </div>

              <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 right-4 md:right-6 bg-white rounded-3xl p-4 md:p-6 shadow-xl">

                <div className="flex items-center justify-between gap-4">

                  <div>
                    <p className="text-xs md:text-sm text-gray-500">
                      Current Auction
                    </p>

                    <h3 className="mt-1 md:mt-2 text-lg md:text-2xl font-semibold">
                      Luxury Jewelry Drop
                    </h3>
                  </div>

                  <div className="text-right">
                    <p className="text-xs md:text-sm text-gray-500">
                      Current Bid
                    </p>

                    <p className="mt-1 md:mt-2 text-xl md:text-3xl font-semibold">
                      $1,250
                    </p>
                  </div>

                </div>

                <button className="w-full mt-4 md:mt-6 py-3 md:py-4 bg-black text-white rounded-full font-medium text-sm md:text-base">
                  Join LIVE Auction
                </button>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ACTIVITY FEED */}
      <section className="border-y bg-black text-white overflow-hidden">

        <div className="flex gap-10 md:gap-16 whitespace-nowrap py-4 md:py-5 px-4 sm:px-6 animate-pulse">

          {activityFeed.map((item, index) => (

            <div
              key={index}
              className="text-xs md:text-sm font-medium"
            >
              🔥 {item}
            </div>

          ))}

        </div>

      </section>

      {/* CATEGORIES */}
      <section className="border-b bg-gray-50">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-24">

          <div className="flex items-center justify-between mb-10 md:mb-14">

            <h2 className="text-3xl md:text-4xl font-semibold">
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
                className="group relative rounded-3xl overflow-hidden h-[260px] md:h-[320px]"
              >

                <img
                  src={category.image}
                  alt={category.title}
                  className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition duration-500"
                />

                <div className="absolute inset-0 bg-black/40" />

                <div className="relative h-full flex flex-col justify-end p-6 md:p-8 text-white">

                  <h3 className="text-2xl md:text-3xl font-semibold">
                    {category.title}
                  </h3>

                  <p className="mt-2 md:mt-3 text-xs md:text-sm text-white/80">
                    Explore LIVE auctions and exclusive deals.
                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* LIVE NOW */}
      <section className="bg-white">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-24">

          <div className="flex items-center justify-between mb-10 md:mb-12">

            <h2 className="text-3xl md:text-4xl font-semibold">
              LIVE Now
            </h2>

            <Link
              href="/live"
              className="text-sm font-medium"
            >
              View all →
            </Link>

          </div>

          <div className="grid md:grid-cols-3 gap-10">

            {liveAuctions.map((auction) => (

              <div
                key={auction.id}
                className="group border rounded-3xl overflow-hidden hover:shadow-xl transition"
              >

                <div className="relative h-72 overflow-hidden">

                  <img
                    src={auction.image}
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

                  <h3 className="text-2xl font-semibold">
                    {auction.title}
                  </h3>

                  <div className="mt-5 flex items-center justify-between text-sm">

                    <span className="font-medium">
                      {auction.viewers}
                    </span>

                    <span className="text-gray-500">
                      {auction.status}
                    </span>

                  </div>

                  <Link
                    href={
                      auction.slug
                        ? `/real-estate/auctions/${auction.slug}`
                        : "/live"
                    }
                    className="inline-block mt-6 px-6 py-3 bg-black text-white rounded-full text-sm"
                  >
                    Join LIVE Auction
                  </Link>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* FEATURED AUCTIONS */}
      <section className="border-t bg-gray-50">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-24">

          <div className="flex items-center justify-between mb-10 md:mb-12">

            <h2 className="text-3xl md:text-4xl font-semibold">
              Featured Auctions
            </h2>

            <Link
              href="/real-estate"
              className="text-sm font-medium"
            >
              Browse all →
            </Link>

          </div>

          <div className="grid md:grid-cols-3 gap-10">

            {auctions.slice(0, 6).map((auction) => (

              <div
                key={auction.id}
                className="group bg-white border rounded-3xl overflow-hidden hover:shadow-xl transition"
              >

                <div className="relative h-72 overflow-hidden">

                  <img
                    src={
                      getPrimaryImage(auction) ||
                      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1200&auto=format&fit=crop"
                    }
                    alt={auction.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
                  />

                  <div className="absolute top-5 left-5">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-black text-white">
                      FEATURED
                    </span>
                  </div>

                </div>

                <div className="p-7">

                  <h3 className="text-2xl font-semibold">
                    {auction.title || "Auction Listing"}
                  </h3>

                  <p className="mt-3 text-sm text-gray-500">
                    {auction.cityStateZip || "Marketplace Auction"}
                  </p>

                  <div className="mt-6 flex items-center justify-between">

                    <div>
                      <p className="text-xs text-gray-500">
                        Starting Bid
                      </p>

                      <p className="text-xl font-semibold">
                        {auction.startingBid
                          ? `$${Number(auction.startingBid).toLocaleString()}`
                          : "$1"}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        Status
                      </p>

                      <p className="text-sm font-medium">
                        {auction.status || "LIVE"}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/real-estate/auctions/${auction.slug}`}
                    className="inline-block mt-8 px-6 py-3 bg-black text-white rounded-full text-sm"
                  >
                    View Auction
                  </Link>

                </div>

              </div>

            ))}

          </div>

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
            Reach engaged buyers through high-energy LIVE auctions and
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
              Browse distressed properties, off-market opportunities,
              and seller-direct real estate auctions.
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