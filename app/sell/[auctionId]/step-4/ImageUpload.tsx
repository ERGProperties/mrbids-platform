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

  async function compressImage(file: File): Promise<File> {
    const bitmap = await createImageBitmap(file);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;

    const MAX = 1600;

    let width = bitmap.width;
    let height = bitmap.height;

    if (width > height && width > MAX) {
      height *= MAX / width;
      width = MAX;
    } else if (height > MAX) {
      width *= MAX / height;
      height = MAX;
    }

    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(bitmap, 0, 0, width, height);

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          resolve(
            new File([blob!], file.name, {
              type: "image/jpeg",
            })
          );
        },
        "image/jpeg",
        0.8
      );
    });
  }

  async function handleUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    if (!e.target.files?.length) return;

    setSaving(true);

    try {
      const files = Array.from(e.target.files);

      let latestImages: string[] = [];

      for (const file of files) {
        // ⭐ COMPRESS FIRST (fixes 413)
        const compressed = await compressImage(file);

        const formData = new FormData();
        formData.append("file", compressed);

        const res = await fetch(
          `/api/sell/${auction.id}/upload-image`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!res.ok) throw new Error("Upload failed");

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
    </div>
  );
}