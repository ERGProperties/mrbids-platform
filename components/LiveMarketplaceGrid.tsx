"use client";

import { useEffect, useState } from "react";

import Pusher from "pusher-js";

import MarketplaceAuctionCard from "@/components/MarketplaceAuctionCard";

type Auction = {
  id: string;
  title: string;
  currentBid: number | null;
  startingBid: number;
  images?: any;
  endAt?: string;
  seller?: any;
  category?: string;
  retailValue?: number | null;
  status?: string;
};

export default function LiveMarketplaceGrid({
  initialAuctions,
}: {
  initialAuctions: Auction[];
}) {

  const [auctions, setAuctions] =
    useState(initialAuctions);

  useEffect(() => {

    const pusher =
      new Pusher(
        process.env.NEXT_PUBLIC_PUSHER_KEY!,
        {
          cluster:
            process.env
              .NEXT_PUBLIC_PUSHER_CLUSTER!,
        }
      );

    const channel =
      pusher.subscribe(
        "marketplace-auctions"
      );

    channel.bind(
      "new-bid",
      (data: {
        auctionId: string;
        currentBid: number;
      }) => {

        setAuctions((prev) =>
          prev.map((auction) => {

            if (
              auction.id ===
              data.auctionId
            ) {

              return {
                ...auction,
                currentBid:
                  data.currentBid,
              };
            }

            return auction;
          })
        );

      }
    );

    return () => {

      channel.unbind_all();

      channel.unsubscribe();

      pusher.disconnect();

    };

  }, []);

  if (auctions.length === 0) {

    return (

      <div className="border rounded-3xl p-16 text-center">

        <h3 className="text-3xl font-semibold">
          No LIVE Auctions Yet
        </h3>

        <p className="mt-4 text-gray-600">
          Be the first seller to launch a LIVE auction.
        </p>

      </div>

    );
  }

  return (

    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">

      {auctions.map(
        (auction) => (

          <MarketplaceAuctionCard
            key={auction.id}
            auction={auction}
          />

        )
      )}

    </div>

  );
}