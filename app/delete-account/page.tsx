"use client";

import { useState } from "react";

import { signOut } from "next-auth/react";

export default function DeleteAccountPage() {

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    deleted,
    setDeleted,
  ] = useState(false);

  async function handleDelete() {

    const confirmed =
      window.confirm(
        "Are you sure you want to permanently delete your MrBids account?"
      );

    if (!confirmed) return;

    try {

      setLoading(true);

      const res =
        await fetch(
          "/api/delete-account",
          {
            method: "DELETE",
          }
        );

      if (!res.ok) {

        throw new Error(
          "Delete failed"
        );
      }

      setDeleted(true);

      setTimeout(() => {

        signOut({
          callbackUrl: "/",
        });

      }, 1500);

    } catch (err) {

      console.error(err);

      alert(
        "Failed to delete account."
      );

    } finally {

      setLoading(false);
    }
  }

  return (

    <main className="min-h-screen bg-gray-50 px-6 py-20">

      <div className="max-w-2xl mx-auto bg-white border rounded-2xl p-8">

        <h1 className="text-4xl font-bold text-black">
          Delete Your Account
        </h1>

        <p className="mt-6 text-gray-600 leading-7">
          Permanently delete your MrBids account and associated personal data.
        </p>

        <ul className="mt-6 space-y-3 text-gray-700 list-disc pl-6">

          <li>
            Your profile will be removed
          </li>

          <li>
            Your sessions and account access will end
          </li>

          <li>
            This action cannot be undone
          </li>

        </ul>

        <div className="mt-10">

          <button
            onClick={handleDelete}
            disabled={loading || deleted}
            className="
              bg-red-600
              hover:bg-red-700
              text-white
              px-6
              py-3
              rounded-xl
              font-medium
              transition
              disabled:opacity-50
            "
          >

            {loading
              ? "Deleting..."
              : deleted
              ? "Account Deleted"
              : "Delete My Account"}

          </button>

        </div>

      </div>

    </main>
  );
}