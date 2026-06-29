"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { Capacitor } from "@capacitor/core";
import { Browser } from "@capacitor/browser";

export default function SignInPage() {

  const { status } = useSession();

  const searchParams =
    useSearchParams();

  const [email, setEmail] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const isNativeApp =
    Capacitor.isNativePlatform();

  const callbackUrl =
    searchParams.get("callbackUrl")
    || "/auctions";

  useEffect(() => {

    if (status === "authenticated") {

      window.location.href =
        callbackUrl;
    }

  }, [status, callbackUrl]);

  async function handleSubmit(
    e: React.FormEvent
  ) {

    e.preventDefault();

    setLoading(true);

    await signIn(
      "email",
      {
        email,
        callbackUrl,
      }
    );

    setLoading(false);
  }

  return (

    <main className="min-h-screen relative overflow-hidden bg-black flex items-center justify-center px-4">

      {/* BACKGROUND */}

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
            Secure access for verified marketplace bidders
          </p>

        </div>

        {/* TITLE */}

        <h2 className="text-2xl font-semibold text-gray-900 text-center">
          Sign in to continue
        </h2>

        <p className="text-sm text-gray-600 text-center mt-2 mb-6">
          Continue with Apple, Google, or Magic Link.
        </p>

        {/* GOOGLE */}

        <button
          onClick={async () => {

            if (isNativeApp) {

              await Browser.open({
                url:
                  `${window.location.origin}/api/auth/signin/google?callbackUrl=/auctions`,
              });

              return;
            }

            signIn(
              "google",
              { callbackUrl }
            );

          }}
          className="w-full rounded-xl border border-gray-300 bg-white py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition flex items-center justify-center gap-3"
        >

          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            className="w-5 h-5"
          >

            <path
              fill="#FFC107"
              d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"
            />

            <path
              fill="#FF3D00"
              d="M6.3 14.7l6.6 4.8C14.7 16 19 12 24 12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.1 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
            />

            <path
              fill="#4CAF50"
              d="M24 44c5.2 0 10-2 13.5-5.3l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.5 39.5 16.2 44 24 44z"
            />

            <path
              fill="#1976D2"
              d="M43.6 20.5H42V20H24v8h11.3c-1.1 3-3.4 5.3-6.5 6.5l6.2 5.2C39.6 36 44 30.6 44 24c0-1.3-.1-2.3-.4-3.5z"
            />

          </svg>

          Continue with Google

        </button>

        {/* APPLE */}

        <button
          type="button"
          onClick={async () => {

            if (isNativeApp) {

              await Browser.open({
                url:
                  `${window.location.origin}/api/auth/signin/apple?callbackUrl=/auctions`,
              });

              return;
            }

            signIn(
              "apple",
              { callbackUrl }
            );

          }}
          className="mt-4 w-full rounded-xl bg-black py-3 text-sm font-medium text-white hover:bg-gray-900 transition flex items-center justify-center gap-3"
        >

          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
          >

            <path d="M16.365 1.43c0 1.14-.466 2.19-1.224 2.94-.825.82-2.173 1.45-3.34 1.36-.15-1.11.42-2.3 1.17-3.05.82-.83 2.24-1.42 3.394-1.25.03.1.045.2.045.3zm4.207 16.978c-.57 1.31-.84 1.89-1.574 3.02-1.02 1.57-2.46 3.53-4.25 3.55-1.59.02-2-.99-4.16-.98-2.16.01-2.61 1-4.2.98-1.79-.02-3.15-1.79-4.17-3.36-2.86-4.38-3.16-9.52-1.4-12.22 1.25-1.93 3.23-3.06 5.09-3.06 1.9 0 3.09 1.04 4.66 1.04 1.52 0 2.45-1.04 4.65-1.04 1.66 0 3.43.9 4.68 2.45-4.12 2.26-3.45 8.14.67 9.62z" />

          </svg>

          Continue with Apple

        </button>

        {/* DIVIDER */}

        <div className="relative my-6">

          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>

          <div className="relative flex justify-center text-xs uppercase">

            <span className="bg-white px-2 text-gray-500">
              Or continue with email
            </span>

          </div>

        </div>

        {/* MAGIC LINK */}

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            required
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-black text-white py-3 text-sm font-medium hover:bg-gray-900 transition disabled:opacity-60"
          >

            {loading
              ? "Sending magic link..."
              : "Send Magic Link"}

          </button>

        </form>

        {/* TRUST */}

        <p className="mt-6 text-xs text-gray-500 text-center">
          🔒 Secure authentication powered by MrBids.
        </p>

      </div>

    </main>
  );
}