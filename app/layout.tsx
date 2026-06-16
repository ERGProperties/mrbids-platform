import "./globals.css";

import type { Metadata }
  from "next";

import Script
  from "next/script";

import SessionProvider
  from "@/components/auth/SessionProvider";

import LayoutWrapper
  from "@/components/LayoutWrapper";

import PushNotificationSetup
  from "@/components/PushNotificationSetup";

import DeepLinkHandler
  from "@/components/DeepLinkHandler";

export const metadata: Metadata = {
  title: "MrBids",

  description:
    "LIVE marketplace auctions starting at $1.",

  manifest:
    "/manifest.json",

  icons: {
    icon: [
      {
        url:
          "/favicon.ico",
      },

      {
        url:
          "/favicon-96x96.png",

        sizes:
          "96x96",

        type:
          "image/png",
      },

      {
        url:
          "/favicon.svg",

        type:
          "image/svg+xml",
      },
    ],

    apple:
      "/apple-touch-icon.png",
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

        {/* META PIXEL */}

        <Script
          id="meta-pixel"
          strategy="afterInteractive"
        >

          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;
            n.push=n;
            n.loaded=!0;
            n.version='2.0';
            n.queue=[];
            t=b.createElement(e);
            t.async=!0;
            t.src=v;
            s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}
            (window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');

            fbq('init', '1770465987450966');
            fbq('track', 'PageView');
          `}

        </Script>

        <noscript>

          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1770465987450966&ev=PageView&noscript=1"
            alt=""
          />

        </noscript>

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

          <DeepLinkHandler />

          <LayoutWrapper>

            {children}

          </LayoutWrapper>

        </SessionProvider>

      </body>

    </html>

  );
}