"use client";

interface Props {
  auctionId: string;
  images: string[];
  coverImage: string | null;
}

export default function CoverImageGrid({
  auctionId,
  images,
  coverImage,
}: Props) {
  async function setCover(img: string) {
    await fetch(`/api/sell/${auctionId}/set-cover`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image: img }),
    });

    window.location.reload();
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {images.map((img, index) => (
        <button
          key={index}
          onClick={() => setCover(img)}
          className={`border rounded-xl overflow-hidden bg-white relative ${
            coverImage === img ? "ring-2 ring-black" : ""
          }`}
        >
          {coverImage === img && (
            <span className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded">
              ★ Cover
            </span>
          )}

          <img
            src={img}
            alt={`Auction image ${index + 1}`}
            className="w-full h-36 object-cover"
          />
        </button>
      ))}
    </div>
  );
}
