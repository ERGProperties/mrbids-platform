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
    connecting,
    setConnecting,
  ] = useState(false);

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

  async function connectStripe() {

    try {

      setConnecting(true);

      setError("");

      const response =
        await fetch(
          "/api/stripe/connect",
          {
            method: "POST",
          }
        );

      const data =
        await response.json();

      if (!response.ok) {

        setError(
          data.error ||
          "Failed to connect Stripe"
        );

        return;

      }

      if (!data.url) {

        setError(
          "Stripe onboarding URL missing"
        );

        return;

      }

      window.location.href =
        data.url;

    } catch (err) {

      console.error(err);

      setError(
        "Something went wrong"
      );

    } finally {

      setConnecting(false);

    }

  }

  if (loading) {

    return (

      <div className="inline-flex items-center px-5 py-3 rounded-full bg-gray-100 text-gray-600 font-medium">

        Checking Stripe status...

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

    <div className="space-y-4">

      <button
        onClick={
          connectStripe
        }
        disabled={
          connecting
        }
        className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white rounded-full font-medium hover:opacity-90 transition disabled:opacity-50"
      >

        {connecting
          ? "Redirecting..."
          : "Connect Stripe"}

      </button>

      {error && (

        <div className="text-sm text-red-600 font-medium">

          {error}

        </div>

      )}

    </div>

  );

}