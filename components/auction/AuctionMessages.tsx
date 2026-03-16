"use client";

import { useEffect, useState } from "react";

interface Message {
  id: string;
  body: string;
  sender: {
    id: string;
    email: string | null;
  };
  createdAt: string;
}

export default function AuctionMessages({
  auctionId,
}: {
  auctionId: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");

  async function loadMessages() {
    const res = await fetch(`/api/messages/${auctionId}`);
    const data = await res.json();
    setMessages(data);
  }

  useEffect(() => {
    loadMessages();
  }, []);

  async function sendMessage() {
    if (!message.trim()) return;

    await fetch("/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        auctionId,
        body: message,
      }),
    });

    setMessage("");
    await loadMessages();
  }

  return (
    <div className="border rounded-lg p-4 mt-6 bg-white">
      <h3 className="text-lg font-semibold mb-4">
        Messages
      </h3>

      <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">

        {messages.length === 0 && (
          <p className="text-sm text-gray-500">
            No messages yet.
          </p>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className="border rounded p-2 text-sm bg-gray-50"
          >
            <div className="text-xs text-gray-500 mb-1">
              {msg.sender.email}
            </div>

            <div>{msg.body}</div>
          </div>
        ))}

      </div>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        className="w-full border rounded p-2 text-sm"
        rows={3}
      />

      <button
        onClick={sendMessage}
        className="mt-2 bg-black text-white px-4 py-2 rounded text-sm"
      >
        Send Message
      </button>
    </div>
  );
}