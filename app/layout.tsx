import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";

import SessionProvider from "@/components/auth/SessionProvider";
import LayoutWrapper from "@/components/LayoutWrapper";
import PushNotificationSetup from "@/components/PushNotificationSetup";

export const metadata: Metadata = {
  title: "MrBids",
  description:
    "LIVE marketplace auctions starting at $1.",

  manifest: "/manifest.json",

  icons: {
    icon: [
      { url: "/favicon.ico" },
      {
        url: "/favicon-96x96.png",
        sizes: "96x96",
        type: "image/png",
      },
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
      },
    ],

    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (

    <html lang="en">

      <head>

        <link
          rel="manifest"
          href="/manifest.json"
        />

        <meta
          name="theme-color"
          content="#000000"
        />

        <meta
          name="mobile-web-app-capable"
          content="yes"
        />

        <meta
          name="apple-mobile-web-app-capable"
          content="yes"
        />

        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black"
        />

        <meta
          name="apple-mobile-web-app-title"
          content="MrBids"
        />

        <link
          rel="apple-touch-icon"
          href="/icon-192.png"
        />

        {/* Google Ads Tag */}

        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-18177376162"
        />

        <Script
          id="google-ads-tag"
          strategy="afterInteractive"
        >

          {`
            window.dataLayer = window.dataLayer || [];

            function gtag(){
              dataLayer.push(arguments);
            }

            gtag('js', new Date());

            gtag('config', 'AW-18177376162');
          `}

        </Script>

      </head>

      <body className="bg-white text-gray-900 antialiased flex flex-col min-h-screen">

        <SessionProvider>

          <PushNotificationSetup />

          <LayoutWrapper>

            {children}

          </LayoutWrapper>

        </SessionProvider>

      </body>

    </html>

  );
}