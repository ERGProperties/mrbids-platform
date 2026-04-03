"use client";

import { useState } from "react";

export default function ProfileForm({ user }: { user: any }) {
  const [name, setName] = useState(user.name || "");
  const [bio, setBio] = useState(user.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || "");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const res = await fetch("/api/user/profile", {
        method: "POST",
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

      {/* AVATAR */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Profile Photo URL
        </label>
        <input
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          className="w-full border rounded-xl p-3"
          placeholder="Paste image URL (Cloudinary, etc)"
        />

        {avatarUrl && (
          <img
            src={avatarUrl}
            className="w-16 h-16 rounded-full mt-3 object-cover"
          />
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
        disabled={loading}
        className="w-full bg-black text-white py-3 rounded-xl"
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