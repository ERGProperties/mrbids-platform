"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    // ⭐ IMPORTANT FIX:
    // remove callbackUrl so NextAuth handles magic-link redirect correctly
    await signIn("email", {
      email,
    });

    setLoading(false);
    setSent(true);
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white border rounded-2xl p-8">

        <h1 className="text-2xl font-semibold mb-2">
          Create Account / Sign In
        </h1>

        <p className="text-sm text-gray-600 mb-6">
          Enter your email to sign in or create your bidder account.
          We’ll send you a secure magic link.
        </p>

        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="w-full border rounded-lg px-4 py-3 text-sm"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white rounded-lg py-3 text-sm disabled:opacity-50"
            >
              {loading ? "Sending link..." : "Continue"}
            </button>

          </form>
        ) : (
          <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-4">
            Check your email — your sign-in link has been sent.
          </div>
        )}

      </div>
    </main>
  );
}