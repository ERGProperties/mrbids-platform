"use client";

interface Props {
  auctionId: string;
  images: string[];
  coverImage: string | null;
  onCoverChange?: (img: string) => void;
  onDelete?: (img: string) => void;
}

export default function CoverImageGrid({
  auctionId,
  images,
  coverImage,
  onCoverChange,
  onDelete,
}: Props) {
  async function setCover(img: string) {
    await fetch(`/api/sell/${auctionId}/set-cover-image`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ coverImage: img }),
    });

    onCoverChange?.(img);
  }

  async function deleteImage(img: string) {
    await fetch(`/api/sell/${auctionId}/delete-image`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: img.split("/").pop(),
      }),
    });

    onDelete?.(img);
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {images.map((img) => {
        const isCover = coverImage === img;

        return (
          <div
            key={img}
            className={`relative rounded-xl overflow-hidden border ${
              isCover
                ? "ring-2 ring-black border-black"
                : "border-gray-200"
            }`}
          >
            <img
              src={img}
              alt=""
              className="w-full h-40 object-cover cursor-pointer"
              onClick={() => setCover(img)}
            />

            {isCover && (
              <div className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded">
                Cover
              </div>
            )}

            <button
              type="button"
              onClick={() => deleteImage(img)}
              className="absolute top-2 right-2 bg-white px-2 py-1 text-xs rounded"
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>
  );
}