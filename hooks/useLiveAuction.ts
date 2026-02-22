"use client"

import { useEffect, useState } from "react"

type LiveAuctionData = {
  highestBid?: number
  endsAt?: string
  bidCount?: number
  watchers?: number
}

export function useLiveAuction(slug: string) {
  const [data, setData] =
    useState<LiveAuctionData | null>(null)

  useEffect(() => {
    const source = new EventSource(
      `/api/auctions/${slug}/stream`
    )

    source.onmessage = (event) => {
      try {
        setData(JSON.parse(event.data))
      } catch {}
    }

    source.onerror = () => {
      source.close()
    }

    return () => source.close()
  }, [slug])

  return data
}
