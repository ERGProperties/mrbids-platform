```tsx
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
    touchStart,
    setTouchStart,
  ] = useState<number | null>(null);

  const [
    touchEnd,
    setTouchEnd,
  ] = useState<number | null>(null);

  const minSwipeDistance = 50;

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
    <>
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 pb-32">

        {/* LEFT */}
        <div>

          <div
            className="relative"

            onTouchStart={(e) =>
              setTouchStart(
                e.targetTouches[0].clientX
              )
            }

            onTouchMove={(e) =>
              setTouchEnd(
                e.targetTouches[0].clientX
              )
            }

            onTouchEnd={() => {

              if (
                !touchStart ||
                !touchEnd
              ) return;

              const distance =
                touchStart - touchEnd;

              const isLeftSwipe =
                distance >
                minSwipeDistance;

              const isRightSwipe =
                distance <
                -minSwipeDistance;

              if (isLeftSwipe) {
                nextImage();
              }

              if (isRightSwipe) {
                previousImage();
              }

            }}
          >

            {auction.images?.length > 0 ? (

              <img
                src={
                  auction.images[
                    selectedImage
                  ]
                }
                alt={auction.title}
                className="w-full rounded-3xl border object-cover aspect-square max-h-[70vh] transition-all duration-300 select-none"
                draggable={false}
              />

            ) : (

              <div className="aspect-square rounded-3xl bg-gray-100" />

            )}

          </div>

        </div>

        {/* RIGHT */}
        <div>

          <h1 className="text-4xl font-bold">
            {auction.title}
          </h1>

          {/* SHIPPING */}
          <div className="mt-8 border rounded-3xl p-6 bg-gray-50">

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

            <p className="mt-4 text-sm text-gray-500">
              Shipping is charged separately at checkout after winning the auction.
            </p>

          </div>

        </div>

      </div>
    </>
  );
}
```
