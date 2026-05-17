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
            createdAt:
              "desc",
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

        <AuctionClient
          initialAuction={auction}
        />

      </section>

    </main>
  );
}