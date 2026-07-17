"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

declare const fbq: any;
declare const gtag: any;

export default function ProfileForm({ user }: { user: any }) {

  const router = useRouter();

const params = new URLSearchParams(window.location.search);

const returnTo = params.get("returnTo");

const [username, setUsername] = useState(
  user.username || ""
);

const [name, setName] = useState(
  user.name || ""
);

const [sellerBio, setSellerBio] = useState(
  user.sellerBio || ""
);

const [sellerCategory, setSellerCategory] = useState(
  user.sellerCategory || ""
);

const [avatarUrl, setAvatarUrl] = useState(
  user.avatarUrl || ""
);

const [bannerUrl, setBannerUrl] = useState(
  user.bannerUrl || ""
);

const [checkingUsername, setCheckingUsername] =
  useState(false);

const [usernameAvailable, setUsernameAvailable] =
  useState<boolean | null>(null);

const [usernameMessage, setUsernameMessage] =
  useState("");

useEffect(() => {
  if (!username.trim()) {
    setUsernameAvailable(null);
    setUsernameMessage("");
    return;
  }

  const timeout = setTimeout(async () => {
    setCheckingUsername(true);

    try {
      const res = await fetch(
        `/api/username/check?username=${encodeURIComponent(username)}`
      );

      const data = await res.json();

      setUsernameAvailable(data.available);
      setUsernameMessage(data.message);
    } catch {
      setUsernameAvailable(false);
      setUsernameMessage(
        "Unable to check username."
      );
    }

    setCheckingUsername(false);
  }, 400);

  return () => clearTimeout(timeout);
}, [username]);

  const [loading, setLoading] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  const [error, setError] =
    useState("");

  // Upload to Cloudinary
  async function handleImageUpload(
    file: File
  ) {

    const formData =
      new FormData();

    formData.append(
      "file",
      file
    );

    formData.append(
      "upload_preset",
      "mrbids_upload"
    );

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dx1okt4vf/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data =
      await res.json();

    return data.secure_url;
  }

  async function handleSubmit(
    e: React.FormEvent
  ) {

    e.preventDefault();

    setLoading(true);

    setSuccess(false);

    setError("");

    try {

      const res = await fetch(
        "/api/user/profile",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

body: JSON.stringify({
  username,
  name,
  sellerBio,
  sellerCategory,
  avatarUrl,
  bannerUrl,
}),

        }
      );

      const data =
        await res.json();

      if (!res.ok) {

        setError(
          data.error ||
          "Failed to update profile"
        );

        return;

      }

      fbq(
        'track',
        'CompleteRegistration'
      );

      gtag(
        'event',
        'conversion',
        {
          send_to:
            'AW-18177376162/OdB9CMfGoLMcEKL_OttD'
        }
      );

setSuccess(true);

if (returnTo) {
  router.push(returnTo);
} else {
  router.refresh();
}

    } catch (err) {

      console.error(err);

      setError(
        "Something went wrong"
      );

    }

    setLoading(false);

  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >

      {/* AVATAR */}
      <div>

        <label className="block text-sm font-medium mb-2">
          Profile Photo
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={async (e) => {

            const file =
              e.target.files?.[0];

            if (!file) return;

            setUploading(true);

            try {

              const url =
                await handleImageUpload(
                  file
                );

              setAvatarUrl(url);

            } catch (err) {

              console.error(
                "Upload failed:",
                err
              );

              setError(
                "Image upload failed"
              );

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

{/* STOREFRONT BANNER */}
<div>

  <label className="block text-sm font-medium mb-2">
    Storefront Banner
  </label>

  <p className="text-sm text-gray-500 mb-3">
    Recommended size: 1600 × 400 pixels
  </p>

  <input
    type="file"
    accept="image/*"
    onChange={async (e) => {

      const file = e.target.files?.[0];

      if (!file) return;

      setUploading(true);

      try {

        const url =
          await handleImageUpload(file);

        setBannerUrl(url);

      } catch (err) {

        console.error(
          "Banner upload failed:",
          err
        );

        setError(
          "Banner upload failed"
        );

      }

      setUploading(false);

    }}
    className="w-full border rounded-xl p-3"
  />

  {bannerUrl && (

    <img
      src={bannerUrl}
      className="mt-4 w-full h-32 rounded-xl border object-cover"
    />

  )}

</div>

{/* USERNAME */}
<div>

  <label className="block text-sm font-medium mb-1">
    Username
  </label>

  <div className="flex items-center border rounded-xl p-3">
    <span className="text-gray-400 mr-1">@</span>

    <input
      value={username}
      onChange={(e) =>
        setUsername(e.target.value)
      }
      className="w-full outline-none"
      placeholder="yourname"
      autoComplete="off"
      spellCheck={false}
    />
  </div>

  <p className="text-sm text-gray-500 mt-2">
    Your storefront:
    <span className="font-medium ml-1">
      mrbids.com/@{username || "yourname"}
    </span>
  </p>

<div className="mt-2 min-h-[24px]">

  {checkingUsername && (
    <p className="text-sm text-gray-500">
      Checking username...
    </p>
  )}

  {!checkingUsername &&
    usernameMessage && (
      <p
        className={`text-sm ${
          usernameAvailable
            ? "text-green-600"
            : "text-red-600"
        }`}
      >
        {usernameAvailable ? "✓ " : "✕ "}
        {usernameMessage}
      </p>
    )}

</div>

</div>

      {/* NAME */}
      <div>

        <label className="block text-sm font-medium mb-1">
          Name
        </label>

        <input
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          className="w-full border rounded-xl p-3"
        />

      </div>

      {/* BIO */}
      <div>

        <label className="block text-sm font-medium mb-1">
          Bio
        </label>

        <textarea
          value={sellerBio}
          onChange={(e) =>
            setSellerBio(e.target.value)
          }
          className="w-full border rounded-xl p-3 h-28"
        />

      </div>

{/* SELLER CATEGORY */}
<div>

  <label className="block text-sm font-medium mb-1">
    Seller Category
  </label>

  <select
    value={sellerCategory}
    onChange={(e) =>
      setSellerCategory(e.target.value)
    }
    className="w-full border rounded-xl p-3"
  >
    <option value="">Select a category</option>

    <option value="Collectibles">
      Collectibles
    </option>

    <option value="Electronics">
      Electronics
    </option>

    <option value="Jewelry">
      Jewelry
    </option>

    <option value="Luxury Items">
      Luxury Items
    </option>

    <option value="Home & Garden">
      Home & Garden
    </option>

    <option value="Tools">
      Tools
    </option>

    <option value="Fashion">
      Fashion
    </option>

    <option value="Sports">
      Sports
    </option>

    <option value="Storage Finds">
      Storage Finds
    </option>

    <option value="General Merchandise">
      General Merchandise
    </option>
  </select>

</div>

      {/* BUTTON */}
<button
  type="submit"
  disabled={
    loading ||
    uploading ||
    checkingUsername ||
    usernameAvailable === false
  }
        className="w-full bg-black text-white py-3 rounded-xl disabled:opacity-60"
      >

        {loading
          ? "Saving..."
          : "Save Profile"}

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