"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function SignInPage() {
  const { status } = useSession();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      window.location.href = "/auctions";
    }
  }, [status]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    await signIn("email", {
      email,
      callbackUrl: "/auctions",
    });

    setLoading(false);
  }

  return (
    <main className="min-h-screen relative overflow-hidden bg-black flex items-center justify-center px-4">

      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800 opacity-90" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-white/10 blur-3xl rounded-full" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-white/10 blur-3xl rounded-full" />

      {/* CARD */}
      <div className="relative w-full max-w-md bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 md:p-10">

        {/* BRAND */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
            MrBids
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Secure access for verified real estate bidders
          </p>
        </div>

        {/* TITLE */}
        <h2 className="text-2xl font-semibold text-gray-900 text-center">
          Sign in to continue
        </h2>

        <p className="text-sm text-gray-600 text-center mt-2 mb-6">
          We’ll email you a secure magic link.
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-black text-white py-3 text-sm font-medium hover:bg-gray-900 transition disabled:opacity-60"
          >
            {loading ? "Sending magic link..." : "Send Magic Link"}
          </button>

        </form>

        {/* TRUST TEXT */}
        <p className="mt-6 text-xs text-gray-500 text-center">
          🔒 Magic links expire automatically for your security.
        </p>

      </div>
    </main>
  );
}