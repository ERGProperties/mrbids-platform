"use client";

import { useState } from "react";

const SHIPPING_PRESETS = {
  small: {
    label: "Small Item",
    cost: 699,
  },
  medium: {
    label: "Medium Item",
    cost: 1299,
  },
  large: {
    label: "Large Item",
    cost: 2499,
  },
  xl: {
    label: "XL Item",
    cost: 4999,
  },
};

export default function CreateMarketplaceAuctionPage() {

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Jewelry",
    startingBid: 1,
    bidIncrement: 1,
    coverImage: "",

    shippingType: "preset",
    shippingPreset: "small",
    shippingLabel: "Small Item",
    shippingCost: 699,

    freeShipping: false,
    localPickup: false,
  });

  const [loading, setLoading] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  const [error, setError] = useState("");

  // CLOUDINARY UPLOAD
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

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ||
          "Failed to create auction"
        );
      }

      window.location.href =
        `/marketplace-auctions/${data.auction.id}`;

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

      <section className="max-w-3xl mx-auto px-6 pt-32 pb-32">

        <div className="text-center mb-14">

          <p className="text-sm font-medium text-gray-500 uppercase tracking-[0.18em] mb-6">
            Marketplace Seller
          </p>

          <h1 className="text-5xl md:text-6xl font-semibold leading-[1.02]">
            Create Marketplace Auction
          </h1>

          <p className="mt-8 text-xl text-gray-600">
            Launch a LIVE auction listing on MrBids.
          </p>

        </div>

        <div className="border rounded-3xl p-8 md:p-12">

          <form
            onSubmit={handleSubmit}
            className="space-y-8"
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
                    title: e.target.value,
                  })
                }
                placeholder="Vintage Rolex Watch"
                className="w-full border rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-black"
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

                    const url =
                      await handleImageUpload(
                        file
                      );

                    setForm({
                      ...form,
                      coverImage: url,
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

              {form.coverImage && (

                <div className="mt-6">

                  <img
                    src={form.coverImage}
                    alt="Preview"
                    className="w-full rounded-2xl border"
                  />

                </div>

              )}

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

            {/* DESCRIPTION */}
            <div>

              <label className="block text-sm font-medium mb-3">
                Description
              </label>

              <textarea
                rows={6}
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description:
                      e.target.value,
                  })
                }
                placeholder="Describe the item..."
                className="w-full border rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-black resize-none"
              />

            </div>

            {/* STARTING BID */}
            <div>

              <label className="block text-sm font-medium mb-3">
                Starting Bid ($)
              </label>

              <input
                type="number"
                min={1}
                value={form.startingBid}
                onChange={(e) =>
                  setForm({
                    ...form,
                    startingBid:
                      Number(e.target.value),
                  })
                }
                className="w-full border rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-black"
              />

            </div>

            {/* BID INCREMENT */}
            <div>

              <label className="block text-sm font-medium mb-3">
                Bid Increment ($)
              </label>

              <input
                type="number"
                min={1}
                value={form.bidIncrement}
                onChange={(e) =>
                  setForm({
                    ...form,
                    bidIncrement:
                      Number(e.target.value),
                  })
                }
                className="w-full border rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-black"
              />

            </div>

            {/* SHIPPING */}
            <div>

              <label className="block text-sm font-medium mb-3">
                Shipping Option
              </label>

              <select
                value={
                  form.freeShipping
                    ? "free"
                    : form.localPickup
                    ? "pickup"
                    : form.shippingPreset
                }
                onChange={(e) => {

                  const value = e.target.value;

                  if (value === "free") {

                    setForm({
                      ...form,
                      freeShipping: true,
                      localPickup: false,
                      shippingType: "free",
                      shippingPreset: null,
                      shippingLabel: "Free Shipping",
                      shippingCost: 0,
                    });

                    return;
                  }

                  if (value === "pickup") {

                    setForm({
                      ...form,
                      freeShipping: false,
                      localPickup: true,
                      shippingType: "pickup",
                      shippingPreset: null,
                      shippingLabel: "Local Pickup",
                      shippingCost: 0,
                    });

                    return;
                  }

                  const preset =
                    SHIPPING_PRESETS[
                      value as keyof typeof SHIPPING_PRESETS
                    ];

                  setForm({
                    ...form,
                    freeShipping: false,
                    localPickup: false,
                    shippingType: "preset",
                    shippingPreset: value,
                    shippingLabel: preset.label,
                    shippingCost: preset.cost,
                  });

                }}
                className="w-full border rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-black"
              >

                <option value="small">
                  Small Item ($6.99)
                </option>

                <option value="medium">
                  Medium Item ($12.99)
                </option>

                <option value="large">
                  Large Item ($24.99)
                </option>

                <option value="xl">
                  XL Item ($49.99)
                </option>

                <option value="free">
                  Free Shipping
                </option>

                <option value="pickup">
                  Local Pickup
                </option>

              </select>

              <p className="mt-3 text-sm text-gray-500">
                Shipping will be displayed to buyers before bidding.
              </p>

            </div>

            {/* ERROR */}
            {error && (
              <div className="text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* BUTTON */}
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

        </div>

      </section>

    </main>
  );
}
