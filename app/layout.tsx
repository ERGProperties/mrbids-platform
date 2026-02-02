import "./globals.css";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "MrBids",
  description: "Seller-Direct Real Estate Auctions",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 antialiased flex flex-col min-h-screen">
        {/* HEADER */}
        <header className="fixed top-0 inset-x-0 z-50 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            {/* LOGO */}
            <Link href="/" className="flex items-center">
              <Image
                src="/mrbids-logo-transparent.png"
                alt="MrBids — Seller-Direct Real Estate Auctions"
                width={160}
                height={40}
                priority
                className="h-8 w-auto"
              />
            </Link>

            {/* NAV */}
            <nav className="flex items-center gap-8">
              <Link
                href="/auctions"
                className="text-sm font-medium text-gray-700 hover:text-gray-900 transition"
              >
                Browse Auctions
              </Link>

              <Link
                href="/sell"
                className="text-sm font-medium text-gray-700 hover:text-gray-900 transition"
              >
                Sell a Property
              </Link>

              <Link
                href="/join"
                className="px-5 py-2.5 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-900 transition"
              >
                Request Access
              </Link>
            </nav>
          </div>
        </header>

        {/* MAIN */}
        <main className="flex-grow pt-20">
          {children}
        </main>

        {/* FOOTER */}
        <footer className="border-t border-gray-100 bg-white">
          <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <p className="text-sm font-semibold text-gray-900">MrBids</p>
              <p className="mt-4 text-sm text-gray-600 max-w-sm">
                A private, seller-direct real estate auction marketplace
                designed for transparency, control, and verified
                participation.
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-900">Marketplace</p>
              <ul className="mt-4 space-y-3 text-sm text-gray-600">
                <li>
                  <Link href="/auctions" className="hover:underline">
                    Browse Auctions
                  </Link>
                </li>
                <li>
                  <Link href="/sell" className="hover:underline">
                    Sell a Property
                  </Link>
                </li>
                <li>
                  <Link href="/join" className="hover:underline">
                    Request Access
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-900">Legal</p>
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
      </body>
    </html>
  );
}
