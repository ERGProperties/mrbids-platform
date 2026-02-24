"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSellerPreview } from "@/components/seller/SellerPreviewContext";

interface Props {
  auction: any;
}

export default function Step2Form({ auction }: Props) {
  const [startingBid, setStartingBid] = useState(
    auction.startingBid || ""
  );
  const [bidIncrement, setBidIncrement] = useState(
    auction.bidIncrement || ""
  );
  const [reserveAmount, setReserveAmount] = useState(
    auction.reserveAmount || ""
  );
  const [arv, setArv] = useState(auction.arv || "");
  const [durationDays, setDurationDays] = useState(
    auction.durationDays || 7
  );

  const [saving, setSaving] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // ⭐ PREVIEW CONTEXT
  const { setPreviewData } = useSellerPreview();

  useEffect(() => {
    setInitialized(true);
  }, []);

  // ===== LIVE PREVIEW UPDATE =====
  useEffect(() => {
    let endDate: string | undefined;

    if (durationDays) {
      const date = new Date();
      date.setDate(date.getDate() + Number(durationDays));
      endDate = date.toLocaleDateString();
    }

    setPreviewData({
      startingBid: Number(startingBid) || undefined,
      bidIncrement: Number(bidIncrement) || undefined,
      endDate,
    });
  }, [
    startingBid,
    bidIncrement,
    durationDays,
    setPreviewData,
  ]);

  // ===== AUTO SAVE =====
  useEffect(() => {
    if (!initialized) return;

    const timeout = setTimeout(async () => {
      try {
        setSaving(true);

        await fetch(`/api/sell/${auction.id}/step-2`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            startingBid: Number(startingBid),
            bidIncrement: Number(bidIncrement),
            reserveAmount: Number(reserveAmount),
            arv: Number(arv),
            durationDays,
          }),
        });
      } catch (err) {
        console.error("Save failed:", err);
      } finally {
        setSaving(false);
      }
    }, 800);

    return () => clearTimeout(timeout);
  }, [
    startingBid,
    bidIncrement,
    reserveAmount,
    arv,
    durationDays,
    initialized,
    auction.id,
  ]);

  return (
    <div className="space-y-6">

      {/* Starting Bid */}
      <div>
        <label className="block text-sm mb-2 font-medium">
          Starting Bid ($)
        </label>
        <input
          type="number"
          className="w-full border rounded-lg px-4 py-2"
          value={startingBid}
          onChange={(e) => setStartingBid(e.target.value)}
        />
      </div>

      {/* Bid Increment */}
      <div>
        <label className="block text-sm mb-2 font-medium">
          Bid Increment ($)
        </label>
        <input
          type="number"
          className="w-full border rounded-lg px-4 py-2"
          value={bidIncrement}
          onChange={(e) => setBidIncrement(e.target.value)}
        />
      </div>

      {/* Reserve Amount */}
      <div>
        <label className="block text-sm mb-2 font-medium">
          Reserve Amount ($)
        </label>
        <input
          type="number"
          className="w-full border rounded-lg px-4 py-2"
          value={reserveAmount}
          onChange={(e) =>
            setReserveAmount(e.target.value)
          }
        />
      </div>

      {/* ARV */}
      <div>
        <label className="block text-sm mb-2 font-medium">
          Estimated ARV ($)
        </label>
        <input
          type="number"
          className="w-full border rounded-lg px-4 py-2"
          value={arv}
          onChange={(e) => setArv(e.target.value)}
        />
      </div>

      {/* Duration */}
      <div>
        <label className="block text-sm mb-2 font-medium">
          Auction Duration
        </label>
        <select
          className="w-full border rounded-lg px-4 py-2"
          value={durationDays}
          onChange={(e) =>
            setDurationDays(Number(e.target.value))
          }
        >
          <option value={7}>7 Days</option>
          <option value={14}>14 Days</option>
          <option value={30}>30 Days</option>
        </select>
      </div>

      {/* Save Status */}
      <div className="text-sm text-gray-500">
        {saving ? "Saving..." : "All changes saved"}
      </div>

      {/* Continue */}
      <div className="pt-4">
        <Link
          href={`/sell/${auction.id}/step-3`}
          className="inline-block px-6 py-3 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition"
        >
          Continue →
        </Link>
      </div>

    </div>
  );
}