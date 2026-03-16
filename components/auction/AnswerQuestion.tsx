"use client";

import { useState } from "react";

export default function AnswerQuestion({
  questionId,
}: {
  questionId: string;
}) {

  const [answer, setAnswer] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submitAnswer() {

    if (!answer.trim()) return;

    setLoading(true);

    await fetch("/api/questions/answer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        questionId,
        answer,
      }),
    });

    location.reload();
  }

  if (!showInput) {
    return (
      <button
        onClick={() => setShowInput(true)}
        className="text-sm text-blue-600 mt-2"
      >
        Answer Question
      </button>
    );
  }

  return (
    <div className="mt-2">
      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Type your answer..."
        className="w-full border rounded p-2 text-sm"
        rows={2}
      />

      <button
        onClick={submitAnswer}
        disabled={loading}
        className="mt-2 bg-blue-600 text-white px-3 py-1 rounded text-sm"
      >
        {loading ? "Submitting..." : "Submit Answer"}
      </button>
    </div>
  );
}