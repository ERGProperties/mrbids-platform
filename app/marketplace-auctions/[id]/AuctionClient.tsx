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

      setSuccess(
        "Auction updated successfully!"
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

  const isWinner =
    auction.status === "ENDED" &&
    highestBidderId ===
      session?.user?.id;

  const totalDue =
    (auction.currentBid || 0) +
    (auction.shippingCost || 0);

  return (
    <>

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

          </div>

          <h1 className="text-3xl md:text-5xl font-semibold leading-tight">
            {auction.title}
          </h1>

          <div className="mt-8 space-y-6">

            {/* SHIPPING CONFIG */}
            {isSeller &&
              auction.status ===
                "ENDED" && (

              <div className="border rounded-2xl p-6 bg-blue-50 border-blue-200">

                <p className="text-sm font-medium text-blue-700 mb-5">
                  Configure Shipping
                </p>

                <div className="space-y-4">

                  <div>

                    <label className="block text-sm text-gray-600 mb-2">
                      Shipping Cost
                    </label>

                    <input
                      type="number"
                      value={shippingCost}
                      onChange={(e) =>
                        setShippingCost(
                          Number(
                            e.target.value
                          )
                        )
                      }
                      className="w-full border rounded-2xl px-5 py-4"
                    />

                  </div>

                  <div>

                    <label className="block text-sm text-gray-600 mb-2">
                      Shipping Carrier
                    </label>

                    <input
                      type="text"
                      value={shippingCarrier}
                      onChange={(e) =>
                        setShippingCarrier(
                          e.target.value
                        )
                      }
                      placeholder="UPS, USPS, FedEx..."
                      className="w-full border rounded-2xl px-5 py-4"
                    />

                  </div>

                  <button
                    onClick={saveShipping}
                    disabled={shippingLoading}
                    className="w-full py-4 rounded-full bg-blue-600 text-white font-medium hover:opacity-90 transition disabled:opacity-50"
                  >

                    {shippingLoading
                      ? "Saving..."
                      : "Save Shipping"}

                  </button>

                </div>

              </div>

            )}

            {/* BUYER TOTAL */}
            {isWinner &&
              auction.paymentStatus !==
                "PAID" && (

              <div className="border rounded-2xl p-6 bg-green-50 border-green-200">

                <p className="text-sm font-medium text-green-700 mb-4">
                  Payment Summary
                </p>

                <div className="space-y-3 mb-6">

                  <div className="flex items-center justify-between">

                    <span className="text-gray-700">
                      Winning Bid
                    </span>

                    <span className="font-semibold">
                      $
                      {auction.currentBid?.toLocaleString()}
                    </span>

                  </div>

                  <div className="flex items-center justify-between">

                    <span className="text-gray-700">
                      Shipping
                    </span>

                    <span className="font-semibold">

                      {auction.shippingCost
                        ? `$${auction.shippingCost.toLocaleString()}`
                        : "Pending"}

                    </span>

                  </div>

                  <div className="border-t pt-3 flex items-center justify-between">

                    <span className="font-semibold text-gray-900">
                      Total Due
                    </span>

                    <span className="text-2xl font-semibold text-gray-900">

                      $
                      {totalDue.toLocaleString()}

                    </span>

                  </div>

                </div>

                <button
                  onClick={handleCheckout}
                  disabled={
                    paymentLoading ||
                    !auction.shippingCost
                  }
                  className="w-full py-4 rounded-full bg-green-600 text-white font-medium hover:opacity-90 transition disabled:opacity-50"
                >

                  {paymentLoading
                    ? "Redirecting..."
                    : !auction.shippingCost
                    ? "Waiting For Shipping"
                    : "Pay Now"}

                </button>

              </div>

            )}

          </div>

        </div>

      </div>

    </>
  );
}