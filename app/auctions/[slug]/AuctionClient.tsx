"use client"

import BidForm from "./BidForm"
import BidHistory from "./BidHistory"
import { AuctionCountdown } from "@/components/auction/AuctionCountdown"
import { useLiveAuction } from "@/hooks/useLiveAuction"
import { useSession } from "next-auth/react"
import { SignInButton } from "@/components/auth/SignInButton"

export default function AuctionClient({
  auction,
  minimumBid,
}: {
  auction: {
    id: string
    slug: string
    title: string
    addressLine: string
    cityStateZip: string
    startingBid: number
    bidIncrement: number
    highestBid: number
    arv: number | null
    endsAt: string
    image: string | null
  }
  minimumBid: number
}) {
  const { data: session } = useSession()
  const live = useLiveAuction(auction.slug)

  const liveAuction = {
    ...auction,
    endsAt: live?.endsAt ?? auction.endsAt,
    highestBid: live?.highestBid ?? auction.highestBid,
  }

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-32">
        {/* HEADER */}
        <div className="mb-12">
          <p className="text-xs uppercase tracking-widest text-gray-400">
            Live Auction
          </p>
          <h1 className="mt-4 text-4xl font-semibold text-gray-900">
            {liveAuction.title}
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            {liveAuction.addressLine}, {liveAuction.cityStateZip}
          </p>
        </div>

        {/* COUNTDOWN */}
        <div className="mb-8">
          <AuctionCountdown endsAt={liveAuction.endsAt} />
        </div>

        {/* IMAGE */}
        <div className="mb-12 overflow-hidden rounded-2xl border border-gray-200 bg-white">
          {liveAuction.image ? (
            <img
              src={liveAuction.image}
              alt=""
              className="w-full h-[420px] object-cover"
            />
          ) : (
            <div className="h-[420px] flex items-center justify-center text-sm text-gray-400">
              No image available
            </div>
          )}
        </div>

        {/* AUCTION DETAILS */}
        <div className="mb-12 bg-white border border-gray-200 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          <Detail label="Starting Bid">
            ${liveAuction.startingBid.toLocaleString()}
          </Detail>

          <Detail label="Bid Increment">
            ${liveAuction.bidIncrement.toLocaleString()}
          </Detail>

          <Detail label="Current Bid">
            ${liveAuction.highestBid.toLocaleString()}
          </Detail>

          <Detail label="ARV">
            {liveAuction.arv
              ? `$${liveAuction.arv.toLocaleString()}`
              : "—"}
          </Detail>
        </div>

        {/* BID FORM */}
        {session ? (
          <BidForm
            slug={liveAuction.slug}
            minimumBid={minimumBid}
          />
        ) : (
          <SignInButton />
        )}

        {/* BID HISTORY */}
        <div className="mt-12">
          <BidHistory auctionId={liveAuction.id} />
        </div>

        {/* FOOTNOTE */}
        <p className="mt-12 text-xs text-gray-400 leading-relaxed">
          All bids are binding. Auction closes automatically
          at the stated end time. Seller retains discretion
          over acceptance.
        </p>
      </div>
    </main>
  )
}

function Detail({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <p className="text-sm font-medium text-gray-900">
        {label}
      </p>
      <p className="mt-1 text-sm text-gray-600">
        {children}
      </p>
    </div>
  )
}
