"use client";

import Link from "next/link";

export default function ProfileCompletionBanner({
  user,
}: {
  user: any;
}) {
  const isIncomplete =
    !user?.name || !user?.bio;

  if (!isIncomplete) return null;

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 flex items-center justify-between">
      <div>
        <p className="font-medium">
          Complete your profile
        </p>
        <p className="text-sm text-gray-600">
          Add your name and bio to build trust with buyers and sellers.
        </p>
      </div>

      <Link
        href="/account/profile"
        className="bg-black text-white px-4 py-2 rounded-lg text-sm"
      >
        Complete Profile
      </Link>
    </div>
  );
}