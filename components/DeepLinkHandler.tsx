"use client";

import { useEffect } from "react";

import { App } from "@capacitor/app";

import { useRouter } from "next/navigation";

export default function DeepLinkHandler() {

  const router = useRouter();

  useEffect(() => {

    App.addListener(
      "appUrlOpen",
      async (event) => {

        const url = event.url;

        if (!url) {
          return;
        }

        console.log(
          "Deep link opened:",
          url
        );

        try {

          // Handle auth callbacks
          if (
            url.includes("/api/auth/callback")
          ) {

            // Reload app session
            window.location.href =
              "/auctions";

            return;
          }

          // Handle normal deep links
          const parsedUrl =
            new URL(url);

          const path =
            parsedUrl.pathname;

          if (path) {

            router.push(path);
          }

        } catch (err) {

          console.error(
            "Deep link error:",
            err
          );
        }
      }
    );

  }, [router]);

  return null;
}