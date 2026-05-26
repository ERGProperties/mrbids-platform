'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* ================= HEADER ================= */}
      <header className="fixed top-0 inset-x-0 z-50 bg-white border-b border-gray-100">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">

          {/* LOGO */}
          <Link href="/" className="flex items-center">
            <Image
              src="/mrbids-logo-transparent.png"
              alt="MrBids"
              width={160}
              height={40}
              priority
              className="h-8 w-auto"
            />
          </Link>

          {/* NAV */}
          <nav className="flex items-center gap-4 sm:gap-8">

            <Link
              href="/live"
              className="text-sm font-medium text-gray-700 hover:text-gray-900"
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
              className="text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Real Estate
            </Link>

            <Link
              href="/coming-soon"
              className="px-5 py-2 rounded-full bg-black text-white text-sm font-medium hover:opacity-90 transition"
            >
              Create an Auction
            </Link>

          </nav>

        </div>

      </header>

      {/* ================= MAIN ================= */}
      <main className="flex-grow pt-[80px]">
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
                <Link href="/coming-soon" className="hover:underline">
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

            </ul>
          </div>

        </div>

        <div className="border-t border-gray-100 py-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} MrBids. All rights reserved.
        </div>

      </footer>
    </>
  )
}