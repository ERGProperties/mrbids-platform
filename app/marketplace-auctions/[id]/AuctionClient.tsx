"use client";

import {
  useEffect,
  useState,
} from "react";

import useSWR, {
  mutate,
} from "swr";

import CountdownTimer from "@/components/CountdownTimer";

import { pusherClient } from "@/lib/pusher-client";

const fetcher = (
  url: string
) =>
  fetch(url).then((res) =>
    res.json()
  );

export default function AuctionClient({
  initialAuction,
  isSeller,
}: {
  initialAuction: any;
  isSeller: boolean;
}) {

  const {
    data: auction,
  } = useSWR(
    `/api/marketplace-auctions/${initialAuction.id}/live`,
    fetcher,
    {
      fallbackData:
        initialAuction,
    }
  );

  const [
    selectedImage,
    setSelectedImage,
  ] = useState(0);

  const [
    amount,
    setAmount,
  ] = useState(
    auction.currentBid > 0
      ? auction.currentBid +
          auction.bidIncrement
      : auction.startingBid
  );

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    success,
    setSuccess,
  ] = useState("");

  const [
    statusLoading,
    setStatusLoading,
  ] = useState(false);

  const [
    viewerCount,
    setViewerCount,
  ] = useState(0);

  const [
    reactions,
    setReactions,
  ] = useState<any[]>([]);

  useEffect(() => {

    const channel =
      pusherClient.subscribe(
        `presence-auction-${initialAuction.id}`
      );

    channel.bind(
      "pusher:subscription_succeeded",
      (members: any) => {

        setViewerCount(
          members.count
        );

      }
    );

    channel.bind(
      "pusher:member_added",
      () => {

        setViewerCount(
          (prev) => prev + 1
        );

      }
    );

    channel.bind(
      "pusher:member_removed",
      () => {

        setViewerCount(
          (prev) =>
            Math.max(prev - 1, 0)
        );

      }
    );

    channel.bind(
      "new-bid",
      (updatedAuction: any) => {

        mutate(
          `/api/marketplace-auctions/${initialAuction.id}/live`,
          updatedAuction,
          false
        );

      }
    );

    channel.bind(
      "auction-ended",
      (updatedAuction: any) => {

        mutate(
          `/api/marketplace-auctions/${initialAuction.id}/live`,
          updatedAuction,
          false
        );

      }
    );

    channel.bind(
      "auction-updated",
      (updatedAuction: any) => {

        mutate(
          `/api/marketplace-auctions/${initialAuction.id}/live`,
          updatedAuction,
          false
        );

      }
    );

    return () => {

      channel.unbind_all();

      pusherClient.unsubscribe(
        `presence-auction-${initialAuction.id}`
      );

    };

  }, [initialAuction.id]);

  useEffect(() => {

    if (!auction) return;

    setAmount(
      auction.currentBid > 0
        ? auction.currentBid +
            auction.bidIncrement
        : auction.startingBid
    );

  }, [
    auction.currentBid,
    auction.bidIncrement,
    auction.startingBid,
  ]);

  async function handleBid() {

    try {

      setLoading(true);

      setError("");

      setSuccess("");

      const response =
        await fetch(
          `/api/marketplace-auctions/${auction.id}/bid`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              amount,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {

        setError(
          data.error ||
          "Failed to place bid"
        );

        return;
      }

      setSuccess(
        "Bid placed successfully!"
      );

    } catch (err) {

      console.error(err);

      setError(
        "Something went wrong"
      );

    } finally {

      setLoading(false);

    }
  }

  async function updateStatus(
    status: string
  ) {

    try {

      setStatusLoading(true);

      setError("");

      setSuccess("");

      const response =
        await fetch(
          `/api/marketplace-auctions/${auction.id}/status`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              status,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {

        setError(
          data.error ||
          "Failed to update auction"
        );

        return;
      }

      if (
        status === "LIVE"
      ) {

        setSuccess(
          `🎉 Your auction is LIVE!\n\nShare this link:\n${window.location.href}`
        );

      } else {

        setSuccess(
          "Auction updated successfully!"
        );

      }

    } catch (err) {

      console.error(err);

      setError(
        "Something went wrong"
      );

    } finally {

      setStatusLoading(false);

    }
  }

  async function endAuction() {

    try {

      await fetch(
        `/api/marketplace-auctions/${auction.id}/end`,
        {
          method: "POST",
        }
      );

    } catch (error) {

      console.error(error);

    }
  }

  const minimumBid =
    auction.currentBid > 0
      ? auction.currentBid +
        auction.bidIncrement
      : auction.startingBid;

  return (
    <>

      {/* REACTIONS */}
      <div className="fixed bottom-10 right-6 pointer-events-none z-50 space-y-2">

        {reactions.map(
          (reaction) => (

            <div
              key={reaction.id}
              className="text-4xl animate-bounce"
            >
              {reaction.emoji}
            </div>

          )
        )}

      </div>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-14">

        {/* LEFT SIDE */}
        <div>

          {/* MAIN IMAGE */}
          <div className="relative">

            {auction.images?.length > 0 ? (

              <img
                src={
                  auction.images[
                    selectedImage
                  ]
                }
                alt={auction.title}
                className="w-full rounded-3xl border object-cover aspect-square max-h-[70vh]"
              />

            ) : (

              <div className="aspect-square rounded-3xl bg-gray-100" />

            )}

            {/* PREVIOUS */}
            {auction.images?.length > 1 && (

              <button
                onClick={() =>
                  setSelectedImage(
                    (prev) =>
                      prev === 0
                        ? auction.images.length - 1
                        : prev - 1
                  )
                }
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/70 text-white text-xl md:text-2xl"
              >
                ←
              </button>

            )}

            {/* NEXT */}
            {auction.images?.length > 1 && (

              <button
                onClick={() =>
                  setSelectedImage(
                    (prev) =>
                      prev ===
                      auction.images.length - 1
                        ? 0
                        : prev + 1
                  )
                }
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/70 text-white text-xl md:text-2xl"
              >
                →

              </button>

            )}

          </div>

          {/* THUMBNAILS */}
          {auction.images?.length > 1 && (

            <div className="flex gap-2 md:gap-3 mt-4 md:mt-5 overflow-x-auto pb-2">

              {auction.images.map(
                (
                  image: string,
                  index: number
                ) => (

                  <button
                    key={index}
                    onClick={() =>
                      setSelectedImage(
                        index
                      )
                    }
                    className={`
                      border rounded-2xl overflow-hidden min-w-[70px] md:min-w-[90px]
                      ${
                        selectedImage === index
                          ? "border-black"
                          : "border-gray-200"
                      }
                    `}
                  >

                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-16 h-16 md:w-24 md:h-24 object-cover"
                    />

                  </button>

                )
              )}

            </div>

          )}

        </div>

        {/* RIGHT SIDE */}
        <div>

          {/* HEADER */}
          <div className="flex flex-wrap items-center gap-3 mb-6">

            <span className="inline-flex px-4 py-2 rounded-full bg-black text-white text-sm font-medium">
              {auction.category}
            </span>

            <span className="inline-flex px-4 py-2 rounded-full bg-red-500 text-white text-sm font-medium">
              {auction.status}
            </span>

          </div>

          {/* TITLE */}
          <h1 className="text-3xl md:text-5xl font-semibold leading-tight">
            {auction.title}
          </h1>

          {/* DESCRIPTION */}
          {auction.description && (

            <div className="mt-6">

              <p className="text-base md:text-lg text-gray-600 leading-relaxed whitespace-pre-wrap">
                {auction.description}
              </p>

            </div>

          )}

          <div className="mt-8 space-y-6">

            {/* SELLER */}
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
                    className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border"
                  />

                ) : (

                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gray-100 flex items-center justify-center font-semibold text-gray-500">
                    {auction.seller.name?.charAt(0) ||
                      "M"}
                  </div>

                )}

                <div>

                  <p className="font-semibold text-base md:text-lg">
                    {auction.seller.name ||
                      "Marketplace Seller"}
                  </p>

                </div>

              </div>

            </div>

            {/* COUNTDOWN */}
            {auction.status === "LIVE" &&
              auction.endAt && (

              <CountdownTimer
                endAt={auction.endAt}
                onExpire={endAuction}
              />

            )}

            {/* SCHEDULED */}
            {auction.status === "SCHEDULED" && (

              <div className="border rounded-2xl p-5 md:p-6 bg-yellow-50 border-yellow-200">

                <p className="text-sm font-medium text-yellow-700 mb-2">
                  Auction Scheduled
                </p>

                <p className="text-yellow-900">
                  Waiting for seller to start LIVE auction.
                </p>

              </div>

            )}

            {/* ENDED */}
            {auction.status === "ENDED" && (

              <div className="border rounded-2xl p-5 md:p-6 bg-gray-100 border-gray-200">

                <p className="text-sm font-medium text-gray-600 mb-2">
                  Auction Ended
                </p>

                <p className="text-gray-900">
                  This auction is no longer accepting bids.
                </p>

              </div>

            )}

            {/* VIEWERS */}
            <div className="border rounded-2xl p-5 md:p-6 bg-black text-white">

              <p className="text-sm text-gray-300 mb-2">
                LIVE Viewers
              </p>

              <p className="text-3xl md:text-4xl font-semibold">
                {viewerCount}
              </p>

            </div>

            {/* CURRENT BID */}
            <div>

              <p className="text-sm text-gray-500 mb-2">
                Current Bid
              </p>

              <p className="text-4xl md:text-5xl font-semibold">
                $
                {auction.currentBid?.toLocaleString()}
              </p>

            </div>

            {/* RETAIL PRICE */}
            {auction.retailPrice && (

              <div className="border rounded-2xl p-5 md:p-6 bg-green-50 border-green-200">

                <p className="text-sm text-green-700 mb-2 font-medium">
                  Retail Price
                </p>

                <p className="text-2xl md:text-3xl font-semibold text-green-900">
                  $
                  {auction.retailPrice.toLocaleString()}
                </p>

                <div className="mt-4">

                  <p className="text-sm text-green-700 mb-1">
                    Current Savings
                  </p>

                  <p className="text-xl md:text-2xl font-semibold text-green-900">

                    $
                    {Math.max(
                      auction.retailPrice -
                        auction.currentBid,
                      0
                    ).toLocaleString()}

                  </p>

                </div>

              </div>

            )}

            {/* MINIMUM BID */}
            <div className="border rounded-2xl p-5 md:p-6">

              <p className="text-sm text-gray-500 mb-2">
                Minimum Bid
              </p>

              <p className="text-2xl md:text-3xl font-semibold">
                $
                {minimumBid.toLocaleString()}
              </p>

            </div>

            {/* BID INPUT */}
            <div>

              <label className="block text-sm text-gray-500 mb-2">
                Your Bid
              </label>

              <input
                type="number"
                value={amount}
                onChange={(e) =>
                  setAmount(
                    Number(
                      e.target.value
                    )
                  )
                }
                disabled={
                  auction.status !== "LIVE"
                }
                className="w-full border rounded-2xl px-5 py-4 text-xl md:text-2xl font-semibold disabled:bg-gray-100"
              />

            </div>

            {/* ERROR */}
            {error && (

              <div className="border border-red-200 bg-red-50 text-red-600 rounded-2xl p-4 whitespace-pre-line">
                {error}
              </div>

            )}

            {/* SUCCESS */}
            {success && (

              <div className="border border-green-200 bg-green-50 text-green-600 rounded-2xl p-4 whitespace-pre-line">
                {success}
              </div>

            )}

            {/* SELLER CONTROLS */}
            {isSeller && (

              <div className="flex flex-col sm:flex-row gap-3">

                <button
                  onClick={() =>
                    updateStatus("LIVE")
                  }
                  disabled={
                    statusLoading ||
                    auction.status === "LIVE"
                  }
                  className="flex-1 py-4 rounded-full bg-green-600 text-white font-medium hover:opacity-90 transition disabled:opacity-50"
                >
                  Start LIVE
                </button>

                <button
                  onClick={() =>
                    updateStatus("ENDED")
                  }
                  disabled={
                    statusLoading ||
                    auction.status === "ENDED"
                  }
                  className="flex-1 py-4 rounded-full bg-gray-900 text-white font-medium hover:opacity-90 transition disabled:opacity-50"
                >
                  End Auction
                </button>

              </div>

            )}

            {/* BID BUTTON */}
            <button
              onClick={handleBid}
              disabled={
                loading ||
                auction.status !== "LIVE"
              }
              className="w-full py-5 rounded-full bg-black text-white font-medium hover:opacity-90 transition disabled:opacity-50"
            >

              {auction.status === "SCHEDULED"
                ? "Waiting For LIVE Start"
                : auction.status === "ENDED"
                ? "Auction Ended"
                : loading
                ? "Placing Bid..."
                : "Place Bid"}

            </button>

          </div>

        </div>

      </div>

    </>
  );
}