"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ManageAuctionControls({
  auctionId,
  restartMode,
}: {
  auctionId: string;
  restartMode: string;
}) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(
    restartMode === "NEVER"
  );

  async function stopRestart() {
    if (disabled) return;

    if (
      !confirm(
        "This auction will continue until it ends, but it will not automatically restart. Continue?"
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
      alert("Unable to update auction.");
      return;
    }

    setDisabled(true);

    alert("Automatic restart disabled.");

    router.refresh();
  }

  async function endAuction() {
    if (
      !confirm(
        "Are you sure you want to end this auction immediately?"
      )
    ) {
      return;
    }

    setLoading(true);

    const res = await fetch(
      `/api/dashboard/auctions/${auctionId}/end`,
      {
        method: "POST",
      }
    );

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "Unable to end auction.");
      return;
    }

    alert("Auction ended successfully.");

    router.refresh();
  }

  async function deleteAuction() {
    if (
      !confirm(
        "Delete this auction permanently?"
      )
    ) {
      return;
    }

    setLoading(true);

    const res = await fetch(
      `/api/dashboard/auctions/${auctionId}/delete`,
      {
        method: "POST",
      }
    );

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "Unable to delete auction.");
      return;
    }

    alert("Auction deleted.");

    router.push("/dashboard");
  }

  return (
    <div className="grid gap-5 md:grid-cols-2">

      <button
        onClick={stopRestart}
        disabled={loading || disabled}
        className={`rounded-2xl py-5 font-semibold transition ${
          disabled
            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
            : "bg-black text-white hover:opacity-90"
        }`}
      >
        {loading
          ? "Saving..."
          : disabled
          ? "✓ Automatic Restart Disabled"
          : "Stop Automatic Restart"}
      </button>

      <button
        onClick={() =>
          alert(
            "Edit Auction will be added next."
          )
        }
        className="rounded-2xl border border-gray-300 py-5 font-semibold hover:bg-gray-100 transition"
      >
        Edit Auction
      </button>

      <button
        onClick={endAuction}
        className="rounded-2xl border border-red-300 bg-red-50 py-5 font-semibold text-red-700 hover:bg-red-100 transition"
      >
        End Auction Now
      </button>

      <button
        onClick={deleteAuction}
        className="rounded-2xl border border-red-600 py-5 font-semibold text-red-600 hover:bg-red-50 transition"
      >
        Delete Auction
      </button>

    </div>
  );
}