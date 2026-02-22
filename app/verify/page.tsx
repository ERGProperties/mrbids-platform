"use client"

import { useEffect, useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js"

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

export default function VerifyPage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/verify-bidder", {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret)
      })
  }, [])

  if (!clientSecret) {
    return <p className="p-10">Loading...</p>
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <VerifyForm />
    </Elements>
  )
}

function VerifyForm() {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) return

    setLoading(true)

    const card = elements.getElement(CardElement)
    if (!card) return

    const { error } = await stripe.confirmCardSetup(
      // @ts-ignore
      stripe._options.clientSecret,
      {
        payment_method: {
          card,
        },
      }
    )

    if (error) {
      setMessage(error.message || "Verification failed")
    } else {
      setMessage("Verification successful. You may now bid.")
    }

    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl border">
      <h2 className="text-xl font-semibold mb-4">
        Verify Payment Method
      </h2>

      <p className="text-sm text-gray-600 mb-6">
        Add a card to verify your account before bidding.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="border p-3 rounded mb-4">
          <CardElement />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded"
        >
          {loading ? "Verifying..." : "Verify Card"}
        </button>
      </form>

      {message && (
        <p className="mt-4 text-sm text-center">{message}</p>
      )}
    </div>
  )
}
