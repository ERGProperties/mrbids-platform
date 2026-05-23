"use client";

import {
  useState,
} from "react";

export default function FulfillmentControls({
  auctionId,
  currentStatus,
  currentTrackingNumber,
}: {
  auctionId: string;
  currentStatus?: string | null;
  currentTrackingNumber?: string | null;
}) {

  const [
    fulfillmentStatus,
    setFulfillmentStatus,
  ] = useState(
    currentStatus || "PENDING"
  );

  const [
    trackingNumber,
    setTrackingNumber,
  ] = useState(
    currentTrackingNumber || ""
  );

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    success,
    setSuccess,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState("");

  async function updateFulfillment() {

    try {

      setLoading(true);

      setSuccess("");

      setError("");

      const response =
        await fetch(
          `/api/marketplace-auctions/${auctionId}/fulfillment`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              fulfillmentStatus,
              trackingNumber,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {

        setError(
          data.error ||
          "Failed to update fulfillment"
        );

        return;
      }

      setSuccess(
        "Fulfillment updated successfully!"
      );

    } catch (err) {

      console.error(err);

      setError(
        "Something went wrong"
      );

    } finally {

      setLoading(false);

    }
  }

  return (

    <div className="mt-6 border-t border-gray-100 pt-5">

      <p className="text-xs uppercase tracking-wider text-gray-500 mb-4">
        Fulfillment Management
      </p>

      <div className="space-y-4">

        {/* STATUS */}
        <div>

          <label className="block text-sm text-gray-600 mb-2">
            Fulfillment Status
          </label>

          <select
            value={fulfillmentStatus}
            onChange={(e) =>
              setFulfillmentStatus(
                e.target.value
              )
            }
            className="w-full border rounded-2xl px-4 py-3"
          >

            <option value="PENDING">
              Pending
            </option>

            <option value="SHIPPED">
              Shipped
            </option>

            <option value="DELIVERED">
              Delivered
            </option>

            <option value="COMPLETED">
              Completed
            </option>

          </select>

        </div>

        {/* TRACKING */}
        <div>

          <label className="block text-sm text-gray-600 mb-2">
            Tracking Number
          </label>

          <input
            type="text"
            value={trackingNumber}
            onChange={(e) =>
              setTrackingNumber(
                e.target.value
              )
            }
            placeholder="Enter tracking number"
            className="w-full border rounded-2xl px-4 py-3"
          />

        </div>

        {/* ERROR */}
        {error && (

          <div className="border border-red-200 bg-red-50 text-red-600 rounded-2xl p-4">
            {error}
          </div>

        )}

        {/* SUCCESS */}
        {success && (

          <div className="border border-green-200 bg-green-50 text-green-600 rounded-2xl p-4">
            {success}
          </div>

        )}

        {/* BUTTON */}
        <button
          onClick={updateFulfillment}
          disabled={loading}
          className="w-full py-4 rounded-full bg-black text-white font-medium hover:opacity-90 transition disabled:opacity-50"
        >

          {loading
            ? "Updating..."
            : "Update Fulfillment"}

        </button>

      </div>

    </div>

  );

}