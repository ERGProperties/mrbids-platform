"use client";

import { useSellerPreview } from "@/components/seller/SellerPreviewContext";

export default function LivePreview() {
  const { previewData } = useSellerPreview();

  const formatMoney = (value?: number) => {
    if (!value) return "—";
    return `$${value.toLocaleString()}`;
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

      {/* ===== LISTING IDENTITY HEADER ===== */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Your Listing (Live)
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Draft • Auto-saved
          </p>
        </div>

        <div className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
          Preview
        </div>
      </div>

      {/* ===== HERO IMAGE ===== */}
      <div className="w-full h-48 rounded-xl bg-gray-100 overflow-hidden mb-4">
        {previewData.coverImage ? (
          <img
            src={previewData.coverImage}
            alt="Property cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            Property image preview
          </div>
        )}
      </div>

      {/* ===== TITLE ===== */}
      <h3 className="text-xl font-bold text-gray-800 mb-2">
        {previewData.title || "Your property title will appear here"}
      </h3>

      {/* ===== ADDRESS ===== */}
      <p className="text-gray-500 mb-4">
        {previewData.address || "Address will appear here"}
      </p>

      {/* ===== AUCTION INFO ===== */}
      <div className="space-y-2 text-sm text-gray-700 border-t border-gray-100 pt-4">
        <div>
          <span className="text-gray-500">Starting Bid:</span>{" "}
          {formatMoney(previewData.startingBid)}
        </div>

        <div>
          <span className="text-gray-500">Bid Increment:</span>{" "}
          {formatMoney(previewData.bidIncrement)}
        </div>

        <div>
          <span className="text-gray-500">End Date:</span>{" "}
          {previewData.endDate || "—"}
        </div>
      </div>

      {/* ===== DESCRIPTION ===== */}
      <div className="mt-4 border-t border-gray-100 pt-4 text-sm text-gray-600 leading-relaxed">
        {previewData.description ||
          "Property description preview…"}
      </div>
    </div>
  );
}