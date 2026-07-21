import MarketplaceAuctionCard from "@/components/MarketplaceAuctionCard";
import AppDownloadSection from "@/components/AppDownloadBanner";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CollectorsPage() {
  const liveAuctions = await prisma.marketplaceAuction.findMany({
    where: {
      status: "LIVE",
      category: {
        equals: "collectibles",
        mode: "insensitive",
      },
    },
    orderBy: {
      endAt: "asc",
    },
    include: {
      seller: true,
      bids: true,
    },
  });

  const featuredAuction = liveAuctions[0] ?? null;

const remainingAuctions = liveAuctions.filter(
  (auction) => auction.id !== featuredAuction?.id
);

const sportsCards = liveAuctions.filter(
  (auction) => auction.subcategory === "Sports Cards"
);

const pokemon = liveAuctions.filter(
  (auction) => auction.subcategory === "Pokémon"
);

const comics = liveAuctions.filter(
  (auction) => auction.subcategory === "Comics"
);

const memorabilia = liveAuctions.filter(
  (auction) => auction.subcategory === "Memorabilia"
);

const coins = liveAuctions.filter(
  (auction) => auction.subcategory === "Coins"
);

const toys = liveAuctions.filter(
  (auction) => auction.subcategory === "Toys"
);

const tradingCardGames = liveAuctions.filter(
  (auction) => auction.subcategory === "Trading Card Games"
);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-20">

        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-500 mb-6">
          MrBids Collectors
        </p>

        <h1 className="text-5xl md:text-7xl font-bold leading-tight max-w-4xl">
          Where Collectors Compete for Rare Finds
        </h1>

        <p className="mt-8 max-w-2xl text-xl text-zinc-400 leading-relaxed">
          Discover unique collectibles, bid against fellow enthusiasts,
          and uncover incredible deals on sports cards, Pokémon,
          comics, memorabilia, toys, and more.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">

<Link
  href="#live-auctions"
  className="rounded-full bg-red-600 px-8 py-4 font-semibold transition hover:bg-red-500"
>
  Explore Featured Collections
</Link>

<Link
  href="/marketplace-auctions?category=collectibles"
  className="rounded-full border border-zinc-700 px-8 py-4 font-semibold transition hover:border-white"
>
  Browse All Collectible Auctions
</Link>

        </div>

        {featuredAuction && (
          <div className="mt-16 overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 shadow-2xl">

            <div className="grid lg:grid-cols-2">

              <div className="relative">

                <img
                  src={featuredAuction.coverImage}
                  alt={featuredAuction.title}
                  className="h-full w-full object-cover aspect-square lg:aspect-auto"
                />

                <div className="absolute left-6 top-6 rounded-full bg-red-600 px-4 py-2 text-sm font-bold uppercase tracking-wider">
                  🔥 Featured Auction
                </div>

              </div>

              <div className="flex flex-col justify-center p-8 lg:p-12">

                <p className="text-sm uppercase tracking-[0.25em] text-red-500">
                  Live Now
                </p>

                <h2 className="mt-3 text-3xl md:text-5xl font-bold leading-tight">
                  {featuredAuction.title}
                </h2>

                <p className="mt-6 text-lg text-zinc-400">
                  Listed by{" "}
                  <span className="font-semibold text-white">
                    {featuredAuction.seller.username}
                  </span>
                </p>

                <div className="mt-10 grid grid-cols-2 gap-8">

                  <div>

                    <p className="text-sm uppercase tracking-wider text-zinc-500">
                      Current Bid
                    </p>

                    <p className="mt-2 text-4xl font-bold text-green-400">
                      ${featuredAuction.currentBid.toLocaleString()}
                    </p>

                  </div>

                  <div>

                    <p className="text-sm uppercase tracking-wider text-zinc-500">
                      Ends
                    </p>

                    <p className="mt-2 text-lg font-semibold">
                      {new Date(featuredAuction.endAt).toLocaleString()}
                    </p>

                  </div>

                </div>

                <div className="mt-12 flex flex-wrap gap-4">

                  <Link
                    href={`/marketplace-auctions/${featuredAuction.id}`}
                    className="rounded-full bg-red-600 px-8 py-4 font-semibold transition hover:bg-red-500"
                  >
                    Place Bid
                  </Link>

                  <Link
                    href="#live-auctions"
                    className="rounded-full border border-zinc-700 px-8 py-4 font-semibold transition hover:border-white"
                  >
                    Browse All Collectible Auctions
                  </Link>

                </div>

              </div>

            </div>

          </div>
        )}

      </section>

      {/* LIVE AUCTIONS */}
      <section
        id="live-auctions"
        className="max-w-7xl mx-auto px-6 pb-24"
      >

        <div className="mb-10">

          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-500">
            Happening Now
          </p>

          <h2 className="mt-3 text-5xl font-bold">
            Live Collector Auctions
          </h2>

        </div>

        {liveAuctions.length === 0 ? (

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-16 text-center">

            <h3 className="text-3xl font-bold">
              No Live Collector Auctions
            </h3>

            <p className="mt-5 text-zinc-400">
              Be the first collector to launch an auction on MrBids.
            </p>

            <Link
              href="/marketplace-sell"
              className="mt-8 inline-flex rounded-full bg-red-600 px-8 py-4 font-semibold transition hover:bg-red-500"
            >
              Start Selling
            </Link>

          </div>

        ) : (

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

{remainingAuctions.map((auction) => (
  <MarketplaceAuctionCard
    key={auction.id}
    auction={auction}
  />
))}

          </div>

        )}

      </section>

{/* COLLECTOR CATEGORIES */}
<section className="max-w-7xl mx-auto px-6 py-24">

  <div className="mb-16">

    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-500">
      Explore Collections
    </p>

    <h2 className="mt-3 text-5xl font-bold">
      Shop by Category
    </h2>

<p className="mt-6 max-w-3xl text-xl text-zinc-400">
  Browse live auctions organized by collecting interests. As the MrBids
  community grows, each category will feature hundreds of unique items
  from collectors across the country.
</p>

  </div>

  {[
    {
      title: "🏈 Sports Cards",
      auctions: sportsCards,
    },
    {
      title: "⚡ Pokémon",
      auctions: pokemon,
    },
    {
      title: "🦸 Comics",
      auctions: comics,
    },
  ].map((section) => (

    <div key={section.title} className="mb-20">

<div className="flex items-center justify-between mb-8">

  <h3 className="text-3xl font-bold">
    {section.title}
  </h3>

  <Link
    href="/marketplace-auctions?category=collectibles"
    className="text-red-400 hover:text-red-300 font-semibold"
  >
    View All →
  </Link>

</div>

      {section.auctions.length === 0 ? (

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-zinc-400">
          Auctions coming soon.
        </div>

      ) : (

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

          {section.auctions.slice(0, 3).map((auction) => (
            <MarketplaceAuctionCard
              key={auction.id}
              auction={auction}
            />
          ))}

        </div>

      )}

    </div>

  ))}

</section>

      {/* SELL CTA */}
      <section className="max-w-5xl mx-auto px-6 py-24 text-center">

        <h2 className="text-5xl font-bold">
          Have a Collection to Sell?
        </h2>

        <p className="mt-6 text-xl text-zinc-400">
          Turn your collectibles into exciting competitive auctions and reach buyers across the country.
        </p>

        <Link
          href="/marketplace-sell"
          className="mt-10 inline-flex rounded-full bg-red-600 px-10 py-5 text-lg font-semibold transition hover:bg-red-500"
        >
          Start Selling Today
        </Link>

      </section>

      <AppDownloadSection />

    </main>
  );
}