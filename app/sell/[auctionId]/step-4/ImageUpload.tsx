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

      for (const file of files) {
        // 1️⃣ get upload URL
        const urlRes = await fetch(
          `/api/sell/${auction.id}/upload-url`,
          { method: "POST" }
        );

        const { uploadUrl } = await urlRes.json();

        // 2️⃣ DIRECT upload to Blob (NO SIZE LIMIT)
        const blobRes = await fetch(uploadUrl, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
        });

        const blob = await blobRes.json();

        // 3️⃣ save image in DB
        const saveRes = await fetch(
          `/api/sell/${auction.id}/upload-image`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              url: blob.url,
            }),
          }
        );

        const data = await saveRes.json();

        if (data.images?.length) {
          latestImages = data.images;
        }
      }

      if (latestImages.length) {
        onUploadComplete?.(latestImages);
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setSaving(false);
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