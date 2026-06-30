"use client";

import { useEffect } from "react";

import { App } from "@capacitor/app";

import { useRouter } from "next/navigation";

export default function DeepLinkHandler() {

  const router =
    useRouter();

  useEffect(() => {

    App.addListener(
      "appUrlOpen",
      async (event) => {

        const url =
          event.url;

        if (!url) {
          return;
        }

        try {

          console.log(
            "🔗 OPENED URL:",
            url
          );

          const parsedUrl =
            new URL(url);

          const pathname =
            parsedUrl.pathname;

          const search =
            parsedUrl.search;

          const fullPath =
            `${pathname}${search}`;

          router.push(
            fullPath
          );

        } catch (err) {

          console.error(
            "❌ Deep link error:",
            err
          );
        }
      }
    );

  }, [router]);

  return null;
}