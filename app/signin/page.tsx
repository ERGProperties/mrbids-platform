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
    <main className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 flex items-center justify-center px-4">

      <div className="w-full max-w-5xl grid md:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl border border-gray-200 bg-white/80 backdrop-blur">

        {/* LEFT — BRAND SIDE */}
        <div className="hidden md:flex flex-col justify-between bg-black text-white p-10">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight">
              MrBids
            </h1>

            <p className="mt-4 text-gray-300 text-sm leading-relaxed max-w-sm">
              A modern real estate auction platform built for serious buyers
              and verified bidding.
            </p>
          </div>

          <div className="text-xs text-gray-400">
            🔒 Secure email authentication
          </div>
        </div>

        {/* RIGHT — SIGN IN CARD */}
        <div className="p-8 md:p-12 flex flex-col justify-center">

          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Welcome back
          </h2>

          <p className="mt-2 text-sm text-gray-600 mb-6">
            Enter your email to receive a secure magic link.
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