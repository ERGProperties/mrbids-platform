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
    shippingCost,
    setShippingCost,
  ] = useState(
    auction.shippingCost || 0
  );

  const [
    shippingCarrier,
    setShippingCarrier,
  ] = useState(
    auction.shippingCarrier || ""
  );

  const [
    shippingLoading,
    setShippingLoading,
  ] = useState(false);

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

  const [
    viewerCount,
    setViewerCount,
  ] = useState(0);

  const [
    outbidAlert,
    setOutbidAlert,
  ] = useState(false);

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

        const newHighestBidder =
          updatedAuction
            ?.bids?.[0]
            ?.bidderId;

        if (
          previousHighestBidder
            .current ===
            session?.user?.id &&
          newHighestBidder !==
            session?.user?.id
        ) {

          setOutbidAlert(true);

          setTimeout(() => {
            setOutbidAlert(false);
          }, 5000);

        }

        previousHighestBidder.current =
          newHighestBidder;

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

    return () => {

      channel.unbind_all();

      pusherClient.unsubscribe(
        `presence-auction-${initialAuction.id}`
      );

    };

  }, [
    initialAuction.id,
    session?.user?.id,
  ]);

  useEffect(() => {

    if (!auction) return;

    setAmount(
      auction.currentBid > 0
        ? auction.currentBid +
            auction.bidIncrement
        : auction.startingBid
    );

    previousHighestBidder.current =
      auction.bids?.[0]
        ?.bidderId || null;

  }, [
    auction.currentBid,
    auction.bidIncrement,
    auction.startingBid,
    auction.bids,
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

  async function saveShipping() {

    try {

      setShippingLoading(true);

      setError("");

      setSuccess("");

      const response =
        await fetch(
          `/api/marketplace-auctions/${auction.id}/shipping`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              shippingCost,
              shippingCarrier,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {

        setError(
          data.error ||
          "Failed to save shipping"
        );

        return;
      }

      setSuccess(
        "Shipping details updated successfully!"
      );

      mutate(
        `/api/marketplace-auctions/${initialAuction.id}/live`
      );

    } catch (err) {

      console.error(err);

      setError(
        "Something went wrong"
      );

    } finally {

      setShippingLoading(false);

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

  const highestBidderId =
    auction.bids?.[0]?.bidderId;

  const highestBidder =
    auction.bids?.[0]?.bidder;

  const isWinner =
    auction.status === "ENDED" &&
    highestBidderId ===
      session?.user?.id;

  const totalDue =
    (auction.currentBid || 0) +
    (auction.shippingCost || 0);

  const formattedBids =
    useMemo(() => {

      return (
        auction.bids || []
      ).map((bid: any) => {

        const displayName =
          bid.bidder?.name
            ?.split(" ")[0] ||
          "Bidder";

        return {
          ...bid,
          displayName,
        };

      });

    }, [auction.bids]);

  return (
    <>

      {outbidAlert && (

        <div className="fixed top-6 right-6 z-50 bg-red-500 text-white px-6 py-4 rounded-2xl shadow-2xl animate-pulse">

          You've been outbid!

        </div>

      )}

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-14">

        {/* LEFT SIDE */}
        <div>

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

            <div className="absolute top-5 left-5 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur">

              👁 {viewerCount} watching

            </div>

            <button
              onClick={
                toggleWatchlist
              }
              disabled={
                watchlistLoading
              }
              className="absolute top-5 right-5 bg-white/90 hover:bg-white transition px-5 py-3 rounded-full shadow-xl text-sm font-semibold"
            >

              {isSaved
                ? "❤️ Saved"
                : "🤍 Save"}

            </button>

          </div>

          {auction.images?.length > 1 && (

            <div className="grid grid-cols-5 gap-3 mt-4">

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
                    className={`border rounded-xl overflow-hidden ${
                      selectedImage ===
                      index
                        ? "border-black"
                        : "border-gray-200"
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

        {/* RIGHT SIDE */}
        <div>

          <div className="flex flex-wrap items-center gap-3 mb-6">

            <span className="inline-flex px-4 py-2 rounded-full bg-black text-white text-sm font-medium">
              {auction.category}
            </span>

            <span className="inline-flex px-4 py-2 rounded-full bg-red-500 text-white text-sm font-medium">
              {auction.status}
            </span>

            {auction.status ===
              "LIVE" &&
              auction.endAt && (

              <div className="inline-flex px-4 py-2 rounded-full bg-yellow-100 text-yellow-700 text-sm font-medium">

                <CountdownTimer
                  endAt={
                    auction.endAt
                  }
                  onExpire={
                    endAuction
                  }
                />

              </div>

            )}

          </div>

          <h1 className="text-3xl md:text-5xl font-semibold leading-tight mb-6">
            {auction.title}
          </h1>

          {auction.description && (

            <div className="mb-8">

              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Description
              </h2>

              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {auction.description}
              </p>

            </div>

          )}

          <div className="bg-gray-50 border border-gray-200 rounded-3xl p-8 mb-8">

            <div className="flex items-end justify-between mb-6">

              <div>

                <p className="text-sm text-gray-500 mb-2">
                  Current Bid
                </p>

                <h2 className="text-5xl font-bold text-gray-900">

                  $
                  {(auction.currentBid > 0
                    ? auction.currentBid
                    : auction.startingBid
                  ).toLocaleString()}

                </h2>

              </div>

              <div className="text-right">

                <p className="text-sm text-gray-500 mb-2">
                  Total Bids
                </p>

                <p className="text-3xl font-semibold text-gray-900">
                  {auction.bidCount}
                </p>

              </div>

            </div>

            {auction.status ===
              "LIVE" &&
              !isSeller && (

              <div className="space-y-5">

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Bid
                  </label>

                  <input
                    type="number"
                    min={minimumBid}
                    value={amount}
                    onChange={(e) =>
                      setAmount(
                        Number(
                          e.target.value
                        )
                      )
                    }
                    className="w-full border border-gray-300 rounded-2xl px-5 py-4 text-xl font-semibold"
                  />

                  <p className="text-sm text-gray-500 mt-2">
                    Minimum bid: $
                    {minimumBid.toLocaleString()}
                  </p>

                </div>

                <button
                  onClick={
                    handleBid
                  }
                  disabled={loading}
                  className="w-full bg-black text-white rounded-2xl py-5 text-lg font-semibold hover:opacity-90 transition"
                >

                  {loading
                    ? "Placing Bid..."
                    : "Place Bid"}

                </button>

              </div>

            )}

            {isSeller && (

              <div className="bg-blue-50 border border-blue-200 text-blue-700 rounded-2xl p-5 text-sm">

                You are the seller of this auction.

              </div>

            )}

          </div>

          {error && (

            <div className="mb-6 bg-red-100 border border-red-200 text-red-700 px-5 py-4 rounded-2xl">

              {error}

            </div>

          )}

          {success && (

            <div className="mb-6 bg-green-100 border border-green-200 text-green-700 px-5 py-4 rounded-2xl">

              {success}

            </div>

          )}

          {auction.status ===
            "ENDED" &&
            isWinner && (

            <div className="bg-green-50 border border-green-200 rounded-3xl p-8 mb-8">

              <h2 className="text-2xl font-semibold text-green-700 mb-4">
                You Won This Auction
              </h2>

              <div className="space-y-3 mb-6">

                <p className="text-gray-700">
                  Winning Bid:
                  <span className="ml-2 font-semibold">

                    $
                    {auction.currentBid.toLocaleString()}

                  </span>
                </p>

                <p className="text-gray-700">
                  Shipping:
                  <span className="ml-2 font-semibold">

                    $
                    {(auction.shippingCost || 0).toLocaleString()}

                  </span>
                </p>

                <p className="text-2xl font-bold text-gray-900">

                  Total Due: $
                  {totalDue.toLocaleString()}

                </p>

              </div>

              {auction.paymentStatus !==
                "PAID" ? (

                <button
                  onClick={
                    handleCheckout
                  }
                  disabled={
                    paymentLoading
                  }
                  className="w-full bg-green-600 text-white rounded-2xl py-5 text-lg font-semibold hover:bg-green-700 transition"
                >

                  {paymentLoading
                    ? "Redirecting..."
                    : "Pay Now"}

                </button>

              ) : (

                <div className="bg-green-100 text-green-700 rounded-2xl px-5 py-4 font-semibold">

                  Payment Completed

                </div>

              )}

            </div>

          )}

          {isSeller &&
            auction.status ===
              "ENDED" && (

            <div className="bg-white border border-gray-200 rounded-3xl p-8 mb-8">

              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Shipping Settings
              </h2>

              <div className="space-y-5">

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shipping Cost
                  </label>

                  <input
                    type="number"
                    value={
                      shippingCost
                    }
                    onChange={(e) =>
                      setShippingCost(
                        Number(
                          e.target.value
                        )
                      )
                    }
                    className="w-full border border-gray-300 rounded-2xl px-5 py-4"
                  />

                </div>

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shipping Carrier
                  </label>

                  <input
                    type="text"
                    value={
                      shippingCarrier
                    }
                    onChange={(e) =>
                      setShippingCarrier(
                        e.target.value
                      )
                    }
                    className="w-full border border-gray-300 rounded-2xl px-5 py-4"
                  />

                </div>

                <button
                  onClick={
                    saveShipping
                  }
                  disabled={
                    shippingLoading
                  }
                  className="w-full bg-black text-white rounded-2xl py-4 font-semibold hover:opacity-90 transition"
                >

                  {shippingLoading
                    ? "Saving..."
                    : "Save Shipping"}

                </button>

              </div>

            </div>

          )}

          <div className="bg-white border border-gray-200 rounded-3xl p-8">

            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Recent Bids
            </h2>

            {formattedBids.length ===
            0 ? (

              <p className="text-gray-500">
                No bids yet.
              </p>

            ) : (

              <div className="space-y-4">

                {formattedBids.map(
                  (bid: any) => (

                    <div
                      key={bid.id}
                      className="flex items-center justify-between border-b border-gray-100 pb-4"
                    >

                      <div>

                        <p className="font-semibold text-gray-900">
                          {bid.displayName}
                        </p>

                        <p className="text-sm text-gray-500">
                          {new Date(
                            bid.createdAt
                          ).toLocaleString()}
                        </p>

                      </div>

                      <p className="text-xl font-bold text-gray-900">

                        $
                        {bid.amount.toLocaleString()}

                      </p>

                    </div>

                  )
                )}

              </div>

            )}

          </div>

        </div>

      </div>

    </>
  );
}