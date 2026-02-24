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

        {/* ===== HEADER ===== */}
        <div className="mb-10 border-b border-gray-200 pb-6">
          <div className="flex items-center gap-3">
            <p className="text-[11px] uppercase tracking-[0.25em] text-gray-500 font-medium">
              LIVE AUCTION
            </p>

            {/* LIVE ENERGY BADGE */}
            <span className="text-[10px] px-2 py-1 rounded-full bg-green-100 text-green-700 font-semibold">
              Auction Active
            </span>
          </div>

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

        {/* TRUST LAYER */}
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white border rounded-xl px-4 py-3">
            <p className="text-xs font-semibold text-gray-900">
              Verified Marketplace
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Seller identity and listing reviewed.
            </p>
          </div>

          <div className="bg-white border rounded-xl px-4 py-3">
            <p className="text-xs font-semibold text-gray-900">
              Transparent Auction
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Real-time bidding with visible pricing.
            </p>
          </div>

          <div className="bg-white border rounded-xl px-4 py-3">
            <p className="text-xs font-semibold text-gray-900">
              Admin Oversight
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Marketplace monitored for fairness.
            </p>
          </div>
        </div>

        {/* INFO BAR */}
        <div className="mb-8 bg-white border rounded-2xl p-6 grid grid-cols-2 md:grid-cols-6 gap-6">
          <div>
            <p className="text-sm font-medium">Status</p>
            <p className="mt-2 text-sm text-green-700 font-medium">
              Live Now
            </p>
          </div>

          <div>
            <p className="text-sm font-medium">Time Remaining</p>
            <div className="mt-2 text-sm text-gray-700 font-medium">
              <AuctionCountdown endsAt={auction.endsAt} />
            </div>
          </div>

          <div>
            <p className="text-sm font-medium">Current Bid</p>
            <p className="mt-2 text-sm text-gray-700">
              ${auction.highestBid?.toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium">Starting Bid</p>
            <p className="mt-2 text-sm text-gray-700">
              ${auction.startingBid?.toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium">Increment</p>
            <p className="mt-2 text-sm text-gray-700">
              ${auction.bidIncrement?.toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium">Seller ARV</p>
            <p className="mt-2 text-sm text-gray-700">
              {auction.arv
                ? `$${auction.arv.toLocaleString()}`
                : "Not provided"}
            </p>
          </div>
        </div>

        {/* (rest of your file remains unchanged — gallery, description, bid panel, lightbox) */}
      </div>
    </main>
  );
}