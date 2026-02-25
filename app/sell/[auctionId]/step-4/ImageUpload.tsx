"use client";

import { useState } from "react";
import imageCompression from "browser-image-compression";

interface Props {
  auction: any;
  onUploadComplete?: (images: string[]) => void;
}

export default function ImageUpload({
  auction,
  onUploadComplete,
}: Props) {
  const [saving, setSaving] = useState(false);

  async function handleUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    if (!e.target.files?.length) return;

    setSaving(true);

    const files = Array.from(e.target.files);
    let latestImages: string[] = [];

    for (const file of files) {
      try {
        // ⭐ SAFE compression config
        const compressed = await imageCompression(file, {
          maxSizeMB: 2,
          maxWidthOrHeight: 1600,
          useWebWorker: true,
        });

        const formData = new FormData();
        formData.append("file", compressed);

        const res = await fetch(
          `/api/sell/${auction.id}/upload-image`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!res.ok) {
          console.warn("Upload failed:", file.name);
          continue;
        }

        const data = await res.json();

        if (data.images?.length) {
          latestImages = data.images;
        }
      } catch (err) {
        console.warn("Compression or upload failed:", file.name);
      }
    }

    if (latestImages.length) {
      onUploadComplete?.(latestImages);
    }

    setSaving(false);
    e.target.value = "";
  }

  return (
    <div className="border rounded-xl p-6 bg-white">
      <label className="block text-sm font-medium mb-3">
        Upload Property Images
      </label>

      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleUpload}
      />

      <p className="text-xs text-gray-500 mt-2">
        {saving ? "Uploading..." : "Images saved"}
      </p>
    </div>
  );
}