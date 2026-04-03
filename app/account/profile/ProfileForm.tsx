"use client";

import { useState } from "react";

export default function ProfileForm({ user }: { user: any }) {
  const [name, setName] = useState(user.name || "");
  const [bio, setBio] = useState(user.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || "");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  // 🔥 Upload to Cloudinary
  async function handleImageUpload(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "mrbids_upload"); // 👈 your preset

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dx1okt4vf/image/upload", // 👈 replace this
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

    try {
      const res = await fetch("/api/user/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, bio, avatarUrl }),
      });

      if (res.ok) {
        setSuccess(true);
      }
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* 🔥 AVATAR UPLOAD */}
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
            }

            setUploading(false);
          }}
          className="w-full border rounded-xl p-3"
        />

        {/* Preview */}
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
          placeholder="Your name or company"
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
          placeholder="Investor buying in TX/FL..."
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
    </form>
  );
}