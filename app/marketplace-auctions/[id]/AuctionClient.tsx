"use client";

import { useState } from "react";

import useSWR from "swr";

import CountdownTimer from "@/components/CountdownTimer";

const fetcher = (
  url: string
) =>
  fetch(url).then((res) =>
    res.json()
  );

export default function AuctionClient({
  initialAuction,
}: {
  initialAuction: any;
}) {

  const {
    data: auction,
  } = useSWR(
    `/api/marketplace-auctions/${initialAuction.id}`,
    fetcher,
    {
      fallbackData:
        initialAuction,

      refreshInterval: 3000,
    }
  );

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

  async function handleBid() {

    try {

      setLoading(true);

      setError("");
      setSuccess("");

      const response = await fetch(
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

      setSuccess(
        "Updated successfully!"
      );

    } catch (err) {

      console.error(err);

      setError(
        "Something went wrong"
      );

    } finally {

      setStatusLoading(false);

    }
  }

  const minimumBid =
    auction.currentBid > 0
      ? auction.currentBid +
        auction.bidIncrement
      : auction.startingBid;

  return (
    <div>

      <div className="flex items-center gap-4 mb-6">

        <span className="inline-flex px-4 py-2 rounded-full bg-black text-white text-sm font-medium">
          {auction.category}
        </span>

        <span className="inline-flex px-4 py-2 rounded-full bg-red-500 text-white text-sm font-medium">
          {auction.status}
        </span>

      </div>

      <h1 className="text-5xl font-semibold leading-tight">
        {auction.title}
      </h1>

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

        {/* COUNTDOWN TIMER */}
        <CountdownTimer endAt={auction.endAt} />

        {/* CURRENT BID */}
        <div>

          <p className="text-sm text-gray-500 mb-2">
            Current Bid
          </p>

          <p className="text-5xl font-semibold">
            $
            {auction.currentBid?.toLocaleString()}
          </p>

          <p className="mt-2 text-sm text-gray-500">
            {auction.bidCount} bids
          </p>

        </div>

        {/* MINIMUM BID */}
        <div className="border rounded-2xl p-6">

          <p className="text-sm text-gray-500 mb-2">
            Minimum Bid
          </p>

          <p className="text-3xl font-semibold">
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
            className="w-full border rounded-2xl px-5 py-4 text-2xl font-semibold outline-none focus:ring-2 focus:ring-black"
          />

        </div>

        {/* ERROR */}
        {error && (

          <div className="border border-red-200 bg-red-50 text-red-600 rounded-2xl p-4">
            {error}
          </div>

        )}

        {/* SUCCESS */}
        {success && (

          <div className="border border-green-200 bg-green-50 text-green-600 rounded-2xl p-4">
            {success}
          </div>

        )}

        {/* BID HISTORY */}
        <div>

          <div className="flex items-center justify-between mb-4">

            <p className="text-sm text-gray-500">
              Recent Bids
            </p>

            <p className="text-sm text-gray-400">
              Live Activity
            </p>

          </div>

          <div className="border rounded-2xl divide-y overflow-hidden">

            {auction.bids.length === 0 ? (

              <div className="p-6 text-gray-500">
                No bids yet.
              </div>

            ) : (

              auction.bids.map(
                (bid: any) => (

                  <div
                    key={bid.id}
                    className="flex items-center justify-between p-5"
                  >

                    <div>

                      <p className="font-medium">
                        {bid.bidder.name ||
                          "Anonymous Bidder"}
                      </p>

                      <p className="text-sm text-gray-500">
                        {new Date(
                          bid.createdAt
                        ).toLocaleString()}
                      </p>

                    </div>

                    <p className="text-xl font-semibold">
                      $
                      {bid.amount.toLocaleString()}
                    </p>

                  </div>

                )
              )

            )}

          </div>

        </div>

        {/* DESCRIPTION */}
        <div>

          <p className="text-sm text-gray-500 mb-3">
            Description
          </p>

          <div className="text-lg text-gray-700 leading-relaxed border rounded-2xl p-6">
            {auction.description ||
              "No description provided."}
          </div>

        </div>

        {/* SELLER CONTROLS */}
        <div className="flex gap-3">

          <button
            onClick={() =>
              updateStatus("LIVE")
            }
            disabled={statusLoading}
            className="flex-1 py-4 rounded-full bg-green-600 text-white font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            Start LIVE
          </button>

          <button
            onClick={() =>
              updateStatus("ENDED")
            }
            disabled={statusLoading}
            className="flex-1 py-4 rounded-full bg-gray-900 text-white font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            End Auction
          </button>

        </div>

        {/* BID BUTTON */}
        <button
          onClick={handleBid}
          disabled={loading}
          className="w-full py-5 rounded-full bg-black text-white font-medium hover:opacity-90 transition disabled:opacity-50"
        >

          {loading
            ? "Placing Bid..."
            : "Place Bid"}

        </button>

      </div>

    </div>
  );
}