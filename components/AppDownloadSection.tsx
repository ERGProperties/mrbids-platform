"use client";

import { Capacitor } from "@capacitor/core";
import { useMemo } from "react";
import Link from "next/link";
import { APP_LINKS } from "@/lib/app-links";

type Props = {
  title?: string;
  description?: string;
};

export default function AppDownloadSection({
  title = "Download the Official MrBids App",
  description = "Bid live, receive instant notifications, and never miss an auction.",
}: Props) {
  const isNativeApp = useMemo(
    () => Capacitor.isNativePlatform(),
    []
  );

  // Hide the download section when the user is already
  // using the native iOS or Android app.
  if (isNativeApp) {
    return null;
  }

  return (
    <section className="rounded-3xl border bg-gradient-to-br from-gray-50 to-white p-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

        <div className="max-w-xl">

          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            AVAILABLE NOW
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            {title}
          </h2>

          <p className="mt-4 text-gray-600">
            {description}
          </p>

        </div>

        <div className="flex flex-col gap-4 mt-6">

          <Link
            href={APP_LINKS.ios}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/images/app-store-badge.svg"
              alt="Download on the App Store"
              className="w-44 h-auto"
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
              className="w-44 h-auto"
            />
          </Link>

        </div>

      </div>
    </section>
  );
}