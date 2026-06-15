"use client";

import { useEffect }
  from "react";

import { App }
  from "@capacitor/app";

import { useRouter }
  from "next/navigation";

export default function DeepLinkHandler() {

  const router =
    useRouter();

  useEffect(() => {

    App.addListener(
      "appUrlOpen",
      (event) => {

        const url =
          event.url;

        if (!url) {
          return;
        }

        try {

          const parsedUrl =
            new URL(url);

          const path =
            parsedUrl.pathname;

          if (path) {

            router.push(
              path
            );
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