import { prisma } from "@/lib/prisma";

import { notFound } from "next/navigation";

import AuctionClient from "./AuctionClient";

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

        bids: {
          include: {
            bidder: true,
          },

          orderBy: {
            createdAt: "desc",
          },

          take: 10,
        },
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

          {/* CLIENT COMPONENT */}
          <AuctionClient initialAuction={auction} />

        </div>

      </section>

    </main>
  );
}