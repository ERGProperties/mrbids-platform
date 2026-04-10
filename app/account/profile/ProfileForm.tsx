"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfileForm({ user }: { user: any }) {
  const router = useRouter();

  const [name, setName] = useState(user.name || "");
  const [bio, setBio] = useState(user.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || "");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Upload to Cloudinary
  async function handleImageUpload(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "mrbids_upload");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dx1okt4vf/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    return data.secure_url;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError("");

    try {
      const res = await fetch("/api/user/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, bio, avatarUrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to update profile");
        return;
      }

      setSuccess(true);

      // 🔥 CRITICAL FIX: Refresh server data
      router.refresh();

    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* AVATAR */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Profile Photo
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            setUploading(true);

            try {
              const url = await handleImageUpload(file);
              setAvatarUrl(url);
            } catch (err) {
              console.error("Upload failed:", err);
              setError("Image upload failed");
            }

            setUploading(false);
          }}
          className="w-full border rounded-xl p-3"
        />

        {avatarUrl && (
          <img
            src={avatarUrl}
            className="w-20 h-20 rounded-full mt-4 object-cover border"
          />
        )}

        {uploading && (
          <p className="text-sm text-gray-500 mt-2">
            Uploading image...
          </p>
        )}
      </div>

      {/* NAME */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Name
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded-xl p-3"
        />
      </div>

      {/* BIO */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Bio
        </label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full border rounded-xl p-3 h-28"
        />
      </div>

      {/* BUTTON */}
      <button
        type="submit"
        disabled={loading || uploading}
        className="w-full bg-black text-white py-3 rounded-xl disabled:opacity-60"
      >
        {loading ? "Saving..." : "Save Profile"}
      </button>

      {/* SUCCESS */}
      {success && (
        <p className="text-green-600 text-sm">
          Profile updated successfully
        </p>
      )}

      {/* ERROR */}
      {error && (
        <p className="text-red-600 text-sm">
          {error}
        </p>
      )}
    </form>
  );
}