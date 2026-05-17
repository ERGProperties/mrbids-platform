"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

export default function MarketplaceSellPage() {

  const router =
    useRouter();

  const [loading, setLoading] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [form, setForm] =
    useState({
      title: "",
      description: "",
      category: "Jewelry",
      startingBid: 1,
      bidIncrement: 1,
      coverImage: "",
    });

  // CLOUDINARY UPLOAD
  async function handleImageUpload(
    file: File
  ) {

    const formData =
      new FormData();

    formData.append(
      "file",
      file
    );

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

    const data =
      await res.json();

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
        "/api/marketplace-auctions/create",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(form),
        }
      );

      const data =
        await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ||
          "Failed to create auction"
        );
      }

      router.push(
        `/marketplace-auctions/${data.auction.id}`
      );

    } catch (err: any) {

      setError(
        err.message ||
        "Something went wrong"
      );

    } finally {

      setLoading(false);

    }
  }

  return (
    <main className="min-h-screen bg-white">

      <section className="max-w-3xl mx-auto px-6 pt-24 pb-24">

        <div className="mb-12">

          <p className="text-sm font-medium text-gray-500 uppercase tracking-[0.18em] mb-5">
            Marketplace Seller
          </p>

          <h1 className="text-5xl font-semibold leading-[1.02]">
            Create Marketplace Auction
          </h1>

          <p className="mt-6 text-xl text-gray-600">
            Launch your LIVE marketplace auction on MrBids.
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-8 border rounded-3xl p-8"
        >

          {/* TITLE */}
          <div>

            <label className="block text-sm font-medium mb-3">
              Auction Title
            </label>

            <input
              type="text"
              required
              value={form.title}
              onChange={(e) =>
                setForm({
                  ...form,
                  title:
                    e.target.value,
                })
              }
              className="w-full border rounded-2xl px-5 py-4"
              placeholder="Vintage Gold Bracelet"
            />

          </div>

          {/* CATEGORY */}
          <div>

            <label className="block text-sm font-medium mb-3">
              Category
            </label>

            <select
              value={form.category}
              onChange={(e) =>
                setForm({
                  ...form,
                  category:
                    e.target.value,
                })
              }
              className="w-full border rounded-2xl px-5 py-4"
            >
              <option>Jewelry</option>
              <option>Electronics</option>
              <option>Sneakers</option>
              <option>Collectibles</option>
              <option>Luxury Items</option>
              <option>Storage Finds</option>
              <option>Other</option>
            </select>

          </div>

          {/* DESCRIPTION */}
          <div>

            <label className="block text-sm font-medium mb-3">
              Description
            </label>

            <textarea
              required
              rows={6}
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description:
                    e.target.value,
                })
              }
              className="w-full border rounded-2xl px-5 py-4 resize-none"
              placeholder="Describe your item..."
            />

          </div>

          {/* IMAGE */}
          <div>

            <label className="block text-sm font-medium mb-3">
              Cover Image
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

                  const imageUrl =
                    await handleImageUpload(
                      file
                    );

                  setForm({
                    ...form,
                    coverImage:
                      imageUrl,
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

            {uploading && (
              <p className="mt-3 text-sm text-gray-500">
                Uploading image...
              </p>
            )}

            {form.coverImage && (

              <img
                src={form.coverImage}
                alt="Preview"
                className="mt-6 w-40 h-40 object-cover rounded-2xl border"
              />

            )}

          </div>

          {/* STARTING BID */}
          <div>

            <label className="block text-sm font-medium mb-3">
              Starting Bid
            </label>

            <input
              type="number"
              required
              min={1}
              value={form.startingBid}
              onChange={(e) =>
                setForm({
                  ...form,
                  startingBid:
                    Number(
                      e.target.value
                    ),
                })
              }
              className="w-full border rounded-2xl px-5 py-4"
            />

          </div>

          {/* BID INCREMENT */}
          <div>

            <label className="block text-sm font-medium mb-3">
              Bid Increment
            </label>

            <input
              type="number"
              required
              min={1}
              value={form.bidIncrement}
              onChange={(e) =>
                setForm({
                  ...form,
                  bidIncrement:
                    Number(
                      e.target.value
                    ),
                })
              }
              className="w-full border rounded-2xl px-5 py-4"
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
              ? "Creating Auction..."
              : "Create Marketplace Auction"}
          </button>

        </form>

      </section>

    </main>
  );
}