"use client";

import { useState } from "react";

export default function AskQuestion({ auctionId }: { auctionId: string }) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submitQuestion() {
    setError(null);

    if (!question.trim()) {
      setError("Please enter a question.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          auctionId,
          question,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setLoading(false);
        return;
      }

      setQuestion("");
      setLoading(false);

      // Refresh page to show new question
      location.reload();

    } catch (err) {
      setError("Failed to submit question.");
      setLoading(false);
    }
  }

  return (
    <div className="border rounded-lg p-4 mt-6 bg-gray-50">
      <h3 className="text-lg font-semibold mb-2">
        Ask Seller a Question
      </h3>

      <p className="text-sm text-gray-500 mb-3">
        You must be signed in to ask the seller a question.
      </p>

      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Example: Is the property currently vacant?"
        className="w-full border rounded p-2 text-sm"
        rows={3}
      />

      {error && (
        <p className="text-red-500 text-sm mt-2">
          {error}
        </p>
      )}

      <button
        onClick={submitQuestion}
        disabled={loading}
        className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
      >
        {loading ? "Submitting..." : "Submit Question"}
      </button>
    </div>
  );
}