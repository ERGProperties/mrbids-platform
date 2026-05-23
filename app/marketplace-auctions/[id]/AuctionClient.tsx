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

        // OUTBID DETECTION
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

          </div>

        </div>

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

          <h1 className="text-3xl md:text-5xl font-semibold leading-tight">
            {auction.title}
          </h1>

        </div>

      </div>

    </>
  );
}