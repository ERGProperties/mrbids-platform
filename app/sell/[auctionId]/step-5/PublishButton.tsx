"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";

export default function PublishButton({
  auctionId,
}: {
  auctionId: string;
}) {
  const router = useRouter();

  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState("");
  const [publishedSlug, setPublishedSlug] = useState<string | null>(null);

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

      setPublishedSlug(data.slug);
    } catch {
      setError("Publish failed");
    } finally {
      setPublishing(false);
    }
  };

  /* ---------- CONFETTI ---------- */
  useEffect(() => {
    if (!publishedSlug) return;

    // small burst
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
    });

    // secondary lighter burst for premium feel
    setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.7 },
      });
    }, 250);
  }, [publishedSlug]);

  /* ---------- SUCCESS SCREEN ---------- */

  if (publishedSlug) {
    const auctionUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/auctions/${publishedSlug}`
        : `/auctions/${publishedSlug}`;

    const copyLink = async () => {
      try {
        await navigator.clipboard.writeText(auctionUrl);
      } catch {
        alert("Could not copy link");
      }
    };

    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-6 space-y-4">

        <h2 className="text-xl font-semibold text-green-800">
          🎉 Your auction is now live!
        </h2>

        <p className="text-sm text-green-700">
          Your listing has been published successfully.
          Share your auction link with buyers to start driving bids.
        </p>

        {/* LINK BOX */}
        <div className="rounded-lg border bg-white p-3 text-sm break-all">
          {auctionUrl}
        </div>

        <div className="flex flex-wrap gap-3 pt-2">

          <button
            onClick={copyLink}
            className="px-4 py-2 border rounded-lg text-sm"
          >
            Copy Link
          </button>

          <button
            onClick={() => router.push(`/auctions/${publishedSlug}`)}
            className="px-4 py-2 bg-black text-white rounded-lg text-sm"
          >
            View Live Auction
          </button>

          <button
            onClick={() => router.push("/dashboard")}
            className="px-4 py-2 border rounded-lg text-sm"
          >
            Back to Dashboard
          </button>

        </div>
      </div>
    );
  }

  /* ---------- DEFAULT BUTTON ---------- */

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