"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ImageUpload from "./ImageUpload";
import CoverImageGrid from "./CoverImageGrid";
import { useSellerPreview } from "@/components/seller/SellerPreviewContext";

interface Props {
  auction: any;
  initialImages: string[];
}

export default function Step4Client({
  auction,
  initialImages,
}: Props) {
  const [images, setImages] = useState(initialImages);
  const [coverImage, setCoverImage] = useState(
    auction.coverImage || null
  );

  // ⭐ PREVIEW CONTEXT
  const { setPreviewData } = useSellerPreview();

  // ⭐ KEEP PREVIEW IMAGE IN SYNC
  useEffect(() => {
    setPreviewData({
      coverImage: coverImage || undefined,
    });
  }, [coverImage, setPreviewData]);

  return (
    <>
      {/* Upload */}
      <ImageUpload
        auction={auction}
        onUploadComplete={(newImages: string[]) => {
          setImages(newImages);
        }}
      />

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm font-medium text-gray-700 mb-3">
            Uploaded Images (click to set cover)
          </h2>

          <CoverImageGrid
            auctionId={auction.id}
            images={images}
            coverImage={coverImage}
            onCoverChange={(img: string) =>
              setCoverImage(img)
            }
          />
        </div>
      )}

      <div className="mt-10">
        <Link
          href={`/sell/${auction.id}/step-5`}
          className="inline-block px-6 py-3 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition"
        >
          Continue →
        </Link>
      </div>
    </>
  );
}