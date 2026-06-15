"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

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

      retailPrice: "",

      startingBid: 1,

      reservePrice: "",

      bidIncrement: 1,

      durationMinutes: 5,

      coverImage: "",

      images: [] as string[],

      shippingType: "preset",

      shippingPreset: "small",

      shippingLabel: "Small Item",

      shippingCost: 699,

      freeShipping: false,

      localPickup: false,
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

    if (!res.ok) {

      throw new Error(
        data.error?.message ||
        "Image upload failed"
      );

    }

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

          body: JSON.stringify({
            ...form,

            retailPrice:
              form.retailPrice
                ? Number(
                    form.retailPrice
                  )
                : null,

            reservePrice:
              form.reservePrice
                ? Number(
                    form.reservePrice
                  )
                : null,

          }),
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
        `/marketplace-auctions/${data.auction.id}?created=true`
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

          {/* COVER IMAGE */}
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

                    images: [
                      imageUrl,
                      ...form.images.filter(
                        (img) => img !== form.coverImage
                      ),
                    ],
                  });

                } catch (err) {

                  console.error(err);

                  setError(
                    "Image upload failed"
                  );

                } finally {

                  setUploading(false);

                }

              }}
              className="w-full border rounded-2xl px-5 py-4"
            />

            {uploading && (

              <div className="mt-4 border rounded-2xl bg-blue-50 border-blue-200 text-blue-700 px-5 py-4 text-sm font-medium">
                Uploading images...
              </div>

            )}

            {form.coverImage && (

              <img
                src={form.coverImage}
                alt="Preview"
                className="mt-6 w-52 h-52 object-cover rounded-2xl border"
              />

            )}

          </div>

          {/* ADDITIONAL IMAGES */}
          <div>

            <label className="block text-sm font-medium mb-3">
              Additional Images
            </label>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={async (e) => {

                const files =
                  Array.from(
                    e.target.files || []
                  );

                if (!files.length) return;

                setUploading(true);

                try {

                  const uploadedImages =
                    await Promise.all(
                      files.map((file) =>
                        handleImageUpload(file)
                      )
                    );

                  setForm({
                    ...form,

                    images: [
                      ...form.images,
                      ...uploadedImages,
                    ],
                  });

                } catch (err) {

                  console.error(err);

                  setError(
                    "Additional image upload failed"
                  );

                } finally {

                  setUploading(false);

                }

              }}
              className="w-full border rounded-2xl px-5 py-4"
            />

            {form.images.length > 0 && (

              <div className="grid grid-cols-3 gap-4 mt-6">

                {form.images.map(
                  (
                    image,
                    index
                  ) => (

                    <img
                      key={index}
                      src={image}
                      alt={`Additional ${index}`}
                      className="w-full aspect-square object-cover rounded-2xl border"
                    />

                  )
                )}

              </div>

            )}

          </div>

          {/* RETAIL PRICE */}
          <div>

            <label className="block text-sm font-medium mb-3">
              Retail Price (Optional)
            </label>

            <input
              type="number"
              value={form.retailPrice}
              onChange={(e) =>
                setForm({
                  ...form,
                  retailPrice:
                    e.target.value,
                })
              }
              className="w-full border rounded-2xl px-5 py-4"
              placeholder="250"
            />

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

          {/* RESERVE PRICE */}
          <div>

            <label className="block text-sm font-medium mb-3">
              Reserve Price (Optional)
            </label>

            <input
              type="number"
              min={1}
              value={form.reservePrice}
              onChange={(e) =>
                setForm({
                  ...form,
                  reservePrice:
                    e.target.value,
                })
              }
              className="w-full border rounded-2xl px-5 py-4"
              placeholder="Hidden minimum selling price"
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

                const value =
                  e.target.value;

                if (
                  value === "free"
                ) {

                  setForm({
                    ...form,

                    freeShipping:
                      true,

                    localPickup:
                      false,

                    shippingType:
                      "free",

                    shippingPreset:
                      null,

                    shippingLabel:
                      "Free Shipping",

                    shippingCost: 0,
                  });

                  return;
                }

                if (
                  value === "pickup"
                ) {

                  setForm({
                    ...form,

                    freeShipping:
                      false,

                    localPickup:
                      true,

                    shippingType:
                      "pickup",

                    shippingPreset:
                      null,

                    shippingLabel:
                      "Local Pickup",

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

                  freeShipping:
                    false,

                  localPickup:
                    false,

                  shippingType:
                    "preset",

                  shippingPreset:
                    value,

                  shippingLabel:
                    preset.label,

                  shippingCost:
                    preset.cost,
                });

              }}
              className="w-full border rounded-2xl px-5 py-4"
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

          </div>

          {/* DURATION */}
          <div>

            <label className="block text-sm font-medium mb-3">
              Auction Duration
            </label>

            <select
              value={form.durationMinutes}
              onChange={(e) =>
                setForm({
                  ...form,
                  durationMinutes:
                    Number(
                      e.target.value
                    ),
                })
              }
              className="w-full border rounded-2xl px-5 py-4"
            >

              <option value={5}>
                5 Minutes
              </option>

              <option value={10}>
                10 Minutes
              </option>

              <option value={15}>
                15 Minutes
              </option>

              <option value={30}>
                30 Minutes
              </option>

              <option value={60}>
                1 Hour
              </option>

              <option value={1440}>
                1 Day
              </option>

              <option value={4320}>
                3 Days
              </option>

              <option value={10080}>
                7 Days
              </option>

            </select>

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

            {uploading
              ? "Uploading Images..."
              : loading
              ? "Creating Auction..."
              : "Create Marketplace Auction"}

          </button>

        </form>

      </section>

    </main>
  );
}