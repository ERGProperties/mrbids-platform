"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ManageAuctionControls({
  auctionId,
}: {
  auctionId: string;
}) {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  async function stopRestart() {
    if (
      !confirm(
        "Stop automatic restart after this auction ends?"
      )
    ) {
      return;
    }

    setLoading(true);

    const res = await fetch(
      `/api/dashboard/auctions/${auctionId}/stop-restart`,
      {
        method: "POST",
      }
    );

    setLoading(false);

    if (!res.ok) {
      alert("Something went wrong.");
      return;
    }

    alert(
      "Automatic restart disabled."
    );

    router.refresh();
  }

  return (
    <div className="grid gap-5 md:grid-cols-2">

      <button
        onClick={stopRestart}
        disabled={loading}
        className="rounded-2xl bg-black py-5 text-white font-semibold hover:opacity-90 disabled:opacity-50 transition"
      >
        {loading
          ? "Saving..."
          : "Stop Automatic Restart"}
      </button>

      <button
        className="rounded-2xl border border-gray-300 py-5 font-semibold hover:bg-gray-100 transition"
      >
        Edit Auction
      </button>

      <button
        className="rounded-2xl border border-red-300 bg-red-50 py-5 font-semibold text-red-700 hover:bg-red-100 transition"
      >
        End Auction Now
      </button>

      <button
        className="rounded-2xl border border-red-600 py-5 font-semibold text-red-600 hover:bg-red-50 transition"
      >
        Delete Auction
      </button>

    </div>
  );
}