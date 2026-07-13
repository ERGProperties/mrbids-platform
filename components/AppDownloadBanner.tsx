"use client";

import { Capacitor } from "@capacitor/core";
import { useMemo } from "react";
import Link from "next/link";
import { APP_LINKS } from "@/lib/app-links";

export default function AppDownloadBanner() {
  const isNativeApp = useMemo(
    () => Capacitor.isNativePlatform(),
    []
  );

  // Don't show inside the native app
  if (isNativeApp) {
    return null;
  }

  return (
    <section className="border-y bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

          <div>

            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              NOW AVAILABLE
            </p>

            <h2 className="mt-2 text-2xl md:text-3xl font-bold">
              Download the Official MrBids App
            </h2>

            <p className="mt-2 text-gray-600">
              Bid faster, receive instant outbid alerts, and never miss an auction.
            </p>

          </div>

          <div className="flex flex-wrap gap-4">

            <Link
              href={APP_LINKS.ios}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/images/app-store-badge.svg"
                alt="Download on the App Store"
                className="h-14 w-auto"
              />
            </Link>

            <Link
              href={APP_LINKS.android}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/images/google-play-badge.png"
                alt="Get it on Google Play"
                className="h-14 w-auto"
              />
            </Link>

          </div>

        </div>

      </div>
    </section>
  );
}