"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PublishButton({
  auctionId,
}: {
  auctionId: string;
}) {
  const router = useRouter();
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState("");

  const handlePublish = async () => {
    try {
      setPublishing(true);
      setError("");

      const res = await fetch(
        `/api/sell/${auctionId}/publish`,
        { method: "POST" }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Publish failed");
        return;
      }

      router.push(`/auctions/${data.slug}`);
    } catch {
      setError("Publish failed");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div>
      {error && (
        <div className="mb-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <button
        onClick={handlePublish}
        disabled={publishing}
        className="px-6 py-3 bg-black text-white rounded-lg text-sm disabled:opacity-50"
      >
        {publishing
          ? "Publishing..."
          : "🚀 Publish Auction"}
      </button>
    </div>
  );
}
