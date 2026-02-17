"use client";

import { useState } from "react";
import { submitBid } from "./actions";

export default function BidForm({
  slug,
  minimumBid,
}: {
  slug: string;
  minimumBid: number;
}) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const value = Number(amount);

    if (!value || value < minimumBid) {
      setError(
        `Bid must be at least $${minimumBid.toLocaleString()}`
      );
      return;
    }

    try {
      setLoading(true);
      await submitBid(slug, value);
      setSuccess(true);
      setAmount("");
    } catch (e: any) {
      setError(e.message || "Failed to place bid");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">
        Place a Bid
      </h3>

      <p className="mt-2 text-sm text-gray-600">
        Minimum bid: ${minimumBid.toLocaleString()}
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder={`$${minimumBid.toLocaleString()}`}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
        />

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        {success && (
          <p className="text-sm text-green-600">
            Bid placed successfully.
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-black text-white rounded-full text-sm font-medium disabled:opacity-50"
        >
          {loading ? "Submitting…" : "Submit Bid"}
        </button>
      </form>
    </div>
  );
}
