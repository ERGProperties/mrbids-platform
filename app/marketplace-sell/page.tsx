"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

export default function MarketplaceSellPage() {

  const router =
    useRouter();

  const [
    title,
    setTitle,
  ] = useState("");

  const [
    description,
    setDescription,
  ] = useState("");

  const [
    category,
    setCategory,
  ] = useState("");

  const [
    retailPrice,
    setRetailPrice,
  ] = useState("");

  const [
    startingBid,
    setStartingBid,
  ] = useState("");

  const [
    bidIncrement,
    setBidIncrement,
  ] = useState("1");

  const [
    durationMinutes,
    setDurationMinutes,
  ] = useState("5");

  const [
    coverImage,
    setCoverImage,
  ] = useState("");

  const [
    additionalImages,
    setAdditionalImages,
  ] = useState<string[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  async function uploadImage(
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
      process.env
        .NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ||
        ""
    );

    const response =
      await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

    const data =
      await response.json();

    console.log(
      "Cloudinary upload response:",
      data
    );

    if (!response.ok) {

      throw new Error(
        data.error?.message ||
        "Cloudinary upload failed"
      );

    }

    return (
      data.secure_url ||
      data.url
    );
  }

  async function handleCoverUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {

    try {

      const file =
        e.target.files?.[0];

      if (!file)
        return;

      setLoading(true);

      const imageUrl =
        await uploadImage(
          file
        );

      setCoverImage(
        imageUrl
      );

    } catch (err: any) {

      console.error(err);

      setError(
        err.message ||
        "Failed to upload cover image"
      );

    } finally {

      setLoading(false);

    }
  }

  async function handleAdditionalImages(
    e: React.ChangeEvent<HTMLInputElement>
  ) {

    try {

      const files =
        e.target.files;

      if (!files?.length)
        return;

      setLoading(true);

      const uploadedImages: string[] =
        [];

      for (
        let i = 0;
        i < files.length;
        i++
      ) {

        const imageUrl =
          await uploadImage(
            files[i]
          );

        uploadedImages.push(
          imageUrl
        );

      }

      setAdditionalImages(
        (prev) => [
          ...prev,
          ...uploadedImages,
        ]
      );

    } catch (err: any) {

      console.error(err);

      setError(
        err.message ||
        "Failed to upload images"
      );

    } finally {

      setLoading(false);

    }
  }

  async function handleSubmit(
    e: React.FormEvent
  ) {

    e.preventDefault();

    try {

      setLoading(true);

      setError("");

      const allImages = [
        coverImage,
        ...additionalImages,
      ];

      const response =
        await fetch(
          "/api/marketplace-auctions/create",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              title,
              description,
              category,

              retailPrice:
                retailPrice
                  ? Number(
                      retailPrice
                    )
                  : null,

              coverImage,

              images:
                allImages,

              startingBid:
                Number(
                  startingBid
                ),

              bidIncrement:
                Number(
                  bidIncrement
                ),

              durationMinutes:
                Number(
                  durationMinutes
                ),
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {

        setError(
          data.error ||
          "Failed to create auction"
        );

        return;
      }

      router.push(
        `/marketplace-auctions/${data.auction.id}`
      );

    } catch (err: any) {

      console.error(err);

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

      <section className="max-w-3xl mx-auto px-6 py-24">

        <div className="mb-14">

          <p className="text-sm font-medium text-gray-500 uppercase tracking-[0.18em] mb-4">
            MrBids Marketplace
          </p>

          <h1 className="text-5xl font-semibold leading-tight">
            Create Auction
          </h1>

          <p className="mt-5 text-lg text-gray-600">
            Launch a LIVE flash auction or a longer marketplace auction.
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-10"
        >

          {/* TITLE */}
          <div>

            <label className="block text-sm font-medium mb-3">
              Auction Title
            </label>

            <input
              type="text"
              required
              value={title}
              onChange={(e) =>
                setTitle(
                  e.target.value
                )
              }
              className="w-full border rounded-2xl px-5 py-4"
              placeholder="Vintage Rolex Watch"
            />

          </div>

          {/* DESCRIPTION */}
          <div>

            <label className="block text-sm font-medium mb-3">
              Description
            </label>

            <textarea
              rows={5}
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              className="w-full border rounded-2xl px-5 py-4"
              placeholder="Describe your item..."
            />

          </div>

          {/* CATEGORY */}
          <div>

            <label className="block text-sm font-medium mb-3">
              Category
            </label>

            <select
              required
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target.value
                )
              }
              className="w-full border rounded-2xl px-5 py-4"
            >

              <option value="">
                Select Category
              </option>

              <option value="Jewelry">
                Jewelry
              </option>

              <option value="Electronics">
                Electronics
              </option>

              <option value="Fashion">
                Fashion
              </option>

              <option value="Collectibles">
                Collectibles
              </option>

              <option value="Sneakers">
                Sneakers
              </option>

              <option value="Luxury">
                Luxury
              </option>

              <option value="Art">
                Art
              </option>

              <option value="Vehicles">
                Vehicles
              </option>

              <option value="Other">
                Other
              </option>

            </select>

          </div>

          {/* COVER IMAGE */}
          <div>

            <label className="block text-sm font-medium mb-3">
              Cover Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={
                handleCoverUpload
              }
              className="w-full border rounded-2xl px-5 py-4"
            />

            {coverImage && (

              <img
                src={coverImage}
                alt="Cover"
                className="mt-5 rounded-3xl border aspect-square object-cover w-full"
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
              multiple
              accept="image/*"
              onChange={
                handleAdditionalImages
              }
              className="w-full border rounded-2xl px-5 py-4"
            />

            {additionalImages.length > 0 && (

              <div className="grid grid-cols-3 gap-4 mt-5">

                {additionalImages.map(
                  (
                    image,
                    index
                  ) => (

                    <img
                      key={index}
                      src={image}
                      alt={`Upload ${index}`}
                      className="rounded-2xl border aspect-square object-cover"
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
              value={retailPrice}
              onChange={(e) =>
                setRetailPrice(
                  e.target.value
                )
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
              value={startingBid}
              onChange={(e) =>
                setStartingBid(
                  e.target.value
                )
              }
              className="w-full border rounded-2xl px-5 py-4"
              placeholder="1"
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
              value={bidIncrement}
              onChange={(e) =>
                setBidIncrement(
                  e.target.value
                )
              }
              className="w-full border rounded-2xl px-5 py-4"
            />

          </div>

          {/* DURATION */}
          <div>

            <label className="block text-sm font-medium mb-3">
              Auction Duration
            </label>

            <select
              value={
                durationMinutes
              }
              onChange={(e) =>
                setDurationMinutes(
                  e.target.value
                )
              }
              className="w-full border rounded-2xl px-5 py-4"
            >

              <optgroup label="LIVE Flash Auctions">

                <option value="1">
                  1 Minute
                </option>

                <option value="3">
                  3 Minutes
                </option>

                <option value="5">
                  5 Minutes
                </option>

                <option value="10">
                  10 Minutes
                </option>

                <option value="30">
                  30 Minutes
                </option>

                <option value="60">
                  1 Hour
                </option>

              </optgroup>

              <optgroup label="Marketplace Auctions">

                <option value="1440">
                  1 Day
                </option>

                <option value="4320">
                  3 Days
                </option>

                <option value="10080">
                  7 Days
                </option>

              </optgroup>

            </select>

          </div>

          {/* ERROR */}
          {error && (

            <div className="border border-red-200 bg-red-50 text-red-600 rounded-2xl p-4">
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
              ? "Creating Auction..."
              : "Create Auction"}

          </button>

        </form>

      </section>

    </main>
  );
}