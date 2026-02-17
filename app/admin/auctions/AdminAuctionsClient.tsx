"use client"

import { useEffect, useState } from "react"

type AuctionRow = {
  id: string
  addressLine: string
  cityStateZip: string
  status: string
  result: string | null
  escrowStatus: string | null
  escrowAmount: number | null
  escrowDueBy: string | null
  highestBid: number
  endAt: string
}

export default function AdminAuctionsClient() {
  const [auctions, setAuctions] = useState<AuctionRow[]>([])
  const [loading, setLoading] = useState(false)

  const load = async () => {
    const res = await fetch("/api/admin/auctions")
    if (!res.ok) return
    setAuctions(await res.json())
  }

  useEffect(() => {
    load()
    const i = setInterval(load, 5000)
    return () => clearInterval(i)
  }, [])

  const updateEscrow = async (
    auctionId: string,
    escrowStatus: string
  ) => {
    setLoading(true)

    await fetch("/api/admin/escrow-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ auctionId, escrowStatus }),
    })

    await load()
    setLoading(false)
  }

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-32">
        <h1 className="mb-8 text-3xl font-semibold">
          Auction Control Panel
        </h1>

        <div className="bg-white border rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left">
                  Property
                </th>
                <th className="px-6 py-4 text-left">
                  Result
                </th>
                <th className="px-6 py-4 text-left">
                  Escrow
                </th>
                <th className="px-6 py-4 text-left">
                  Highest Bid
                </th>
                <th className="px-6 py-4 text-left">
                  Ended
                </th>
              </tr>
            </thead>

            <tbody>
              {auctions.map((a) => (
                <tr
                  key={a.id}
                  className="border-b last:border-none"
                >
                  <td className="px-6 py-5">
                    <p className="font-medium">
                      {a.addressLine}
                    </p>
                    <p className="text-xs text-gray-500">
                      {a.cityStateZip}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    {a.result ?? "—"}
                  </td>

                  <td className="px-6 py-5">
                    <select
                      value={a.escrowStatus ?? ""}
                      onChange={(e) =>
                        updateEscrow(
                          a.id,
                          e.target.value
                        )
                      }
                      className="border rounded px-2 py-1 text-sm"
                    >
                      <option value="">—</option>
                      <option value="RECEIVED">
                        RECEIVED
                      </option>
                      <option value="FAILED">
                        FAILED
                      </option>
                    </select>

                    {a.escrowAmount && (
                      <p className="mt-1 text-xs text-gray-500">
                        ${a.escrowAmount.toLocaleString()} due{" "}
                        {a.escrowDueBy
                          ? new Date(
                              a.escrowDueBy
                            ).toLocaleDateString()
                          : ""}
                      </p>
                    )}
                  </td>

                  <td className="px-6 py-5 font-medium">
                    ${a.highestBid.toLocaleString()}
                  </td>

                  <td className="px-6 py-5 text-gray-600">
                    {new Date(
                      a.endAt
                    ).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {loading && (
          <p className="mt-4 text-sm text-gray-500">
            Updating escrow…
          </p>
        )}
      </div>
    </main>
  )
}
