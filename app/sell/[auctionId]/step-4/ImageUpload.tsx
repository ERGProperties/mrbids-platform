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

  async function handleUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    if (!e.target.files?.length) return;

    setSaving(true);

    try {
      const files = Array.from(e.target.files);

      let latestImages: string[] = [];

      // upload files sequentially (stable for Vercel)
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

        if (!res.ok) {
          throw new Error("Upload failed");
        }

        const data = await res.json();

        if (data.images?.length) {
          latestImages = data.images;
        }
      }

      // update parent AFTER all uploads finish
      if (latestImages.length) {
        onUploadComplete?.(latestImages);
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      // ⭐ ALWAYS reset uploading state
      setSaving(false);

      // reset input so same file can re-upload
      e.target.value = "";
    }
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