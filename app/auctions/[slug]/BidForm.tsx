"use client";

import { useState } from "react";

export default function BidForm({
  slug,
  minimumBid,
  currentBid,
}: {
  slug: string;
  minimumBid: number;
  currentBid: number;
}) {
  const [amount, setAmount] = useState(minimumBid);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function submitBid(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`/api/auctions/${slug}/bid`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Failed to place bid.");
      } else {
        setMessage("Bid placed successfully!");
      }
    } catch (err) {
      setMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submitBid} className="space-y-4">

      <p className="text-sm text-gray-600">
        Minimum bid: ${minimumBid.toLocaleString()}
      </p>

      <input
        type="number"
        value={amount}
        min={minimumBid}
        onChange={(e) => setAmount(Number(e.target.value))}
        className="w-full border rounded-xl px-4 py-3 text-sm"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-black text-white rounded-xl py-3 font-medium hover:bg-gray-800 transition disabled:opacity-60"
      >
        {loading ? "Placing bid..." : "Place Bid"}
      </button>

      {message && (
        <p className="text-sm text-gray-600">{message}</p>
      )}
    </form>
  );
}