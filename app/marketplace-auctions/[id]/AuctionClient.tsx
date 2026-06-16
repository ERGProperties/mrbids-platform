"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import useSWR, {
  mutate,
} from "swr";

import CountdownTimer from "@/components/CountdownTimer";

import { pusherClient } from "@/lib/pusher-client";

import { useSession } from "next-auth/react"; 

import { useSearchParams } from "next/navigation";

declare const fbq: any;

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

  const { data: session } =
    useSession();

  const searchParams =
    useSearchParams();

  const wasJustCreated =
    searchParams.get("created") === "true";

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
    paymentLoading,
    setPaymentLoading,
  ] = useState(false);

  const [
    watchlistLoading,
    setWatchlistLoading,
  ] = useState(false);

  const [
    isSaved,
    setIsSaved,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    success,
    setSuccess,
  ] = useState("");

  const previousHighestBidder =
    useRef<string | null>(null);

  useEffect(() => {

    async function fetchWatchlist() {

      if (!session?.user) return;

      try {

        const response =
          await fetch(
            "/api/watchlist"
          );

        if (!response.ok) {
          return;
        }

        const data =
          await response.json();

        const exists =
          data.some(
            (item: any) =>
              item.auctionId ===
              auction.id
          );

        setIsSaved(exists);

      } catch (error) {

        console.error(error);

      }

    }

    fetchWatchlist();

  }, [
    session?.user,
    auction.id,
  ]);

  useEffect(() => {

    const channel =
      pusherClient.subscribe(
        `presence-auction-${initialAuction.id}`
      );

    channel.bind(
      "new-bid",
      (updatedAuction: any) => {

        previousHighestBidder.current =
          updatedAuction
            ?.bids?.[0]
            ?.bidderId || null;

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

    return () => {

      channel.unbind_all();

      pusherClient.unsubscribe(
        `presence-auction-${initialAuction.id}`
      );

    };

  }, [
    initialAuction.id,
  ]);

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

  async function toggleWatchlist() {

    if (!session?.user) {

      window.location.href =
        "/signin";

      return;

    }

    try {

      setWatchlistLoading(true);

      if (isSaved) {

        await fetch(
          `/api/watchlist/${auction.id}`,
          {
            method: "DELETE",
          }
        );

        setIsSaved(false);

      } else {

        await fetch(
          "/api/watchlist",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              auctionId:
                auction.id,
            }),
          }
        );

        fbq('track', 'AddToWishlist');
        setIsSaved(true);

      }

    } catch (error) {

      console.error(error);

    } finally {

      setWatchlistLoading(false);

    }

  }

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

fbq('track', 'InitiateCheckout');

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

  async function handleCheckout() {

    try {

      setPaymentLoading(true);

      setError("");

      const response =
        await fetch(
          "/api/stripe/create-checkout-session",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              auctionId: auction.id,
              userId:
                session?.user?.id,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {

        setError(
          data.error ||
          "Failed to start checkout"
        );

        return;
      }

      window.location.href =
        data.url;

    } catch (err) {

      console.error(err);

      setError(
        "Something went wrong"
      );

    } finally {

      setPaymentLoading(false);

    }
  }

  const minimumBid =
    auction.currentBid > 0
      ? auction.currentBid +
        auction.bidIncrement
      : auction.startingBid;

  const highestBidderId =
    auction.bids?.[0]?.bidderId;

  const isWinner =
    auction.status === "ENDED" &&
    highestBidderId ===
      session?.user?.id;

  const totalDue =
    (auction.currentBid || 0) +
    ((auction.shippingCost || 0) / 100);

  const formattedBids =
    useMemo(() => {

      return (
        auction.bids || []
      ).map((bid: any) => {

        const fullName =
          bid.bidder?.name || "";

        const firstName =
          fullName.split(" ")[0] || "";

        const lastInitial =
          fullName.split(" ")[1]
            ? `${fullName.split(" ")[1][0]}.`
            : "";

        const displayName =
          firstName
            ? `${firstName} ${lastInitial}`.trim()
            : "Bidder";

        return {
          ...bid,
          displayName,
        };

      });

    }, [auction.bids]);

  return (
    <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 pb-32">

      {/* LEFT */}
      <div>

{auction.images?.length > 0 ? (

  <div>

    <img
      src={
        auction.images[
          selectedImage
        ]
      }
      alt={auction.title}
      className="w-full rounded-3xl border object-cover aspect-square"
    />

    {auction.images.length > 1 && (

      <div className="grid grid-cols-5 gap-3 mt-4">

        {auction.images.map(
          (
            image: string,
            index: number
          ) => (

            <button
              key={index}
              onClick={() =>
                setSelectedImage(index)
              }
              className={`border rounded-2xl overflow-hidden ${
                selectedImage === index
                  ? "ring-2 ring-black"
                  : ""
              }`}
            >

              <img
                src={image}
                alt={`Preview ${index}`}
                className="aspect-square object-cover"
              />

            </button>

          )
        )}

      </div>

    )}

  </div>

) : (

          <div className="aspect-square rounded-3xl bg-gray-100" />

        )}

      </div>

      {/* RIGHT */}
      <div>

{wasJustCreated && isSeller && (

  <div className="mb-8 border border-green-200 bg-green-50 rounded-3xl p-6">

    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

      <div>

        <h2 className="text-2xl font-semibold text-green-700">
          🎉 Your auction is LIVE
        </h2>

        <p className="mt-2 text-gray-700">
          Share your auction link to start receiving bids.
        </p>

      </div>

      <button
        onClick={() => {
          navigator.clipboard.writeText(
            window.location.origin +
            `/marketplace-auctions/${auction.id}`
          );

          setSuccess(
            "Auction link copied!"
          );
        }}
        className="px-6 py-4 rounded-full bg-black text-white font-medium hover:opacity-90 transition"
      >
        Copy Share Link
      </button>

    </div>

  </div>

)}

        <div className="flex items-center gap-3 mb-5">

          <span className="px-4 py-2 rounded-full bg-black text-white text-sm font-medium">
            {auction.category}
          </span>

          <span className="px-4 py-2 rounded-full bg-red-500 text-white text-sm font-medium">
            {auction.status}
          </span>

        </div>

        <h1 className="text-5xl font-semibold leading-tight">
          {auction.title}
        </h1>

        {/* SELLER */}
        <div className="mt-8">

          <p className="text-sm text-gray-500 mb-3">
            Seller
          </p>

          <div className="flex items-center gap-4">

            {auction.seller?.avatarUrl ? (

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
                {auction.seller?.name?.charAt(0) || "M"}
              </div>

            )}

            <div>

              <p className="font-semibold text-lg">
                {auction.seller?.name || "Marketplace Seller"}
              </p>

              {auction.seller?.tiktokUsername && (

                <p className="text-gray-500">
                  {auction.seller.tiktokUsername}
                </p>

              )}

            </div>

          </div>

        </div>

        {/* COUNTDOWN */}
        <div className="mt-8">
          <CountdownTimer endAt={auction.endAt} />
        </div>

        {/* CURRENT BID */}
        <div className="mt-10">

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

        {/* RESERVE */}
        {auction.reservePrice && (

          <div className="mt-6 border rounded-2xl p-5 bg-gray-50">

            <p className="text-sm text-gray-500 mb-2">
              Reserve Status
            </p>

            {auction.currentBid >= auction.reservePrice ? (

              <p className="text-green-600 font-semibold">
                Reserve Met
              </p>

            ) : (

              <p className="text-orange-500 font-semibold">
                Reserve Not Met
              </p>

            )}

          </div>

        )}

        {/* SHIPPING */}
        <div className="mt-6 border rounded-3xl p-6 bg-gray-50">

          <h2 className="text-xl font-semibold mb-4">
            Shipping Details
          </h2>

          {auction.freeShipping ? (

            <div className="inline-flex items-center px-4 py-3 rounded-2xl bg-green-100 text-green-700 font-semibold">
              🚚 Free Shipping
            </div>

          ) : auction.localPickup ? (

            <div className="inline-flex items-center px-4 py-3 rounded-2xl bg-blue-100 text-blue-700 font-semibold">
              📍 Local Pickup Available
            </div>

          ) : (

            <div className="flex items-center justify-between border rounded-2xl bg-white px-5 py-4">

              <div>

                <p className="text-sm text-gray-500">
                  Shipping Type
                </p>

                <p className="font-semibold text-lg">
                  {auction.shippingLabel || "Standard Shipping"}
                </p>

              </div>

              <div className="text-right">

                <p className="text-sm text-gray-500">
                  Shipping Cost
                </p>

                <p className="font-semibold text-lg">
                  $
                  {(
                    (auction.shippingCost || 0) / 100
                  ).toFixed(2)}
                </p>

              </div>

            </div>

          )}

        </div>

        {/* DESCRIPTION */}
        <div className="mt-8">

          <p className="text-sm text-gray-500 mb-3">
            Description
          </p>

          <div className="text-lg text-gray-700 leading-relaxed border rounded-2xl p-6">
            {auction.description ||
              "No description provided."}
          </div>

        </div>

        {/* BID HISTORY */}
        <div className="mt-10">

          <div className="flex items-center justify-between mb-4">

            <p className="text-sm text-gray-500">
              Recent Bids
            </p>

            <button
              onClick={toggleWatchlist}
              disabled={watchlistLoading}
              className="text-sm font-medium"
            >
              {isSaved
                ? "★ Saved"
                : "☆ Watchlist"}
            </button>

          </div>

          <div className="border rounded-2xl divide-y overflow-hidden">

            {formattedBids.length === 0 ? (

              <div className="p-6 text-gray-500">
                No bids yet.
              </div>

            ) : (

              formattedBids.map(
                (bid: any) => (

                  <div
                    key={bid.id}
                    className="flex items-center justify-between p-5"
                  >

                    <div>

                      <p className="font-medium">
                        {bid.displayName}
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

        {/* BID INPUT */}
        {auction.status === "LIVE" && !isSeller && (

          <div className="mt-10">

            <div className="border rounded-2xl p-6">

              <p className="text-sm text-gray-500 mb-2">
                Minimum Bid
              </p>

              <p className="text-3xl font-semibold mb-5">
                $
                {minimumBid.toLocaleString()}
              </p>

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

              <button
                onClick={handleBid}
                disabled={loading}
                className="w-full mt-5 py-5 rounded-full bg-black text-white font-medium hover:opacity-90 transition disabled:opacity-50"
              >

                {loading
                  ? "Placing Bid..."
                  : "Place Bid"}

              </button>

            </div>

          </div>

        )}

        {/* WINNER CHECKOUT */}
        {isWinner && !auction.shippingPaid && (

          <div className="mt-10 border rounded-3xl p-6 bg-green-50">

            <h2 className="text-2xl font-semibold">
              🎉 You Won
            </h2>

            <p className="mt-3 text-gray-700">
              Complete payment to finalize your purchase.
            </p>

            <div className="mt-5 space-y-2">

              <div className="flex justify-between">
                <span>Winning Bid</span>

                <span>
                  $
                  {auction.currentBid?.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>

                <span>
                  $
                  {(
                    (auction.shippingCost || 0) / 100
                  ).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between font-semibold text-lg pt-3 border-t">
                <span>Total Due</span>

                <span>
                  $
                  {totalDue.toLocaleString()}
                </span>
              </div>

            </div>

            <button
              onClick={handleCheckout}
              disabled={paymentLoading}
              className="w-full mt-6 py-5 rounded-full bg-green-600 text-white font-medium hover:opacity-90 transition disabled:opacity-50"
            >

              {paymentLoading
                ? "Redirecting..."
                : "Complete Payment"}

            </button>

          </div>

        )}

        {/* ERROR */}
        {error && (

          <div className="mt-6 border border-red-200 bg-red-50 text-red-600 rounded-2xl p-4">
            {error}
          </div>

        )}

        {/* SUCCESS */}
        {success && (

          <div className="mt-6 border border-green-200 bg-green-50 text-green-600 rounded-2xl p-4">
            {success}
          </div>

        )}

      </div>

    </div>
  );
}