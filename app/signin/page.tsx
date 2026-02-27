"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function SignInPage() {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");

  // ⭐ CRITICAL FIX — wait until session is fully loaded
  useEffect(() => {
    if (status === "authenticated") {
      window.location.href = "/auctions";
    }
  }, [status]);

  if (status === "loading") {
    return null;
  }

  return (
    <main style={{ maxWidth: 400, margin: "80px auto" }}>
      <h1>Sign in to MrBids</h1>

      <form
        onSubmit={async (e) => {
          e.preventDefault();

          await signIn("email", {
            email,
            callbackUrl: "/auctions",
          });
        }}
      >
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "12px",
            marginBottom: "12px",
          }}
        />

        <button type="submit">Send magic link</button>
      </form>
    </main>
  );
}