"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export default function GoogleAdsConversion() {
  useEffect(() => {
    if (window.gtag) {
      window.gtag("event", "conversion", {
        send_to: "AW-18177376162/m15sCNe34bAcEKL_0ttD",
        value: 1.0,
        currency: "USD",
      });
    }
  }, []);

  return null;
}