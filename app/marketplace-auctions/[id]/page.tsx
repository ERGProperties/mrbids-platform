import { prisma } from "@/lib/prisma";

import { notFound } from "next/navigation";

export default async function MarketplaceAuctionPage({
  params,
}: {
  params: {
    id: string;
  };
}) {

  const auction =
    await prisma.marketplaceAuction.findUnique({
      where: {
        id: params.id,
      },
      include: {
        seller: true,
      },
    });

  if (!auction) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white">

      <section className="max-w-7xl mx-auto px-6 pt-24 pb-24">

        <div className="grid lg:grid-cols-2 gap-14">

          {/* IMAGE */}
          <div>

            {auction.coverImage ? (

              <img
                src={auction.coverImage}
                alt={auction.title}
                className="w-full rounded-3xl border"
              />

            ) : (

              <div className="aspect-square rounded-3xl bg-gray-100" />

            )}

          </div>

          {/* DETAILS */}
          <div>

            <div className="mb-6">

              <span className="inline-flex px-4 py-2 rounded-full bg-black text-white text-sm font-medium">
                {auction.category}
              </span>

            </div>

            <h1 className="text-5xl font-semibold leading-tight">
              {auction.title}
            </h1>

            <div className="mt-8 space-y-6">

              <div>

                <p className="text-sm text-gray-500 mb-2">
                  Seller
                </p>

                <div className="flex items-center gap-4">

                  {auction.seller.avatarUrl ? (

                    <img
                      src={
                        auction.seller.avatarUrl
                      }
                      alt={
                        auction.seller.name ||
                        "Seller"
                      }
                      className="w-14 h-14 rounded-full object-cover border"
                    />

                  ) : (

                    <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center font-semibold text-gray-500">
                      {auction.seller.name?.charAt(0) ||
                        "M"}
                    </div>

                  )}

                  <div>

                    <p className="font-semibold text-lg">
                      {auction.seller.name ||
                        "Marketplace Seller"}
                    </p>

                    {auction.seller
                      .tiktokUsername && (

                      <p className="text-gray-500">
                        {
                          auction.seller
                            .tiktokUsername
                        }
                      </p>

                    )}

                  </div>

                </div>

              </div>

              <div>

                <p className="text-sm text-gray-500 mb-2">
                  Current Bid
                </p>

                <p className="text-5xl font-semibold">
                  $
                  {auction.currentBid?.toLocaleString()}
                </p>

              </div>

              <div>

                <p className="text-sm text-gray-500 mb-3">
                  Description
                </p>

                <div className="text-lg text-gray-700 leading-relaxed border rounded-2xl p-6">
                  {auction.description ||
                    "No description provided."}
                </div>

              </div>

              {/* BID BUTTON */}
              <button className="w-full py-5 rounded-full bg-black text-white font-medium hover:opacity-90 transition">
                Place Bid
              </button>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}