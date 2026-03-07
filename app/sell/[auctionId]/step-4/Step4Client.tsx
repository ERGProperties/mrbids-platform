"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  const [images, setImages] = useState<string[]>(
    initialImages || []
  );

  const [coverImage, setCoverImage] = useState<string | null>(
    auction.coverImage || null
  );

  const { setPreviewData } = useSellerPreview();

  const isValid = images.length > 0;

  useEffect(() => {
    setPreviewData({
      coverImage: coverImage || undefined,
    });
  }, [coverImage, setPreviewData]);

  useEffect(() => {
    if (!coverImage && images.length > 0) {
      setCoverImage(images[0]);
    }
  }, [images, coverImage]);

  return (
    <>

      {/* Upload Guidance */}
      <div className="mb-3">
        <p className="text-sm text-gray-600">
          Upload high-quality photos of the property.
        </p>
        <p className="text-sm text-gray-500">
          10–15 images recommended.
        </p>
      </div>

      {/* Upload Component */}
      <ImageUpload
        auction={auction}
        onUploadComplete={(newImages) => {
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
            onCoverChange={setCoverImage}
            onDelete={(img) => {
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

      {/* Save Helper */}
      {!isValid && (
        <p className="text-sm text-gray-500 mt-4">
          Upload at least one photo to continue
        </p>
      )}

      {/* Navigation */}
      <div className="mt-10 flex justify-between">

        <button
          type="button"
          onClick={() => router.push(`/sell/${auction.id}/step-3`)}
          className="px-5 py-3 border rounded-lg text-sm font-medium hover:bg-gray-100 transition"
        >
          ← Back
        </button>

        <Link
          href={`/sell/${auction.id}/step-5`}
          className={`px-6 py-3 rounded-lg text-sm font-medium transition ${
            isValid
              ? "bg-black text-white hover:bg-gray-900"
              : "bg-gray-300 text-gray-500 pointer-events-none"
          }`}
        >
          Continue →
        </Link>

      </div>

    </>
  );
}