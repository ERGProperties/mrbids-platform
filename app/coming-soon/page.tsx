"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

declare const fbq: any;

export default function SellerOnboardingPage() {

  const [email, setEmail] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {

    e.preventDefault();

    setLoading(true);

    setError("");

    try {

      const result =
        await signIn("email", {
          email,

          redirect: false,

          callbackUrl:
            "/marketplace-sell",
        });

      if (result?.error) {
        throw new Error(
          result.error
        );
      }

      setSuccess(true);

    } catch (err: any) {

      setError(
        err.message ||
        "Failed to send login link"
      );

    } finally {

      setLoading(false);

    }
  }

  return (
    <main className="min-h-screen bg-white">

      {/* HERO */}
      <section className="max-w-5xl mx-auto px-6 pt-32 pb-20 text-center">

        <p className="text-sm font-medium text-gray-500 uppercase tracking-[0.18em] mb-6">
          MrBids Marketplace
        </p>

        <h1 className="text-5xl md:text-7xl font-semibold leading-[1.02]">
          Become a Seller
        </h1>

        <p className="mt-8 text-xl text-gray-600 max-w-2xl mx-auto">
          Start selling on MrBids using secure passwordless login.
        </p>

      </section>

      {/* LOGIN */}
      <section className="pb-32">

        <div className="max-w-2xl mx-auto px-6">

          <div className="border rounded-3xl p-8 md:p-12">

            {success ? (

              <div className="text-center py-8">

                <div className="text-6xl mb-6">
                  ✉️
                </div>

                <h2 className="text-3xl font-semibold">
                  Check Your Email
                </h2>

                <p className="mt-4 text-gray-600">
                  We sent you a secure Magic Link to continue selling on MrBids.
                </p>

              </div>

            ) : (

              <>

                <button
                  onClick={async () => {

                    fbq('track', 'CompleteRegistration');

                    await signIn("google", {
                      callbackUrl: "/marketplace-sell",
                    });

                  }}
                  className="w-full py-5 rounded-full border border-gray-300 bg-white text-black font-medium hover:bg-gray-50 transition flex items-center justify-center gap-3"
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

                  Continue With Google
                </button>

                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>

                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-4 text-gray-500">
                      Or continue with magic link
                    </span>
                  </div>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="space-y-8"
                >

                  <div>

                    <label className="block text-sm font-medium mb-3">
                      Email Address
                    </label>

                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) =>
                        setEmail(
                          e.target.value
                        )
                      }
                      placeholder="you@example.com"
                      className="w-full border rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-black"
                    />

                  </div>

                  {error && (
                    <div className="text-sm text-red-600">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-5 rounded-full bg-black text-white font-medium hover:opacity-90 transition disabled:opacity-50"
                  >
                    {loading
                      ? "Sending Magic Link..."
                      : "Continue With Magic Link"}
                  </button>

                </form>

              </>

            )}

          </div>

        </div>

      </section>

    </main>
  );
}