import CountdownTimer from "@/components/CountdownTimer";

import Link from "next/link";

import WatchlistHeart from "@/components/WatchlistHeart";

export default function MarketplaceAuctionCard({
  auction,
}: {
  auction: any;
}) {

  const savings =
    auction.retailPrice
      ? Math.max(
          auction.retailPrice -
            auction.currentBid,
          0
        )
      : 0;

  return (
<Link
  href={`/marketplace-auctions/${auction.id}`}
className="
  group
  flex flex-col
  overflow-hidden
  rounded-3xl
  border border-zinc-800
  bg-[#18181b]
  shadow-lg
  transition-all
  duration-500
  hover:-translate-y-2
  hover:border-zinc-600
  hover:shadow-[0_20px_50px_rgba(0,0,0,0.45)]
"
>

      {/* IMAGE */}
<div className="relative aspect-[3/4] overflow-hidden bg-zinc-900">

{/* SAVE BUTTON */}
<WatchlistHeart auctionId={auction.id} />

  {auction.coverImage ? (

    <>
      <img
        src={auction.coverImage}
        alt={auction.title}
        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

<div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#18181b] to-transparent" />
    </>

  ) : (

    <div className="flex h-full w-full items-center justify-center bg-zinc-900 text-zinc-600">
      No Image Available
    </div>

  )}

  {/* STATUS BADGES */}
<div className="absolute left-4 top-4 flex flex-col gap-2">

  {auction.status === "LIVE" && (
    <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-bold tracking-wide text-white shadow-lg shadow-red-500/40">
      🔴 LIVE
    </span>
  )}

  {auction.status === "SCHEDULED" && (
    <span className="rounded-full bg-yellow-400 px-3 py-1 text-xs font-bold text-black">
      SCHEDULED
    </span>
  )}

  {auction.status === "ENDED" && (
    <span className="rounded-full bg-zinc-700 px-3 py-1 text-xs font-bold text-white">
      ENDED
    </span>
  )}

  {auction.freeShipping && (
    <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white">
      🚚 FREE SHIPPING
    </span>
  )}

  {auction.reservePrice ? (
  auction.currentBid >= auction.reservePrice ? (
    <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white">
      ✅ RESERVE MET
    </span>
  ) : (
    <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-black">
      🔒 RESERVE NOT MET
    </span>
  )
) : (
  <span className="rounded-full bg-blue-500 px-3 py-1 text-xs font-bold text-white">
    ⚡ NO RESERVE
  </span>
)}

  {auction.bidCount > 10 && (
    <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white">
      🔥 HOT AUCTION
    </span>
  )}

</div>

</div>

      {/* CONTENT */}
      <div className="p-5 md:p-6 flex flex-col flex-1">

        {/* CATEGORY */}
<div className="mb-4">
  <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-black">
    {auction.category}
  </span>
</div>

{/* TITLE */}
<h2 className="min-h-[72px] text-2xl font-bold leading-tight text-white">
  {auction.title}
</h2>

{/* SELLER */}
<div className="mt-5 flex items-center gap-3">

  {auction.seller?.avatarUrl ? (

    <img
      src={auction.seller.avatarUrl}
      alt={auction.seller.name || "Seller"}
      className="h-10 w-10 rounded-full border border-zinc-700 object-cover"
    />

  ) : (

    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-sm font-bold text-zinc-300">
      {auction.seller?.name?.charAt(0) || "M"}
    </div>

  )}

  <div className="flex-1">

  <div className="flex items-center gap-2">

    <p className="text-sm font-semibold text-white">
      {auction.seller?.name || "Marketplace Seller"}
    </p>

    {auction.seller?.username === "mrbids" && (
      <span
        className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white"
        title="Official MrBids Seller"
      >
        ✓
      </span>
    )}

  </div>

  {auction.seller?.tiktokUsername && (
    <p className="mt-1 text-xs text-zinc-400">
      @{auction.seller.tiktokUsername.replace(/^@/, "")}
    </p>
  )}

</div>

</div>

{/* CURRENT BID */}
<div className="mt-5 rounded-2xl border border-zinc-800 bg-zinc-950 p-5">

  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
    Current Bid
  </p>

  <p className="mt-1 text-4xl font-extrabold tracking-tight text-white">
    ${auction.currentBid?.toLocaleString()}
  </p>

{auction.endAt && (
  <div className="mt-4 border-t border-zinc-800 pt-4">

    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">
      Auction Ends
    </p>

    <CountdownTimer
      endAt={new Date(auction.endAt).toISOString()}
    />

    <div className="mt-3 flex items-center gap-2 text-sm text-orange-400">
      <span>🔥</span>
      <span className="font-medium">
        {auction.bidCount ?? 0} {auction.bidCount === 1 ? "Bid" : "Bids"}
      </span>
    </div>

  </div>
)}

</div>

        {/* RETAIL / SAVINGS */}
<div className="mt-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5">

  {auction.retailPrice ? (

    <div className="grid grid-cols-2 gap-6">

      <div>

        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-400">
          Retail
        </p>

        <p className="mt-1 text-xl font-bold text-emerald-200">
          ${auction.retailPrice.toLocaleString()}
        </p>

      </div>

      <div className="text-right">

        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-400">
          Savings
        </p>

        <p className="mt-1 text-xl font-bold text-emerald-200">
          ${savings.toLocaleString()}
        </p>

      </div>

    </div>

  ) : (

    <div className="py-3 text-center text-sm font-medium text-emerald-300">
      Retail price unavailable
    </div>

  )}

</div>

{/* BUTTON */}
<div className="mt-6">

  <div
    className="
      w-full
      rounded-full
      bg-white
      py-3
      text-center
      text-sm
      font-semibold
      text-black
      transition-all
      duration-300
      group-hover:bg-red-500
      group-hover:text-white
      group-hover:shadow-lg
      group-hover:shadow-red-500/30
    "
  >
    View Auction →
  </div>

</div>

      </div>

    </Link>
  );
}