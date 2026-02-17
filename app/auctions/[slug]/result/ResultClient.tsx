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
    winnerEmail: string | null
  }
}) {
  const { data: session } = useSession()

  const isWinner =
    session?.user?.email &&
    session.user.email === auction.winnerEmail

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-32">
        <p className="text-xs uppercase tracking-widest text-gray-400">
          Auction Result
        </p>

        <h1 className="mt-4 text-4xl font-semibold text-gray-900">
          {auction.addressLine}
        </h1>

        <p className="mt-2 text-lg text-gray-600">
          {auction.cityStateZip}
        </p>

        <div className="mt-10 bg-white border border-gray-200 rounded-2xl p-8">
          <p className="text-sm text-gray-500">
            Final Sale Price
          </p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            ${auction.finalPrice.toLocaleString()}
          </p>

          {auction.status !== "CLOSED" && (
            <p className="mt-4 text-sm text-gray-500">
              Result pending finalization
            </p>
          )}

          {auction.status === "CLOSED" && isWinner && (
            <WinnerNextSteps
              address={auction.addressLine}
              price={auction.finalPrice}
            />
          )}

          {auction.status === "CLOSED" && !isWinner && (
            <div className="mt-6 rounded-lg bg-gray-100 p-6">
              <p className="text-sm font-medium text-gray-700">
                This auction has ended
              </p>
              <p className="mt-2 text-sm text-gray-600">
                Thank you for participating.
              </p>
            </div>
          )}
        </div>

        <p className="mt-10 text-xs text-gray-400">
          All auction results are final and subject to
          seller approval.
        </p>
      </div>
    </main>
  )
}

function WinnerNextSteps({
  address,
  price,
}: {
  address: string
  price: number
}) {
  return (
    <div className="mt-6 rounded-lg bg-green-50 border border-green-200 p-6">
      <p className="text-sm font-semibold text-green-700">
        🎉 You are the winning bidder
      </p>

      <div className="mt-4 space-y-3 text-sm text-green-700">
        <p>
          <strong>Property:</strong> {address}
        </p>
        <p>
          <strong>Final Price:</strong>{" "}
          ${price.toLocaleString()}
        </p>
      </div>

      <div className="mt-6 space-y-3 text-sm text-green-800">
        <p>
          <strong>Next Steps:</strong>
        </p>
        <ol className="list-decimal list-inside space-y-2">
          <li>
            Our team will contact you within 24 hours
            with the purchase agreement.
          </li>
          <li>
            Earnest money instructions will be provided
            via email.
          </li>
          <li>
            Closing will proceed through a licensed
            escrow or title company.
          </li>
        </ol>
      </div>

      <p className="mt-4 text-xs text-green-700">
        Please monitor your email for instructions.
      </p>
    </div>
  )
}
