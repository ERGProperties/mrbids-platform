"use client";

import { useState } from "react";

export default function AuctionClient({
  auction,
}: {
  auction: any;
}) {

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

      window.location.reload();

    } catch (err) {

      console.error(err);

      setError(
        "Something went wrong"
      );

    } finally {

      setLoading(false);

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