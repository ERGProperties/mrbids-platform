"use client";

import { useState } from "react";

export default function ComingSoonPage() {

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    tiktok: "",
    category: "Jewelry",
    inventory: "",
  });

  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState(false);

  const [error, setError] = useState("");

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/seller-application", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Something went wrong"
        );
      }

      setSuccess(true);

      setForm({
        fullName: "",
        email: "",
        tiktok: "",
        category: "Jewelry",
        inventory: "",
      });

    } catch (err: any) {
      setError(err.message || "Failed to submit");
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
          Apply to become an early seller on the next generation
          of LIVE marketplace auctions.
        </p>

      </section>

      {/* FORM */}
      <section className="pb-32">

        <div className="max-w-3xl mx-auto px-6">

          <div className="border rounded-3xl p-8 md:p-12">

            {success ? (

              <div className="text-center py-10">

                <div className="text-6xl mb-6">
                  ✅
                </div>

                <h2 className="text-3xl font-semibold">
                  Application Submitted
                </h2>

                <p className="mt-4 text-gray-600">
                  Thank you for applying to become a seller on MrBids.
                </p>

              </div>

            ) : (

              <form
                onSubmit={handleSubmit}
                className="space-y-8"
              >

                {/* NAME */}
                <div>

                  <label className="block text-sm font-medium mb-3">
                    Full Name
                  </label>

                  <input
                    type="text"
                    required
                    value={form.fullName}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        fullName: e.target.value,
                      })
                    }
                    placeholder="Your name"
                    className="w-full border rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-black"
                  />

                </div>

                {/* EMAIL */}
                <div>

                  <label className="block text-sm font-medium mb-3">
                    Email Address
                  </label>

                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        email: e.target.value,
                      })
                    }
                    placeholder="you@example.com"
                    className="w-full border rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-black"
                  />

                </div>

                {/* TIKTOK */}
                <div>

                  <label className="block text-sm font-medium mb-3">
                    TikTok Username
                  </label>

                  <input
                    type="text"
                    value={form.tiktok}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        tiktok: e.target.value,
                      })
                    }
                    placeholder="@username"
                    className="w-full border rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-black"
                  />

                </div>

                {/* CATEGORY */}
                <div>

                  <label className="block text-sm font-medium mb-3">
                    Primary Selling Category
                  </label>

                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        category: e.target.value,
                      })
                    }
                    className="w-full border rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-black"
                  >
                    <option>Jewelry</option>
                    <option>Electronics</option>
                    <option>Sneakers</option>
                    <option>Collectibles</option>
                    <option>Liquidation</option>
                    <option>Luxury Items</option>
                    <option>Storage Finds</option>
                    <option>Other</option>
                  </select>

                </div>

                {/* INVENTORY */}
                <div>

                  <label className="block text-sm font-medium mb-3">
                    Tell Us About Your Inventory
                  </label>

                  <textarea
                    rows={5}
                    required
                    value={form.inventory}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        inventory: e.target.value,
                      })
                    }
                    placeholder="Describe what you plan to sell..."
                    className="w-full border rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-black resize-none"
                  />

                </div>

                {/* ERROR */}
                {error && (
                  <div className="text-red-600 text-sm">
                    {error}
                  </div>
                )}

                {/* SUBMIT */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 rounded-full bg-black text-white font-medium hover:opacity-90 transition disabled:opacity-50"
                >
                  {loading
                    ? "Submitting..."
                    : "Submit Seller Application"}
                </button>

              </form>

            )}

          </div>

        </div>

      </section>

    </main>
  );
}