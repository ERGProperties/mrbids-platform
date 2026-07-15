"use client";

import { useEffect } from "react";
import { App } from "@capacitor/app";
import { useRouter } from "next/navigation";

export default function DeepLinkHandler() {
  const router = useRouter();

  useEffect(() => {
    const navigate = (url: string) => {
      try {
        console.log("🔗 OPENED URL:", url);

        const parsedUrl = new URL(url);
        const fullPath = `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`;

        router.push(fullPath);
      } catch (err) {
        console.error("❌ Deep link error:", err);
      }
    };

    // App already running
    const listener = App.addListener("appUrlOpen", (event) => {
      if (event.url) {
        navigate(event.url);
      }
    });

    // App launched from a deep link
    App.getLaunchUrl().then((result) => {
      if (result?.url) {
        navigate(result.url);
      }
    });

    return () => {
      listener.then((handle) => handle.remove());
    };
  }, [router]);

  return null;
}