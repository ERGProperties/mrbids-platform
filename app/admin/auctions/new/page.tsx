"use client";

import { useState } from "react";
import { createAuction } from "./actions";

export default function NewAuctionPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setSuccess(false);

    try {
      await createAuction(formData);
      setSuccess(true);
    } catch (e: any) {
      setError(e.message || "Failed to create auction");
    }
  }

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-32">
        <h1 className="text-3xl font-semibold text-gray-900 mb-10">
          Create New Auction
        </h1>

        <form
          action={handleSubmit}
          className="bg-white border border-gray-200 rounded-2xl p-8 space-y-6"
        >
          <Input label="Title" name="title" required />
          <Input label="Slug" name="slug" required />
          <Input label="Address Line" name="addressLine" required />
          <Input label="City, State ZIP" name="cityStateZip" required />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input label="Starting Bid" name="startingBid" required />
            <Input label="Bid Increment" name="bidIncrement" required />
            <Input label="ARV" name="arv" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Start Time (ISO)" name="startAt" required />
            <Input label="End Time (ISO)" name="endAt" required />
          </div>

          <Input
            label="Images Path (public/...)"
            name="imagesPath"
            required
          />

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          {success && (
            <p className="text-sm text-green-600">
              Auction created successfully.
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-black text-white rounded-full text-sm font-medium"
          >
            Create Auction
          </button>
        </form>
      </div>
    </main>
  );
}

function Input({
  label,
  name,
  required,
}: {
  label: string;
  name: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        name={name}
        required={required}
        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
      />
    </div>
  );
}
