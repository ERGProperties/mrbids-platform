"use client"

import { useEffect, useState } from "react"

export function useLiveAuction(slug: string) {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    const source = new EventSource(
      `/api/auctions/${slug}/stream`
    )

    source.onmessage = (event) => {
      setData(JSON.parse(event.data))
    }

    return () => {
      source.close()
    }
  }, [slug])

  return data
}
