"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { submitBid } from "./actions";

export default function BidForm({
  slug,
  minimumBid,
  currentBid,
  autoFocus,
}: {
  slug: string;
  minimumBid: number;
  currentBid: number;
  autoFocus?: boolean;
}) {
  const router = useRouter();

  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // 🚨 Auto focus when user gets outbid
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // 💰 Winning cost preview
  const serviceFee = Math.ceil(currentBid * 0.01);
  const totalIfWin = currentBid + serviceFee;

  // ⚡ Quick bid buttons
  function quickBid(increment: number) {
    setAmount(String(minimumBid + increment));
  }

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
      const message =
        e?.message || "Failed to place bid";

      // 🔒 Redirect unverified users
      if (
        message.toLowerCase().includes("verify")
      ) {
        router.push("/verify");
        return;
      }

      setError(message);
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

      {/* 💰 WINNING COST PREVIEW */}
      <div className="mt-4 rounded-lg bg-gray-50 border border-gray-200 p-4 text-sm">
        <p>
          Current Bid:{" "}
          <strong>${currentBid.toLocaleString()}</strong>
        </p>
        <p>
          Service Fee (1%):{" "}
          <strong>${serviceFee.toLocaleString()}</strong>
        </p>
        <p className="mt-1 text-gray-900 font-semibold">
          Total if you win: ${totalIfWin.toLocaleString()}
        </p>
      </div>

      {/* ⚡ QUICK BID BUTTONS */}
      <div className="mt-4 flex gap-2 flex-wrap">
        {[1000, 2000, 5000].map((inc) => (
          <button
            key={inc}
            type="button"
            onClick={() => quickBid(inc)}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full"
          >
            +${inc.toLocaleString()}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input
          ref={inputRef}
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
