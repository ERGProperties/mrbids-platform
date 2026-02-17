"use client"

import { useSession } from "next-auth/react"

export default function ResultClient({
  auction,
}: {
  auction: {
    id: string
    slug: string
    addressLine: string
    cityStateZip: string
    finalPrice: number
    status: string
    result: string | null
    winnerEmail: string | null
    escrowStatus: string | null
    escrowAmount: number | null
    escrowDueBy: string | null
  }
}) {
  const { data: session } = useSession()

  const isWinner =
    session?.user?.email &&
    session.user.email === auction.winnerEmail

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-32">
        <h1 className="text-3xl font-semibold">
          {auction.addressLine}
        </h1>

        <p className="mt-2 text-lg text-gray-600">
          {auction.cityStateZip}
        </p>

        <div className="mt-10 bg-white border rounded-2xl p-8">
          <p className="text-sm text-gray-500">
            Final Price
          </p>
          <p className="mt-2 text-3xl font-bold">
            ${auction.finalPrice.toLocaleString()}
          </p>

          {auction.result && (
            <p className="mt-2 text-sm text-gray-700">
              Status:{" "}
              {auction.result.replace("_", " ")}
            </p>
          )}

          {auction.status === "CLOSED" &&
            isWinner &&
            auction.escrowStatus ===
              "PENDING" && (
              <EscrowBox auction={auction} />
            )}

          {auction.escrowStatus === "RECEIVED" && (
            <p className="mt-6 text-green-700 font-semibold">
              Escrow received. Proceeding to closing.
            </p>
          )}

          {auction.escrowStatus === "FAILED" && (
            <p className="mt-6 text-red-600 font-semibold">
              Escrow failed. Please contact support.
            </p>
          )}
        </div>
      </div>
    </main>
  )
}

function EscrowBox({
  auction,
}: {
  auction: {
    id: string
    escrowAmount: number | null
    escrowDueBy: string | null
  }
}) {
  return (
    <div className="mt-6 rounded-lg bg-yellow-50 border border-yellow-200 p-6">
      <p className="font-semibold text-yellow-700">
        Earnest Money Required
      </p>

      <p className="mt-2 text-sm text-yellow-700">
        Amount: $
        {auction.escrowAmount?.toLocaleString()}
      </p>

      <p className="text-sm text-yellow-700">
        Due By:{" "}
        {auction.escrowDueBy
          ? new Date(
              auction.escrowDueBy
            ).toLocaleDateString()
          : "—"}
      </p>

      <p className="mt-4 text-xs text-yellow-700">
        Wiring instructions will be emailed separately.
      </p>
    </div>
  )
}
