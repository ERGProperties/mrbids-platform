"use client";

interface Props {
  auctionId: string;
  images: string[];
  coverImage?: string | null;
  onCoverChange?: (img: string) => void;
}

export default function CoverImageGrid({
  auctionId,
  images,
  coverImage,
  onCoverChange,
}: Props) {
  const setCover = async (img: string) => {
    try {
      await fetch(`/api/sell/${auctionId}/set-cover-image`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          coverImage: img,
        }),
      });

      // ⭐ update UI instantly (no reload)
      if (onCoverChange) {
        onCoverChange(img);
      }
    } catch (err) {
      console.error("Failed to set cover image:", err);
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {images.map((img) => {
        const isCover = coverImage === img;

        return (
          <button
            key={img}
            type="button"
            onClick={() => setCover(img)}
            className={`relative rounded-xl overflow-hidden border transition ${
              isCover
                ? "ring-2 ring-black border-black"
                : "border-gray-200 hover:border-gray-400"
            }`}
          >
            <img
              src={img}
              alt="Property"
              className="w-full h-40 object-cover"
            />

            {isCover && (
              <div className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded">
                Cover
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}