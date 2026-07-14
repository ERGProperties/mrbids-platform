import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

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
        where: {
          status: "LIVE",
        },
        orderBy: {
          endAt: "asc",
        },
        take: 12,
      },
    },
  });

  if (!user) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50">

      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* HEADER */}

        <div className="rounded-3xl border bg-white shadow-sm overflow-hidden">

          {/* Banner */}

          <div className="h-44 bg-gradient-to-r from-black via-gray-900 to-gray-800" />

          <div className="px-8 pb-10">

            <div className="-mt-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">

              <div className="flex items-end gap-6">

                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name ?? username}
                    className="w-32 h-32 rounded-full border-4 border-white object-cover bg-white"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200" />
                )}

                <div className="pb-2">

                  <div className="flex items-center gap-3">

                    <h1 className="text-4xl font-bold">
                      @{user.username}
                    </h1>

                    {user.username === "mrbids" && (
                      <span className="rounded-full bg-blue-600 text-white text-xs font-semibold px-3 py-1">
                        OFFICIAL
                      </span>
                    )}

                  </div>

                  {user.name && (
                    <p className="mt-1 text-xl text-gray-700">
                      {user.name}
                    </p>
                  )}

                  {user.sellerCategory && (
                    <p className="mt-2 uppercase tracking-wider text-sm text-gray-500">
                      {user.sellerCategory}
                    </p>
                  )}

                </div>

              </div>

            </div>

            {/* Stats */}

            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6 border-t pt-8">

              <div>
                <p className="text-3xl font-bold">
                  {user.marketplaceAuctions.length}
                </p>

                <p className="text-gray-500 text-sm mt-1">
                  Live Auctions
                </p>
              </div>

              <div>
                <p className="text-3xl font-bold">
                  {new Date(user.createdAt).getFullYear()}
                </p>

                <p className="text-gray-500 text-sm mt-1">
                  Member Since
                </p>
              </div>

              <div>
                <p className="text-3xl font-bold">
                  0
                </p>

                <p className="text-gray-500 text-sm mt-1">
                  Completed Sales
                </p>
              </div>

              <div>
                <p className="text-3xl font-bold">
                  —
                </p>

                <p className="text-gray-500 text-sm mt-1">
                  Followers
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

          {user.marketplaceAuctions.length === 0 ? (

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

              {user.marketplaceAuctions.map((auction) => (

                <div
                  key={auction.id}
                  className="rounded-3xl overflow-hidden border bg-white shadow-sm hover:shadow-lg transition"
                >

                  {auction.coverImage ? (

                    <img
                      src={auction.coverImage}
                      alt={auction.title}
                      className="aspect-square w-full object-cover"
                    />

                  ) : (

                    <div className="aspect-square bg-gray-200" />

                  )}

                  <div className="p-6">

                    <h3 className="font-semibold text-lg line-clamp-2">
                      {auction.title}
                    </h3>

                    <div className="mt-4 flex justify-between text-sm">

                      <span className="text-gray-500">
                        Current Bid
                      </span>

                      <span className="font-bold">
                        ${auction.currentBid}
                      </span>

                    </div>

                    <div className="mt-6">

                      <Link
                        href={`/marketplace-auctions/${auction.id}`}
                        className="block text-center rounded-xl bg-black text-white py-3 font-medium hover:opacity-90 transition"
                      >
                        View Auction
                      </Link>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </main>
  );
}