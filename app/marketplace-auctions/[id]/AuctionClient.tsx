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
    reactions,
    setReactions,
  ] = useState<any[]>([]);

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

  function nextImage() {

    if (!auction.images?.length) {
      return;
    }

    setSelectedImage(
      (prev) =>
        prev ===
        auction.images.length - 1
          ? 0
          : prev + 1
    );

  }

  function previousImage() {

    if (!auction.images?.length) {
      return;
    }

    setSelectedImage(
      (prev) =>
        prev === 0
          ? auction.images.length - 1
          : prev - 1
    );

  }

  async function startAuction() {

    try {

      setError("");

      const response =
        await fetch(
          `/api/marketplace-auctions/${auction.id}/start`,
          {
            method: "POST",
          }
        );

      const data =
        await response.json();

      if (!response.ok) {

        setError(
          data.error ||
          "Failed to start auction"
        );

        return;
      }

      mutate(
        `/api/marketplace-auctions/${initialAuction.id}/live`
      );

    } catch (error) {

      console.error(error);

      setError(
        "Failed to start auction"
      );

    }

  }

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

        {/* LEFT */}
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

            {auction.images?.length > 1 && (

              <>

                <button
                  onClick={previousImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl transition"
                >

                  ←

                </button>

                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl transition"
                >

                  →

                </button>

              </>

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

          {auction.images?.length >
            1 && (

            <div className="grid grid-cols-5 gap-3 mt-5">

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
                    className={`overflow-hidden rounded-2xl border ${
                      selectedImage ===
                      index
                        ? "border-black"
                        : "border-gray-200"
                    }`}
                  >

                    <img
                      src={image}
                      alt=""
                      className="aspect-square object-cover"
                    />

                  </button>

                )
              )}

            </div>

          )}

        </div>

        {/* RIGHT */}
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

<div className="mt-2 flex flex-wrap items-center gap-3">

  <h1 className="text-3xl md:text-5xl font-semibold leading-tight">
    {auction.title}
  </h1>

</div>

<div className="mt-5 flex flex-wrap items-center gap-4 text-sm">

  {auction.seller
    ?.stripeOnboardingComplete && (

    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-200 text-green-700 font-medium">

      <span>
        ✓
      </span>

      <span>
        Verified Seller
      </span>

    </div>

  )}

  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-700 font-medium">

    <span>
      Successful Sales:
    </span>

    <span className="font-semibold">

      {
        auction.seller
          ?.marketplaceAuctions
          ?.filter(
            (
              item: any
            ) =>
              item.paymentStatus ===
              "PAID"
          ).length
      }

    </span>

  </div>

  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-700 font-medium">

    <span>
      Active Auctions:
    </span>

    <span className="font-semibold">

      {
        auction.seller
          ?.marketplaceAuctions
          ?.filter(
            (
              item: any
            ) =>
              item.status ===
              "LIVE"
          ).length
      }

    </span>

  </div>

</div>

<div className="mt-6 grid grid-cols-2 gap-4">

            {auction.retailPrice && (

              <div className="border rounded-2xl p-5 bg-gray-50">

                <p className="text-sm text-gray-500 mb-2">
                  Retail Value
                </p>

                <p className="text-2xl font-bold text-gray-900">

                  $
                  {auction.retailPrice.toLocaleString()}

                </p>

              </div>

            )}

            <div className="border rounded-2xl p-5 bg-gray-50">

              <p className="text-sm text-gray-500 mb-2">
                Bid Increment
              </p>

              <p className="text-2xl font-bold text-gray-900">

                $
                {auction.bidIncrement.toLocaleString()}

              </p>

            </div>

          </div>

          {auction.description && (

            <div className="mt-8">

              <h2 className="text-xl font-semibold mb-3">
                Description
              </h2>

              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {auction.description}
              </p>

            </div>

          )}

          <div className="mt-6 grid grid-cols-2 gap-4">

            {auction.retailPrice && (

              <div className="border rounded-2xl p-5 bg-gray-50">

                <p className="text-sm text-gray-500 mb-2">
                  Retail Value
                </p>

                <p className="text-2xl font-bold text-gray-900">

                  $
                  {auction.retailPrice.toLocaleString()}

                </p>

              </div>

            )}

            <div className="border rounded-2xl p-5 bg-gray-50">

              <p className="text-sm text-gray-500 mb-2">
                Bid Increment
              </p>

              <p className="text-2xl font-bold text-gray-900">

                $
                {auction.bidIncrement.toLocaleString()}

              </p>

            </div>

          </div>

          {auction.description && (

            <div className="mt-8">

              <h2 className="text-xl font-semibold mb-3">
                Description
              </h2>

              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {auction.description}
              </p>

            </div>

          )}

          <div className="mt-8 border rounded-3xl p-8 bg-gradient-to-br from-black to-gray-900 text-white">

            <p className="text-sm uppercase tracking-wider text-gray-300">
              Current Bid
            </p>

            <div className="mt-4 flex items-end justify-between gap-4">

              <div>

                <h2 className="text-5xl font-bold">

                  $
                  {auction.currentBid?.toLocaleString() ||
                    auction.startingBid?.toLocaleString()}

                </h2>

                <p className="mt-2 text-sm text-gray-300">
                  Minimum next bid: $
                  {minimumBid.toLocaleString()}
                </p>

              </div>

              {highestBidder && (

                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/10 border border-white/10">

                  <div className="w-12 h-12 rounded-full overflow-hidden bg-white/20 flex items-center justify-center">

                    {highestBidder.image ? (

                      <img
                        src={
                          highestBidder.image
                        }
                        alt=""
                        className="w-full h-full object-cover"
                      />

                    ) : (

                      <span className="text-lg font-semibold">
                        {highestBidder.name?.[0] ||
                          "B"}
                      </span>

                    )}

                  </div>

                  <div>

                    <p className="text-xs text-gray-300">
                      Winning Bidder
                    </p>

                    <p className="font-semibold">
                      {highestBidder.name
                        ?.split(
                          " "
                        )[0] || "Bidder"}
                    </p>

                  </div>

                </div>

              )}

            </div>

            {auction.status ===
              "LIVE" &&
              !isSeller && (

              <div className="mt-8 space-y-4">

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
                  className="w-full rounded-2xl px-5 py-4 text-black text-xl font-semibold"
                />

                <button
                  onClick={
                    handleBid
                  }
                  disabled={loading}
                  className="w-full bg-white text-black rounded-2xl py-5 text-lg font-semibold hover:opacity-90 transition"
                >

                  {loading
                    ? "Placing Bid..."
                    : "Place Bid"}

                </button>

              </div>

            )}

{isSeller && (

  <div className="mt-8 space-y-4">

    {auction.status ===
      "SCHEDULED" && (

      auction.seller?.stripeOnboardingComplete ? (

        <button
          onClick={
            startAuction
          }
          className="w-full bg-green-600 text-white rounded-2xl py-5 text-lg font-semibold hover:bg-green-700 transition"
        >

          Go LIVE

        </button>

      ) : (

        <button
          onClick={() => {
            window.location.href =
              "/dashboard";
          }}
          className="w-full bg-yellow-500 text-black rounded-2xl py-5 text-lg font-semibold hover:bg-yellow-400 transition"
        >

          Connect Stripe To Launch Auction

        </button>

      )

    )}

    <div className="bg-blue-500/20 border border-blue-400/30 rounded-2xl px-5 py-4">

  {auction.seller
    ?.stripeOnboardingComplete
      ? "You are the verified seller of this auction."
      : "You are the seller of this auction."}

</div>

  </div>

)}
          </div>

          {error && (

            <div className="mt-6 bg-red-100 border border-red-200 text-red-700 px-5 py-4 rounded-2xl">

              {error}

            </div>

          )}

          {success && (

            <div className="mt-6 bg-green-100 border border-green-200 text-green-700 px-5 py-4 rounded-2xl">

              {success}

            </div>

          )}

          {auction.status ===
            "ENDED" &&
            isWinner && (

            <div className="mt-8 border rounded-3xl p-8 bg-green-50">

              <h2 className="text-2xl font-semibold text-green-700">
                You Won This Auction
              </h2>

              <div className="mt-6 space-y-3">

                <div className="flex justify-between">

                  <span>
                    Winning Bid
                  </span>

                  <span className="font-semibold">

                    $
                    {auction.currentBid.toLocaleString()}

                  </span>

                </div>

                <div className="flex justify-between">

                  <span>
                    Shipping
                  </span>

                  <span className="font-semibold">

                    $
                    {(auction.shippingCost || 0).toLocaleString()}

                  </span>

                </div>

                <div className="flex justify-between text-xl font-bold">

                  <span>
                    Total Due
                  </span>

                  <span>

                    $
                    {totalDue.toLocaleString()}

                  </span>

                </div>

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
                  className="mt-6 w-full bg-green-600 text-white rounded-2xl py-5 text-lg font-semibold hover:bg-green-700 transition"
                >

                  {paymentLoading
                    ? "Redirecting..."
                    : "Pay Now"}

                </button>

              ) : (

                <div className="mt-6 bg-green-200 text-green-700 rounded-2xl px-5 py-4 font-semibold">

                  Payment Completed

                </div>

              )}

            </div>

          )}

          {isSeller &&
            auction.status ===
              "ENDED" && (

            <div className="mt-8 border rounded-3xl p-8">

              <h2 className="text-2xl font-semibold mb-6">
                Shipping Settings
              </h2>

              <div className="space-y-5">

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
                  placeholder="Shipping Cost"
                  className="w-full border rounded-2xl px-5 py-4"
                />

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
                  placeholder="Shipping Carrier"
                  className="w-full border rounded-2xl px-5 py-4"
                />

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

          <div className="mt-8 border rounded-3xl p-6">

            <div className="flex items-center justify-between mb-5">

              <h3 className="text-xl font-semibold">
                Live Bid Activity
              </h3>

              <span className="text-sm text-gray-500">
                {auction.bidCount} bids
              </span>

            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">

              {formattedBids.length ===
              0 ? (

                <div className="text-gray-500 text-sm">
                  No bids yet.
                </div>

              ) : (

                formattedBids.map(
                  (
                    bid: any,
                    index: number
                  ) => {

                    const isLeading =
                      index === 0;

                    return (

                      <div
                        key={bid.id}
                        className={`flex items-center justify-between gap-4 p-4 rounded-2xl border transition ${
                          isLeading
                            ? "border-green-300 bg-green-50"
                            : "border-gray-200"
                        }`}
                      >

                        <div className="flex items-center gap-3">

                          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">

                            {bid.bidder
                              ?.image ? (

                              <img
                                src={
                                  bid
                                    .bidder
                                    .image
                                }
                                alt=""
                                className="w-full h-full object-cover"
                              />

                            ) : (

                              <span className="font-semibold text-gray-700">
                                {bid.displayName?.[0]}
                              </span>

                            )}

                          </div>

                          <div>

                            <div className="flex items-center gap-2">

                              <p className="font-semibold text-gray-900">
                                {bid.displayName}
                              </p>

                              {isLeading && (

                                <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 font-medium animate-pulse">
                                  Winning
                                </span>

                              )}

                            </div>

                            <p className="text-xs text-gray-500 mt-1">

                              {new Date(
                                bid.createdAt
                              ).toLocaleString()}

                            </p>

                          </div>

                        </div>

                        <div className="text-right">

                          <p className="text-2xl font-semibold text-gray-900">

                            $
                            {bid.amount.toLocaleString()}

                          </p>

                        </div>

                      </div>

                    );

                  }
                )

              )}

            </div>

          </div>

        </div>

      </div>

    </>
  );
}