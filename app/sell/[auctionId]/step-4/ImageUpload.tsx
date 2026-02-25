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
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  async function handleUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    if (!e.target.files?.length) return;

    setSaving(true);

    try {
      const files = Array.from(e.target.files);

      // ⭐ instant previews
      const previews = files.map((file) =>
        URL.createObjectURL(file)
      );
      setPreviewUrls((prev) => [...prev, ...previews]);

      let latestImages: string[] = [];

      for (const file of files) {
        const compressedFile =
          await imageCompression(file, {
            maxSizeMB: 1.5,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
          });

        const formData = new FormData();
        formData.append("file", compressedFile);

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

      {/* ⭐ Instant Preview Grid */}
      {previewUrls.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          {previewUrls.map((src, i) => (
            <img
              key={i}
              src={src}
              alt="Preview"
              className="w-full h-32 object-cover rounded-lg"
            />
          ))}
        </div>
      )}
    </div>
  );
}