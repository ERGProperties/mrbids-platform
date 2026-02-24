"use client";

import { useState } from "react";

interface Props {
  auction: any;
  onUploadComplete?: (images: string[]) => void;
}

export default function ImageUpload({
  auction,
  onUploadComplete,
}: Props) {
  const [saving, setSaving] = useState(false);

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files?.length) return;

    const file = e.target.files[0];

    const formData = new FormData();
    formData.append("file", file);

    try {
      setSaving(true);

      const res = await fetch(
        `/api/sell/${auction.id}/upload-image`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      // ⭐ CRITICAL FIX:
      // convert filenames → full image URLs
      if (data.images && onUploadComplete) {
        const fullImages = data.images.map(
          (img: string) =>
            `${auction.imagesPath}/${img}`
        );

        onUploadComplete(fullImages);
      }
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="border rounded-xl p-6 bg-white">
      <label className="block text-sm font-medium mb-3">
        Upload Property Images
      </label>

      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="block w-full text-sm"
      />

      <p className="text-xs text-gray-500 mt-3">
        {saving ? "Uploading..." : "Images saved"}
      </p>
    </div>
  );
}