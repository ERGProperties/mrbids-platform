"use client"

import { useEffect, useState } from "react"

export default function RevenuePage() {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    fetch("/api/admin/revenue")
      .then((res) => res.json())
      .then(setData)
  }, [])

  if (!data) {
    return (
      <div className="p-10 text-gray-600">
        Loading revenue dashboard...
      </div>
    )
  }

  if (data.error) {
    return (
      <div className="p-10 text-red-600">
        {data.error}
      </div>
    )
  }

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-20">
        <h1 className="text-3xl font-semibold mb-10">
          Revenue Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card
            label="Total Revenue"
            value={`$${(
              data.totalRevenue / 100
            ).toLocaleString()}`}
          />

          <Card
            label="Paid Auctions"
            value={data.paidCount}
          />

          <Card
            label="Pending Fees"
            value={data.pendingCount}
          />
        </div>
      </div>
    </main>
  )
}

function Card({
  label,
  value,
}: {
  label: string
  value: string | number
}) {
  return (
    <div className="bg-white border rounded-2xl p-6">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  )
}
