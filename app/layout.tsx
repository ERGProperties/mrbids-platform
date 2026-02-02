import "./globals.css";
import type { Metadata } from "next";

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
        <header className="fixed top-0 inset-x-0 z-50 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <a href="/" className="text-lg font-semibold tracking-tight text-gray-900">
              MrBids
            </a>

            <div className="flex items-center gap-6">
              <a href="/auctions" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                Browse Auctions
              </a>

              <a href="/sell" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                Sell a Property
              </a>

              <a href="/account-required" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                Log In
              </a>

              <a
                href="/join"
                className="px-5 py-2.5 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-900 transition"
              >
                Request Access
              </a>
            </div>
          </div>
        </header>

        <main className="flex-grow pt-20">{children}</main>

        <footer className="border-t border-gray-100 bg-white">
          <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <p className="text-sm font-semibold text-gray-900">MrBids</p>
              <p className="mt-4 text-sm text-gray-500 max-w-sm">
                A private, seller-direct auction marketplace for institutional-grade real estate transactions.
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-gray-400">Marketplace</p>
              <ul className="mt-4 space-y-3 text-sm">
                <li><a href="/auctions" className="text-gray-600 hover:text-gray-900">Browse Auctions</a></li>
                <li><a href="/sell" className="text-gray-600 hover:text-gray-900">Sell a Property</a></li>
              </ul>
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-gray-400">Support</p>
              <ul className="mt-4 space-y-3 text-sm">
                <li><a href="/faq" className="text-gray-600 hover:text-gray-900">Seller FAQ</a></li>
                <li><a href="/buyer-faq" className="text-gray-600 hover:text-gray-900">Buyer FAQ</a></li>
                <li><a href="mailto:support@mrbids.com" className="text-gray-600 hover:text-gray-900">support@mrbids.com</a></li>
              </ul>
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-gray-400">Legal</p>
              <ul className="mt-4 space-y-3 text-sm">
                <li><a href="/terms" className="text-gray-600 hover:text-gray-900">Terms of Service</a></li>
                <li><a href="/privacy" className="text-gray-600 hover:text-gray-900">Privacy Policy</a></li>
                <li><a href="/disclosures" className="text-gray-600 hover:text-gray-900">Disclosures</a></li>
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
