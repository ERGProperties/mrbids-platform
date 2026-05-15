"use client";

import { useState } from "react";

export default function SellerOnboardingPage() {

  const [form, setForm] = useState({
    name: "",
    sellerCategory: "Jewelry",
    tiktokUsername: "",
    sellerBio: "",
    avatarUrl: "",
  });

  const [loading, setLoading] = useState(false);

  const [uploading, setUploading] =
    useState(false);

  const [error, setError] = useState("");

  // CLOUDINARY DIRECT UPLOAD
  async function handleImageUpload(
    file: File
  ) {

    const formData = new FormData();

    formData.append("file", file);

    formData.append(
      "upload_preset",
      "mrbids_upload"
    );

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dx1okt4vf/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();

    return data.secure_url;
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {

    e.preventDefault();

    setLoading(true);

    setError("");

    try {

      const res = await fetch(
        "/api/seller/onboarding",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ||
          "Something went wrong"
        );
      }

      window.location.href =
        "/seller/dashboard";

    } catch (err: any) {

      setError(
        err.message ||
        "Failed to complete onboarding"
      );

    } finally {

      setLoading(false);

    }
  }

  return (
    <main className="min-h-screen bg-white">

      <section className="max-w-3xl mx-auto px-6 pt-32 pb-32">

        <div className="text-center mb-14">

          <p className="text-sm font-medium text-gray-500 uppercase tracking-[0.18em] mb-6">
            Seller Onboarding
          </p>

          <h1 className="text-5xl md:text-6xl font-semibold leading-[1.02]">
            Create Your Seller Profile
          </h1>

          <p className="mt-8 text-xl text-gray-600">
            Build your LIVE marketplace identity.
          </p>

        </div>

        <div className="border rounded-3xl p-8 md:p-12">

          <form
            onSubmit={handleSubmit}
            className="space-y-8"
          >

            {/* NAME */}
            <div>

              <label className="block text-sm font-medium mb-3">
                Seller Name
              </label>

              <input
                type="text"
                required
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                placeholder="Your seller name"
                className="w-full border rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-black"
              />

            </div>

            {/* PROFILE PHOTO */}
            <div>

              <label className="block text-sm font-medium mb-3">
                Profile Photo
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {

                  const file =
                    e.target.files?.[0];

                  if (!file) return;

                  setUploading(true);

                  try {

                    const url =
                      await handleImageUpload(
                        file
                      );

                    setForm({
                      ...form,
                      avatarUrl: url,
                    });

                  } catch (err) {

                    console.error(err);

                    setError(
                      "Image upload failed"
                    );

                  }

                  setUploading(false);

                }}
                className="w-full border rounded-2xl px-5 py-4"
              />

              {form.avatarUrl && (

                <div className="mt-6">

                  <img
                    src={form.avatarUrl}
                    alt="Preview"
                    className="w-28 h-28 rounded-full object-cover border"
                  />

                </div>

              )}

              {uploading && (
                <p className="text-sm text-gray-500 mt-3">
                  Uploading image...
                </p>
              )}

            </div>

            {/* CATEGORY */}
            <div>

              <label className="block text-sm font-medium mb-3">
                Primary Selling Category
              </label>

              <select
                value={form.sellerCategory}
                onChange={(e) =>
                  setForm({
                    ...form,
                    sellerCategory:
                      e.target.value,
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

            {/* TIKTOK */}
            <div>

              <label className="block text-sm font-medium mb-3">
                TikTok Username
              </label>

              <input
                type="text"
                value={form.tiktokUsername}
                onChange={(e) =>
                  setForm({
                    ...form,
                    tiktokUsername:
                      e.target.value,
                  })
                }
                placeholder="@username"
                className="w-full border rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-black"
              />

            </div>

            {/* BIO */}
            <div>

              <label className="block text-sm font-medium mb-3">
                Seller Bio
              </label>

              <textarea
                rows={5}
                value={form.sellerBio}
                onChange={(e) =>
                  setForm({
                    ...form,
                    sellerBio:
                      e.target.value,
                  })
                }
                placeholder="Tell buyers about what you sell..."
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
              disabled={
                loading || uploading
              }
              className="w-full py-5 rounded-full bg-black text-white font-medium hover:opacity-90 transition disabled:opacity-50"
            >
              {loading
                ? "Creating Seller Profile..."
                : "Complete Seller Setup"}
            </button>

          </form>

        </div>

      </section>

    </main>
  );
}