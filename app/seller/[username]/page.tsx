import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import MarketplaceAuctionCard from "@/components/MarketplaceAuctionCard";

type Props = {
  params: {
    username: string;
  };
};

export default async function SellerStorefront({
  params,
}: Props) {
  const username = params.username.toLowerCase();

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
    include: {
  marketplaceAuctions: {
    orderBy: {
      createdAt: "desc",
    },
    include: {
      seller: true,
    },
  },
},
  });

  if (!user) {
    notFound();
  }

const liveAuctions = user.marketplaceAuctions
  .filter(
    (auction) => auction.status === "LIVE"
  )
  .sort((a, b) => {
    if (!a.endAt || !b.endAt) return 0;

    return (
      new Date(a.endAt).getTime() -
      new Date(b.endAt).getTime()
    );
  });

const completedSales = user.marketplaceAuctions.filter(
  (auction) =>
    auction.status === "ENDED" &&
    auction.winnerId
).length;

const totalAuctions = user.marketplaceAuctions.length;

const totalBids = user.marketplaceAuctions.reduce(
  (sum, auction) => sum + (auction.bidCount ?? 0),
  0
);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* HEADER */}

        <div className="rounded-3xl border bg-white shadow-sm overflow-hidden">

          {/* Banner */}

          <div className="h-44 bg-gradient-to-r from-black via-gray-900 to-gray-800" />

          <div className="px-8 pb-10">

<div className="-mt-16 flex justify-center">

  <div className="flex flex-col items-center">

    {user.avatarUrl ? (
      <img
        src={user.avatarUrl}
        alt={user.name ?? username}
        className="w-36 h-36 rounded-full border-4 border-white object-cover bg-white"
      />
    ) : (
      <div className="w-36 h-36 rounded-full border-4 border-white bg-gray-200" />
    )}

    <div className="mt-4 text-center">

      <h1 className="text-3xl sm:text-4xl font-bold">
        @{user.username}
      </h1>

      {user.username === "mrbids" && (
        <div className="mt-3">
          <span className="inline-flex rounded-full bg-blue-600 px-4 py-1 text-xs font-semibold tracking-wide text-white">
            OFFICIAL
          </span>
        </div>
      )}

      {user.name && (
        <p className="mt-4 text-xl text-gray-700">
          {user.name}
        </p>
      )}

      <p className="mt-2 text-sm text-gray-500">
        Member since {new Date(user.createdAt).getFullYear()}
      </p>

      {user.sellerCategory && (
        <div className="mt-5">
          <span className="inline-flex rounded-full bg-black px-5 py-2 text-sm font-medium text-white">
            {user.sellerCategory}
          </span>
        </div>
      )}

    </div>

  </div>

</div>

            {/* Stats */}

<div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-6 border-t pt-6">

  <div>
    <p className="text-3xl font-bold">
      {liveAuctions.length}
    </p>

    <p className="text-gray-500 text-sm mt-1">
      Live Auctions
    </p>
  </div>

  <div>
    <p className="text-3xl font-bold">
      {completedSales}
    </p>

    <p className="text-gray-500 text-sm mt-1">
      Completed Sales
    </p>
  </div>

  <div>
    <p className="text-3xl font-bold">
      {totalBids}
    </p>

    <p className="text-gray-500 text-sm mt-1">
      Total Bids
    </p>
  </div>

  <div>
  <p className="text-3xl font-bold">
    {totalAuctions}
  </p>

  <p className="text-gray-500 text-sm mt-1">
    Total Auctions
  </p>
</div>

</div>

            {/* About */}

            {user.sellerBio && (

              <div className="mt-10 border-t pt-8">

                <h2 className="text-xl font-semibold mb-4">
                  About This Seller
                </h2>

                <p className="text-lg text-gray-700 leading-8">
                  {user.sellerBio}
                </p>

              </div>

            )}

          </div>

        </div>

        {/* Auctions */}

        <div className="mt-12">

          <div className="flex items-center justify-between mb-6">

            <h2 className="text-3xl font-bold">
              Live Auctions
            </h2>

          </div>

          {liveAuctions.length === 0 ? (

            <div className="rounded-3xl border bg-white p-16 text-center">

              <h3 className="text-2xl font-semibold">
                No Live Auctions
              </h3>

              <p className="mt-4 text-gray-500">
                This seller doesn't have any live auctions at the moment.
              </p>

            </div>

          ) : (

<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

  {liveAuctions.map((auction) => (

    <MarketplaceAuctionCard
      key={auction.id}
      auction={auction}
    />

  ))}

</div>

          )}

        </div>

      </div>

    </main>
  );
}