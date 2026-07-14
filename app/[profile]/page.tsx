import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

type Props = {
  params: {
    profile: string;
  };
};

export default async function SellerStorefront({
  params,
}: Props) {
  if (!params.profile.startsWith("@")) {
    notFound();
  }

if (!params.profile.startsWith("@")) {
  notFound();
}

  const username = params.profile
    .slice(1)
    .toLowerCase();

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
          createdAt: "desc",
        },
      },
    },
  });

  if (!user) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50">

      <div className="max-w-6xl mx-auto px-6 py-16">

        <div className="bg-white rounded-3xl border shadow-sm p-10">

          <div className="flex items-center gap-6">

            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name ?? username}
                className="w-28 h-28 rounded-full object-cover border"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-gray-200" />
            )}

            <div>

              <h1 className="text-4xl font-bold">
                @{user.username}
              </h1>

              {user.name && (
                <p className="text-xl text-gray-700 mt-1">
                  {user.name}
                </p>
              )}

              {user.sellerCategory && (
                <p className="mt-2 text-sm uppercase tracking-wider text-gray-500">
                  {user.sellerCategory}
                </p>
              )}

            </div>

          </div>

          {user.sellerBio && (
            <p className="mt-8 text-lg text-gray-700 leading-8">
              {user.sellerBio}
            </p>
          )}

        </div>

        <div className="mt-12">

          <h2 className="text-2xl font-bold mb-6">
            Live Auctions
          </h2>

          {user.marketplaceAuctions.length === 0 ? (

            <div className="rounded-2xl border bg-white p-10 text-center text-gray-500">
              No live auctions yet.
            </div>

          ) : (

            <div className="grid md:grid-cols-3 gap-6">

              {user.marketplaceAuctions.map((auction) => (

                <div
                  key={auction.id}
                  className="rounded-2xl border bg-white overflow-hidden"
                >

                  {auction.coverImage && (

                    <img
                      src={auction.coverImage}
                      alt={auction.title}
                      className="w-full aspect-square object-cover"
                    />

                  )}

                  <div className="p-5">

                    <h3 className="font-semibold">
                      {auction.title}
                    </h3>

                    <p className="mt-2 text-gray-600">
                      Current Bid: $
                      {auction.currentBid}
                    </p>

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