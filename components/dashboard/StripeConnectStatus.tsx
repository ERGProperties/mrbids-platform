"use client";

import {
  useEffect,
  useState,
} from "react";

export default function StripeConnectStatus() {

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    connected,
    setConnected,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  useEffect(() => {

    async function checkStripeStatus() {

      try {

        const response =
          await fetch(
            "/api/stripe/connect/status"
          );

        const data =
          await response.json();

        if (!response.ok) {

          setError(
            data.error ||
            "Failed to check Stripe status"
          );

          return;
        }

        setConnected(
          data.connected
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

    checkStripeStatus();

  }, []);

  if (loading) {

    return (

      <div className="inline-flex items-center px-5 py-3 rounded-full bg-gray-100 text-gray-600 font-medium">
        Checking Stripe status...
      </div>

    );

  }

  if (error) {

    return (

      <div className="inline-flex items-center px-5 py-3 rounded-full bg-red-100 text-red-600 font-medium">
        {error}
      </div>

    );

  }

  if (connected) {

    return (

      <div className="inline-flex items-center px-5 py-3 rounded-full bg-green-100 text-green-700 font-medium">
        Stripe Connected
      </div>

    );

  }

  return (

    <form
      action="/api/stripe/connect"
      method="POST"
    >

      <button
        type="submit"
        className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white rounded-full font-medium hover:opacity-90 transition"
      >
        Connect Stripe
      </button>

    </form>

  );

}