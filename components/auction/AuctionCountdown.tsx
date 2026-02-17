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
