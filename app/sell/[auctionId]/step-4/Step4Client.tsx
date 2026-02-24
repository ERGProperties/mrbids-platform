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
  // ⭐ normalize images (supports BOTH old local + new blob URLs)
  const [images, setImages] = useState<string[]>(
    (initialImages || []).map((img: string) =>
      img.startsWith("http")
        ? img
        : `${auction.imagesPath}/${img}`
    )
  );

  const [coverImage, setCoverImage] = useState<string | null>(
    auction.coverImage || null
  );

  const { setPreviewData } = useSellerPreview();

  // ⭐ keep seller preview synced
  useEffect(() => {
    setPreviewData({
      coverImage: coverImage || undefined,
    });
  }, [coverImage, setPreviewData]);

  // ⭐ auto-set first image as cover if none exists
  useEffect(() => {
    if (!coverImage && images.length > 0) {
      setCoverImage(images[0]);
    }
  }, [images, coverImage]);

  return (
    <>
      {/* IMAGE UPLOAD */}
      <ImageUpload
        auction={auction}
        onUploadComplete={(newImages: string[]) => {
          // normalize uploaded images too
          const normalized = newImages.map((img) =>
            img.startsWith("http")
              ? img
              : `${auction.imagesPath}/${img}`
          );

          setImages([...normalized]);
        }}
      />

      {/* IMAGE GRID */}
      {images.length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm font-medium text-gray-700 mb-3">
            Uploaded Images (click to set cover)
          </h2>

          <CoverImageGrid
            auctionId={auction.id}
            images={images}
            coverImage={coverImage}
            onCoverChange={(img: string) => {
              setCoverImage(img);
            }}
            onDelete={(img: string) => {
              setImages((prev) =>
                prev.filter((i) => i !== img)
              );

              if (coverImage === img) {
                setCoverImage(null);
              }
            }}
          />
        </div>
      )}

      {/* CONTINUE */}
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