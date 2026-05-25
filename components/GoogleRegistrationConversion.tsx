"use client";

import { useEffect } from "react";

export default function GoogleRegistrationConversion() {

  useEffect(() => {

    if (typeof window !== "undefined" && window.gtag) {

      window.gtag("event", "conversion", {
        send_to:
          "AW-18177376162/OdB9CMfGoLMcEKL_0ttD",
      });

    }

  }, []);

  return null;

}