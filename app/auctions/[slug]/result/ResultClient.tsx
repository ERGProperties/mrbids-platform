"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

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
    serviceFeeStatus: string | null
    serviceFeeAmount: number | null
  }
}) {
  const { data: session } = useSession()
  const [showCelebration, setShowCelebration] =
    useState(false)

  const isWinner =
    session?.user?.email &&
    session.user.email === auction.winnerEmail

  // 🎉 trigger celebration once
  useEffect(() => {
    if (isWinner) {
      setShowCelebration(true)

      const timer = setTimeout(() => {
        setShowCelebration(false)
      }, 4000)

      return () => clearTimeout(timer)
    }
  }, [isWinner])

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-32">

        {/* 🎉 WINNER CELEBRATION */}
        {showCelebration && (
          <div className="mb-6 rounded-xl bg-green-100 border border-green-300 px-5 py-4 animate-pulse">
            <p className="text-green-800 font-semibold text-lg">
              🎉 Congratulations — You Won This Auction!
            </p>
          </div>
        )}

        {/* HEADER */}
        <h1 className="text-3xl font-semibold">
          {auction.addressLine}
        </h1>

        <p className="mt-2 text-lg text-gray-600">
          {auction.cityStateZip}
        </p>

        {/* RESULT CARD */}
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

          {/* WINNER VIEW */}
          {isWinner ? (
            <div className="mt-6 rounded-lg bg-green-50 border border-green-200 p-5">
              <p className="font-semibold text-green-700">
                You are the winning bidder.
              </p>

              {auction.serviceFeeStatus ===
                "PENDING" && (
                <p className="mt-2 text-sm text-green-700">
                  Complete your 1% service fee to unlock
                  seller contact information.
                </p>
              )}

              {auction.serviceFeeStatus ===
                "PAID" && (
                <p className="mt-2 text-sm text-green-700">
                  Service fee received. Seller contact
                  information will be emailed shortly.
                </p>
              )}
            </div>
          ) : (
            <div className="mt-6 rounded-lg bg-gray-100 border border-gray-200 p-5">
              <p className="text-gray-700 font-medium">
                Auction Closed
              </p>
              <p className="text-sm text-gray-600 mt-1">
                This auction has ended.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
