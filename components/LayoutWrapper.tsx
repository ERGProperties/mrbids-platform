'use client'

import Image from 'next/image'
import Link from 'next/link'

import { useSession, signOut } from "next-auth/react"

import MobileBottomNav from "./MobileBottomNav"
import LiveActivityToasts from "./LiveActivityToasts"
import NotificationBell from "@/components/notifications/NotificationBell"

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {

  const {
    data: session,
    status,
  } = useSession()

  return (
    <>
      {/* ================= HEADER ================= */}
      <header
  className="fixed inset-x-0 z-50 bg-white border-b border-gray-100"
  style={{
    top: "env(safe-area-inset-top)",
  }}
>

  <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">

          {/* LOGO */}
          <Link href="/" className="flex items-center">
            <Image
              src="/mrbids-logo-transparent.png"
              alt="MrBids"
              width={160}
              height={40}
              priority
              className="h-6 sm:h-8 w-auto"
            />
          </Link>

          {/* NAV */}
          <nav className="flex items-center gap-2 sm:gap-8">

            <Link
              href="/live"
              className="hidden sm:block text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              LIVE
            </Link>

            <Link
              href="/categories"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 hidden sm:block"
            >
              Categories
            </Link>

            <Link
              href="/real-estate"
              className="hidden sm:block text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Real Estate
            </Link>

            {/* NOTIFICATION BELL */}
            <NotificationBell />

            {status === "loading" ? null : session ? (

              <div className="flex items-center gap-3">

                <Link
                  href="/marketplace-sell"
                  className="px-4 sm:px-5 py-2 rounded-full bg-black text-white text-xs sm:text-sm font-medium hover:opacity-90 transition"
                >
                  <span className="sm:hidden">
                    Sell
                  </span>

                  <span className="hidden sm:inline">
                    Create an Auction
                  </span>
                </Link>

                <button
                  onClick={() =>
                    signOut({
                      callbackUrl: "/",
                    })
                  }
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Logout
                </button>

              </div>

            ) : (

              <Link
                href="/signin?callbackUrl=/live"
                className="px-4 sm:px-5 py-2 rounded-full bg-black text-white text-sm font-medium hover:opacity-90 transition"
              >
                Sign In
              </Link>

            )}

          </nav>

        </div>

      </header>

      {/* ================= MAIN ================= */}
      <main
  className="flex-grow sm:pt-[80px]"
  style={{
    paddingTop: "calc(env(safe-area-inset-top) + 64px)",
  }}
>
  {children}
</main>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-gray-100 bg-white">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">

          <div>
            <p className="text-sm font-semibold text-gray-900">
              MrBids
            </p>

            <p className="mt-4 text-sm text-gray-600 max-w-sm">
              A LIVE marketplace auction platform for real-time bidding,
              liquidation deals, collectibles, luxury items, and real estate.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-900">
              Marketplace
            </p>

            <ul className="mt-4 space-y-3 text-sm text-gray-600">

              <li>
                <Link href="/live" className="hover:underline">
                  LIVE Auctions
                </Link>
              </li>

              <li>
                <Link href="/categories" className="hover:underline">
                  Categories
                </Link>
              </li>

              <li>
                <Link href="/marketplace-sell" className="hover:underline">
                  Create an Auction
                </Link>
              </li>

            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-900">
              Real Estate
            </p>

            <ul className="mt-4 space-y-3 text-sm text-gray-600">

              <li>
                <Link href="/real-estate" className="hover:underline">
                  Browse Properties
                </Link>
              </li>

              <li>
                <Link
                  href="/real-estate/sell-property"
                  className="hover:underline"
                >
                  Sell a Property
                </Link>
              </li>

            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-900">
              Legal
            </p>

            <ul className="mt-4 space-y-3 text-sm text-gray-600">

              <li>
                <Link href="/terms" className="hover:underline">
                  Terms of Service
                </Link>
              </li>

              <li>
                <Link href="/privacy" className="hover:underline">
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link href="/seller-policy" className="hover:underline">
                  Seller Policy
                </Link>
              </li>

              <li>
                <Link href="/refund-policy" className="hover:underline">
                  Refund Policy
                </Link>
              </li>

              <li>
                <Link href="/disclosures" className="hover:underline">
                  Disclosures
                </Link>
              </li>

              <li>
                <Link href="/delete-account" className="hover:underline">
                  Delete Account
                </Link>
              </li>

            </ul>
          </div>

        </div>

        <div className="border-t border-gray-100 py-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} MrBids. All rights reserved.
        </div>

      </footer>

      <LiveActivityToasts />

      <MobileBottomNav />

    </>
  )
}