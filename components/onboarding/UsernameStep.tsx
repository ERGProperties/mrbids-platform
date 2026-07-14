"use client";

import { useEffect, useState } from "react";

type CheckResponse = {
  available: boolean;
  valid: boolean;
  message: string;
};

type Props = {
  onContinue: () => void;
};

export default function UsernameStep({
  onContinue,
}: Props) {
  const [username, setUsername] = useState("");
  const [checking, setChecking] = useState(false);
  const [saving, setSaving] = useState(false);

  const [result, setResult] =
    useState<CheckResponse | null>(null);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState(false);

  useEffect(() => {
    if (!username.trim()) {
      setResult(null);
      return;
    }

    const timeout = setTimeout(async () => {
      setChecking(true);

      try {
        const res = await fetch(
          `/api/username/check?username=${encodeURIComponent(
            username
          )}`
        );

        const data: CheckResponse =
          await res.json();

        setResult(data);
      } catch {
        setResult({
          available: false,
          valid: false,
          message: "Unable to check username.",
        });
      }

      setChecking(false);
    }, 400);

    return () => clearTimeout(timeout);
  }, [username]);

  async function saveUsername() {
    if (!result?.available) return;

    setSaving(true);
    setError("");

    try {
      const res = await fetch(
        "/api/onboarding/username",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            username,
          }),
        }
      );

      const data =
        await res.json();

      if (!res.ok) {
        setError(
          data.error ??
            "Unable to save username."
        );
        return;
      }

      setSuccess(true);

      // Brief pause so the user sees the success message.
      setTimeout(() => {
        onContinue();
      }, 500);

    } catch {
      setError(
        "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">

      <div>

        <label
          htmlFor="username"
          className="block text-sm font-semibold text-gray-900 mb-2"
        >
          Choose Your Username
        </label>

        <div className="flex items-center rounded-xl border border-gray-300 px-4 py-3">

          <span className="text-gray-400 mr-1 text-lg">
            @
          </span>

          <input
            id="username"
            type="text"
            autoComplete="off"
            spellCheck={false}
            placeholder="yourname"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
            className="w-full bg-transparent outline-none text-lg"
          />

        </div>

        <div className="mt-3 min-h-[24px]">

          {checking && (
            <p className="text-sm text-gray-500">
              Checking availability...
            </p>
          )}

          {!checking &&
            result && (
              <p
                className={`text-sm ${
                  result.available
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {result.available
                  ? "✓ "
                  : "✕ "}
                {result.message}
              </p>
            )}

        </div>

        <p className="mt-2 text-sm text-gray-500">
          Your public storefront
        </p>

        <p className="font-medium text-gray-900">
          mrbids.com/@
          {username || "yourname"}
        </p>

      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
          Username saved successfully.
        </div>
      )}

      <button
        type="button"
        onClick={saveUsername}
        disabled={
          !result?.available ||
          saving
        }
        className={`w-full rounded-xl py-4 text-lg font-semibold transition ${
          result?.available &&
          !saving
            ? "bg-black text-white hover:opacity-90"
            : "bg-gray-200 text-gray-500 cursor-not-allowed"
        }`}
      >
        {saving
          ? "Saving..."
          : "Continue"}
      </button>

    </div>
  );
}