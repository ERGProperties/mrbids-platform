"use client"

import { useEffect, useRef, useState } from "react"
import clsx from "clsx"

type Props = {
  endsAt: string
}

export function AuctionCountdown({ endsAt }: Props) {
  const [timeLeft, setTimeLeft] = useState(0)
  const [extended, setExtended] = useState(false)
  const previousEndsAt = useRef<Date | null>(null)

  useEffect(() => {
    const currentEndsAt = new Date(endsAt)

    if (
      previousEndsAt.current &&
      currentEndsAt.getTime() > previousEndsAt.current.getTime()
    ) {
      setExtended(true)
      setTimeout(() => setExtended(false), 6000)
    }

    previousEndsAt.current = currentEndsAt

    const tick = () => {
      const now = new Date()
      const diff = currentEndsAt.getTime() - now.getTime()
      setTimeLeft(Math.max(0, diff))
    }

    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [endsAt])

  const minutes = Math.floor(timeLeft / 1000 / 60)
  const seconds = Math.floor((timeLeft / 1000) % 60)
  const isUrgent = timeLeft <= 5 * 60 * 1000 && timeLeft > 0

  return (
    <div className="space-y-3">
      <div
        className={clsx(
          "inline-flex items-center rounded-xl px-5 py-3 text-3xl font-bold tracking-wide transition",
          isUrgent
            ? "bg-red-50 text-red-700 animate-pulse"
            : "bg-gray-100 text-gray-900"
        )}
      >
        {minutes}:{seconds.toString().padStart(2, "0")}
      </div>

      {isUrgent && (
        <div className="text-sm font-semibold text-red-600">
          Final minutes — bidding will extend if placed now
        </div>
      )}

      {extended && (
        <div className="rounded-md bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-800">
          Auction extended due to last-minute bid
        </div>
      )}
    </div>
  )
}
