import MarketplaceAuctionCard from "@/components/MarketplaceAuctionCard";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SavedPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/signin?callbackUrl=/saved");
  }

  const watchlist = await prisma.watchlist.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      auction: {
        include: {
          seller: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const auctions = watchlist.map((item) => item.auction);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 pt-32 pb-24">

        <div className="max-w-3xl">

          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 mb-8">

            <span className="text-xl">❤️</span>

            <span className="text-sm font-medium text-red-400">
              Your Saved Auctions
            </span>

          </div>

          <h1 className="text-5xl md:text-7xl font-semibold leading-[1.02]">
            Saved
          </h1>

          <p className="mt-8 text-lg md:text-xl text-zinc-400">
            Keep track of auctions you're interested in and jump back before they end.
          </p>

        </div>

      </section>

      {/* GRID */}
      <section className="border-t border-zinc-800">

        <div className="max-w-7xl mx-auto px-6 py-24">

          {auctions.length === 0 ? (

            <div className="border border-zinc-800 rounded-3xl p-16 text-center bg-zinc-900">

              <div className="text-6xl mb-6">
                ❤️
              </div>

              <h2 className="text-3xl font-semibold">
                Nothing Saved Yet
              </h2>

              <p className="mt-4 text-zinc-400 max-w-xl mx-auto">
                Tap the heart on any auction to save it here so you can easily
                find it later before bidding.
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