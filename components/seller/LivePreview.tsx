"use client";

import { useSellerPreview } from "@/components/seller/SellerPreviewContext";

export default function LivePreview() {
  const { previewData } = useSellerPreview();

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Live Preview</h2>

      {/* Hero Placeholder */}
      <div className="w-full h-48 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 mb-4">
        Property image preview
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-gray-800 mb-2">
        {previewData.title || "Your property title will appear here"}
      </h3>

      {/* Address */}
      <p className="text-gray-500 mb-4">
        {previewData.address || "Address will appear here"}
      </p>

      {/* Auction Info */}
      <div className="space-y-2 text-sm text-gray-700">
        <div>Starting Bid: —</div>
        <div>Bid Increment: —</div>
        <div>End Date: —</div>
      </div>

      {/* Description */}
      <div className="mt-4 text-sm text-gray-500">
        Property description preview…
      </div>
    </div>
  );
}