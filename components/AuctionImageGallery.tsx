"use client";

import Image from "next/image";
import { useState } from "react";

type AuctionImageGalleryProps = {
  images: string[];
};

export function AuctionImageGallery({ images }: AuctionImageGalleryProps) {
  const [activeImage, setActiveImage] = useState(images[0]);

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative w-full aspect-[4/3] overflow-hidden rounded-lg border">
        <Image
          src={activeImage}
          alt="Property image"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-5 gap-2">
        {images.map((img) => (
          <button
            key={img}
            onClick={() => setActiveImage(img)}
            className={`relative aspect-square overflow-hidden rounded-md border ${
              activeImage === img
                ? "ring-2 ring-black"
                : "hover:opacity-80"
            }`}
            type="button"
          >
            <Image
              src={img}
              alt="Property thumbnail"
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
