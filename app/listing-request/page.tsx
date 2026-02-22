"use client"

import { useState } from "react"

export default function ListingRequestPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const form = new FormData(e.currentTarget)

    const data = {
      name: form.get("name"),
      email: form.get("email"),
      address: form.get("address"),
      details: form.get("details"),
    }

    setLoading(true)

    await fetch("/api/listing-request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    setLoading(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white border rounded-2xl p-8 max-w-md text-center">
          <h1 className="text-2xl font-semibold">
            Request Submitted
          </h1>
          <p className="mt-3 text-gray-600">
            Our team will review your listing shortly.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-xl mx-auto px-6 py-24">
        <h1 className="text-3xl font-semibold mb-6">
          Submit Your Property
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white border rounded-2xl p-6 space-y-4"
        >
          <input
            name="name"
            placeholder="Your Name"
            required
            className="w-full border rounded-lg px-4 py-2"
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="w-full border rounded-lg px-4 py-2"
          />

          <input
            name="address"
            placeholder="Property Address"
            required
            className="w-full border rounded-lg px-4 py-2"
          />

          <textarea
            name="details"
            placeholder="Property details..."
            rows={4}
            className="w-full border rounded-lg px-4 py-2"
          />

          <button
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded-lg"
          >
            {loading ? "Submitting..." : "Submit Listing"}
          </button>
        </form>
      </div>
    </main>
  )
}
