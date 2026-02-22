"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSellerPreview } from "@/components/seller/SellerPreviewContext";

interface Props {
  auction: any;
}

export default function Step1Form({ auction }: Props) {
  const [title, setTitle] = useState(auction.title || "");
  const [addressLine, setAddressLine] = useState(
    auction.addressLine || ""
  );
  const [cityStateZip, setCityStateZip] = useState(
    auction.cityStateZip || ""
  );

  const [saving, setSaving] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const { setPreviewData } = useSellerPreview();

  const isValid =
    title.trim() &&
    addressLine.trim() &&
    cityStateZip.trim();

  useEffect(() => {
    setInitialized(true);
  }, []);

  useEffect(() => {
    setPreviewData({
      title,
      address: `${addressLine} ${cityStateZip}`.trim(),
    });
  }, [title, addressLine, cityStateZip, setPreviewData]);

  useEffect(() => {
    if (!initialized) return;

    const timeout = setTimeout(async () => {
      try {
        setSaving(true);

        await fetch(`/api/sell/${auction.id}/step-1`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            addressLine,
            cityStateZip,
          }),
        });
      } catch (err) {
        console.error("Auto-save failed:", err);
      } finally {
        setSaving(false);
      }
    }, 800);

    return () => clearTimeout(timeout);
  }, [title, addressLine, cityStateZip, initialized, auction.id]);

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm mb-2 font-medium">
          Property Title
        </label>
        <input
          type="text"
          className="w-full border rounded-lg px-4 py-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. 3BR Investment Property in Dallas"
        />
      </div>

      <div>
        <label className="block text-sm mb-2 font-medium">
          Street Address
        </label>
        <input
          type="text"
          className="w-full border rounded-lg px-4 py-2"
          value={addressLine}
          onChange={(e) => setAddressLine(e.target.value)}
          placeholder="123 Main St"
        />
      </div>

      <div>
        <label className="block text-sm mb-2 font-medium">
          City, State ZIP
        </label>
        <input
          type="text"
          className="w-full border rounded-lg px-4 py-2"
          value={cityStateZip}
          onChange={(e) => setCityStateZip(e.target.value)}
          placeholder="Dallas, TX 75203"
        />
      </div>

      <div className="text-sm text-gray-500">
        {saving ? "Saving..." : "All changes saved"}
      </div>

      <div className="pt-4">
        <Link
          href={`/sell/${auction.id}/step-2`}
          className={`inline-block px-6 py-3 rounded-lg text-sm font-medium transition ${
            isValid
              ? "bg-black text-white hover:bg-gray-900"
              : "bg-gray-300 text-gray-500 pointer-events-none"
          }`}
        >
          Continue →
        </Link>
      </div>
    </div>
  );
}