import "./globals.css";
import type { Metadata } from "next";
import SessionProvider from "@/components/auth/SessionProvider";
import LayoutWrapper from "@/components/LayoutWrapper";

export const metadata: Metadata = {
  title: "MrBids",
  description: "Seller-Direct Real Estate Auctions",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      {
        url: "/favicon-96x96.png",
        sizes: "96x96",
        type: "image/png",
      },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />

        <meta name="mobile-web-app-capable" content="yes" />

        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-title" content="MrBids" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>

      <body className="bg-white text-gray-900 antialiased flex flex-col min-h-screen">
        <SessionProvider>

          <LayoutWrapper>
            {children}
          </LayoutWrapper>

        </SessionProvider>
      </body>
    </html>
  );
}