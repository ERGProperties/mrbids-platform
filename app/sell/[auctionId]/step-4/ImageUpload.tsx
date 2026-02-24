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

    const files = Array.from(e.target.files);

    try {
      setSaving(true);

      let latestImages: string[] = [];

      // ⭐ upload files one-by-one safely
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch(
          `/api/sell/${auction.id}/upload-image`,
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await res.json();

        if (data.images) {
          latestImages = data.images.map(
            (img: string) =>
              `${auction.imagesPath}/${img}`
          );
        }
      }

      // update UI once at end (feels faster)
      if (onUploadComplete) {
        onUploadComplete(latestImages);
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
        multiple
        onChange={handleUpload}
        className="block w-full text-sm"
      />

      <p className="text-xs text-gray-500 mt-3">
        {saving
          ? "Uploading images..."
          : "Images saved"}
      </p>
    </div>
  );
}