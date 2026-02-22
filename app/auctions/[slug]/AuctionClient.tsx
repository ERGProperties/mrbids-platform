"use client";

import { useState, useRef } from "react";
import BidForm from "./BidForm";
import { useSession } from "next-auth/react";
import { SignInButton } from "@/components/auth/SignInButton";
import AuctionCountdown from "@/components/auction/AuctionCountdown";
import Link from "next/link";

export default function AuctionClient({
  auction,
  minimumBid,
}: {
  auction: any;
  minimumBid: number;
}) {
  const { data: session } = useSession();

  function buildImageUrl(path: string, file: string) {
    if (!file) return "";
    if (file.startsWith("/")) return file;
    const cleanPath = path?.startsWith("/") ? path : `/${path}`;
    return `${cleanPath}/${file}`;
  }

  const imageList =
    Array.isArray(auction.images) && auction.images.length
      ? auction.images.map((img: string) =>
          buildImageUrl(auction.imagesPath, img)
        )
      : auction.coverImage
      ? [auction.coverImage]
      : [];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [fade, setFade] = useState(true);
  const [bidPulse, setBidPulse] = useState(false);

  const touchStartX = useRef<number | null>(null);

  const selectedImage =
    imageList.length > 0 ? imageList[selectedIndex] : null;

  const isVerified =
    session?.user?.isVerifiedBidder === true;

  function changeImage(index: number) {
    setFade(false);
    setTimeout(() => {
      setSelectedIndex(index);
      setFade(true);
    }, 120);
  }

  function goPrev() {
    const next =
      selectedIndex === 0
        ? imageList.length - 1
        : selectedIndex - 1;
    changeImage(next);
  }

  function goNext() {
    const next =
      selectedIndex === imageList.length - 1
        ? 0
        : selectedIndex + 1;
    changeImage(next);
  }

  function onTouchStart(e: React.TouchEvent<HTMLDivElement>) {
    touchStartX.current = e.touches[0].clientX;
  }

  function onTouchEnd(e: React.TouchEvent<HTMLDivElement>) {
    if (touchStartX.current == null) return;

    const delta =
      e.changedTouches[0].clientX - touchStartX.current;

    if (Math.abs(delta) > 50) {
      delta > 0 ? goPrev() : goNext();
    }

    touchStartX.current = null;
  }

  function triggerBidPulse() {
    setBidPulse(true);
    setTimeout(() => setBidPulse(false), 700);
  }

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-16">

        {/* ⭐ LUXURY AUCTION HEADER */}
        <div className="mb-10 border-b border-gray-200 pb-6">
          <p className="text-[11px] uppercase tracking-[0.25em] text-gray-500 font-medium">
            LIVE AUCTION
          </p>

          <h1 className="mt-3 text-4xl md:text-5xl font-semibold tracking-tight text-gray-900 leading-tight">
            {auction.title || "Untitled Property"}
          </h1>

          <p className="mt-3 text-base text-gray-600">
            {auction.cityStateZip ||
              auction.addressLine ||
              "Location Pending"}
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Seller-Direct Real Estate Auction
          </p>
        </div>

        {/* INFO BAR */}
        <div className="mb-8 bg-white border rounded-2xl p-6 grid grid-cols-2 md:grid-cols-6 gap-6">
          <div>
            <p className="text-sm font-medium">Status</p>
            <p className="mt-2 text-sm text-gray-600">Live</p>
          </div>

          <div>
            <p className="text-sm font-medium">Time Remaining</p>
            <div className="mt-2 text-sm text-gray-600">
              <AuctionCountdown endsAt={auction.endsAt} />
            </div>
          </div>

          <div>
            <p className="text-sm font-medium">Current Bid</p>
            <p className="mt-2 text-sm text-gray-600">
              ${auction.highestBid?.toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium">Starting Bid</p>
            <p className="mt-2 text-sm text-gray-600">
              ${auction.startingBid?.toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium">Increment</p>
            <p className="mt-2 text-sm text-gray-600">
              ${auction.bidIncrement?.toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium">Seller ARV</p>
            <p className="mt-2 text-sm text-gray-600">
              {auction.arv
                ? `$${auction.arv.toLocaleString()}`
                : "Not provided"}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* LEFT CONTENT */}
          <div className="lg:col-span-2">

            {/* IMAGE GALLERY */}
            <div className="mb-8">
              <div
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
                className="relative bg-white border rounded-2xl overflow-hidden"
              >
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    onClick={() => setLightboxOpen(true)}
                    className={`w-full h-[560px] object-cover cursor-zoom-in transition-opacity duration-300 ${
                      fade ? "opacity-100" : "opacity-0"
                    }`}
                    alt=""
                  />
                ) : (
                  <div className="h-[560px] flex items-center justify-center text-gray-400">
                    No images uploaded
                  </div>
                )}
              </div>

              <div className="mt-3 flex gap-3 overflow-x-auto">
                {imageList.map((img: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => changeImage(i)}
                    className={`rounded-xl overflow-hidden border ${
                      selectedIndex === i
                        ? "border-black"
                        : "border-gray-300"
                    }`}
                  >
                    <img
                      src={img}
                      className="h-20 w-32 object-cover"
                      alt=""
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="bg-white border rounded-2xl p-8 mb-8">
              <h2 className="text-lg font-semibold">
                Property Description
              </h2>
              <p className="mt-4 text-sm text-gray-600 whitespace-pre-line">
                {auction.description || "No description provided."}
              </p>
            </div>

            {/* FACTS */}
            <div className="bg-white border rounded-2xl p-8">
              <h3 className="text-sm font-semibold uppercase tracking-widest">
                Property Facts
              </h3>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li>• Type: {auction.propertyType || "-"}</li>
                <li>• Beds: {auction.beds || "-"}</li>
                <li>• Baths: {auction.baths || "-"}</li>
                <li>• SqFt: {auction.sqft || "-"}</li>
              </ul>
            </div>
          </div>

          {/* BID PANEL */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div
              className={`bg-white border rounded-2xl p-6 shadow-sm transition ${
                bidPulse ? "scale-[1.02]" : ""
              }`}
            >
              <div className="mb-5 rounded-xl bg-gray-50 border border-gray-200 p-4">
                <p className="text-[11px] uppercase tracking-wide text-gray-500">
                  Auction Ends In
                </p>
                <p className="text-xl font-semibold text-gray-900 mt-1">
                  <AuctionCountdown endsAt={auction.endsAt} />
                </p>
              </div>

              <p className="text-[11px] uppercase tracking-wide text-gray-500">
                Current Bid
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                ${auction.highestBid?.toLocaleString()}
              </p>

              <p className="mt-4 text-[11px] uppercase tracking-wide text-gray-500">
                Minimum Next Bid
              </p>
              <p className="text-lg font-semibold text-gray-900">
                ${minimumBid.toLocaleString()}
              </p>

              <div className="mt-6">
                {!session ? (
                  <SignInButton />
                ) : isVerified ? (
                  <div onClick={triggerBidPulse}>
                    <BidForm
                      slug={auction.slug}
                      minimumBid={minimumBid}
                      currentBid={auction.highestBid}
                    />
                  </div>
                ) : (
                  <Link
                    href="/verify"
                    className="inline-block bg-black text-white px-4 py-2 rounded"
                  >
                    Verify to Bid
                  </Link>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* LIGHTBOX */}
        {lightboxOpen && selectedImage && (
          <div
            onClick={() => setLightboxOpen(false)}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          >
            <img
              src={selectedImage}
              className="max-h-[90vh] max-w-[90vw] object-contain"
              alt=""
            />
          </div>
        )}
      </div>
    </main>
  );
}