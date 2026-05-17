"use client";

import { useState } from "react";

import { signIn } from "next-auth/react";

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

            )}

          </div>

        </div>

      </section>

    </main>
  );
}