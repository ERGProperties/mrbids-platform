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
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">

      <div className="w-full max-w-5xl grid md:grid-cols-2 bg-white rounded-3xl shadow-lg overflow-hidden border">

        {/* LEFT SIDE — BRAND */}
        <div className="hidden md:flex flex-col justify-center bg-black text-white p-10">
          <h1 className="text-3xl font-semibold mb-4">
            MrBids
          </h1>

          <p className="text-gray-300 text-sm leading-relaxed">
            Private real estate auctions made simple.
            <br />
            Secure bidding. Verified buyers. Real results.
          </p>

          <div className="mt-8 text-xs text-gray-400">
            🔒 Secure email authentication
          </div>
        </div>

        {/* RIGHT SIDE — SIGN IN */}
        <div className="p-8 md:p-10 flex flex-col justify-center">

          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Sign in to continue
          </h2>

          <p className="text-sm text-gray-600 mb-6">
            Enter your email and we’ll send you a secure magic link.
          </p>

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

          <p className="mt-6 text-xs text-gray-500 text-center">
            Magic links expire automatically for your security.
          </p>

        </div>
      </div>
    </main>
  );
}