"use client";

import { useEffect } from "react";
import { App } from "@capacitor/app";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";

export default function DeepLinkHandler() {
  const router = useRouter();

  useEffect(() => {
    const navigate = (url: string) => {
      try {
        console.log("========== APP URL OPEN ==========");
        console.log("Raw URL:", url);

        console.log("Full Deep Link:", decodeURIComponent(url));

        const parsedUrl = new URL(url);

        console.log("Origin:", parsedUrl.origin);
        console.log("Pathname:", parsedUrl.pathname);
        console.log("Search:", parsedUrl.search);
        console.log("Hash:", parsedUrl.hash);

        const fullPath =
          `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`;

        console.log("Navigating to:", fullPath);

        router.push(fullPath);

      } catch (err) {

        console.error("❌ Deep link error:", err);

      }
    };

    // App already running
    const listener = App.addListener(
      "appUrlOpen",
      (event) => {
        if (event.url) {
          navigate(event.url);
        }
      }
    );

    // App launched from a deep link
    App.getLaunchUrl().then((result) => {
      if (result?.url) {
        console.log("========== APP LAUNCH URL ==========");
        navigate(result.url);
      }
    });

// App resumed (for example after Safari closes)
const resumeListener = App.addListener("resume", async () => {
  console.log("========== APP RESUMED ==========");

  try {
    await getSession();

    // Force the page to re-render using the refreshed session
    router.refresh();

    console.log("Session refresh complete.");
  } catch (err) {
    console.error("Session refresh failed:", err);
  }
});

    return () => {
  listener.then((handle) => handle.remove());
  resumeListener.then((handle) => handle.remove());
};
  }, [router]);

  return null;
}